import requests
from concurrent.futures import ThreadPoolExecutor
import threading
import time
import json

url = "https://api.fanovian.cc:3000/api/fitness/modify"

fail_count = 0
success_count = 0
lock = threading.Lock()
time_list = []

# 读取token和record_id文件（假设你有一个包含record_id的文件，结构如 [{"token": "...", "record_id": "..."}]）
with open("weight_record_ids.json", "r", encoding="utf-8") as f:
    modify_list = json.load(f)

def modify_fitness_record(i):
    global fail_count, success_count
    token = modify_list[i]["token"]
    record_id = modify_list[i]["record_id"]
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "record_id": record_id,
        "type": "weight",
        "value": 78.5 + i % 5,  # 示例：每个用户略有不同
        "note": f"First day of losing weight! {i}"
    }
    start = time.time()
    try:
        response = requests.post(url, headers=headers, json=data, timeout=150)
        elapsed = time.time() - start
        with lock:
            time_list.append(elapsed)
        resp_json = response.json()
        if response.status_code == 200 and resp_json.get("success", False):
            with lock:
                success_count += 1
        else:
            with lock:
                fail_count += 1
        print(f"token: {token[:10]}..., 状态码: {response.status_code}, 用时: {elapsed:.3f}s, 返回: {response.text}")
    except Exception as e:
        elapsed = time.time() - start
        with lock:
            fail_count += 1
            time_list.append(elapsed)
        print(f"token {token[:10]}... 请求异常: {e}, 用时: {elapsed:.3f}s")

if __name__ == "__main__":
    max_workers = 50
    max_tasks = len(modify_list)
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(modify_fitness_record, range(max_tasks))
    total_time = time.time() - t0
    avg_time = sum(time_list) / len(time_list) if time_list else 0
    max_time = max(time_list) if time_list else 0
    min_time = min(time_list) if time_list else 0
    qps = max_tasks / total_time if total_time > 0 else 0
    print(f"完成{max_tasks}次健康记录修改，成功{success_count}次，失败{fail_count}次。")
    print(f"总耗时: {total_time:.2f}s，平均单次耗时: {avg_time:.3f}s，最大耗时: {max_time:.3f}s，最小耗时: {min_time:.3f}s")
    print(f"QPS（每秒处理请求数）: {qps:.2f}")