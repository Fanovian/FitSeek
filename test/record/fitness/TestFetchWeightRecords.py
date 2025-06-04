import requests
from concurrent.futures import ThreadPoolExecutor
import threading
import time
import json

url = "https://api.fanovian.cc:3000/api/fitness/get"

fail_count = 0
fail_list = []
success_count = 0
record_id_list = []  # 新增：用于保存record_id和token
lock = threading.Lock()
time_list = []

# 1. 读取token文件
with open("login_tokens.json", "r", encoding="utf-8") as f:
    token_list = json.load(f)
print(f"token总数: {len(token_list)}")

def fetch_weight_records(i):
    global fail_count, success_count
    token = token_list[i]["token"]
    headers = {
        "Authorization": f"Bearer {token}",
    }
    start = time.time()
    try:
        response = requests.get(url, headers=headers, timeout=150)
        elapsed = time.time() - start
        with lock:
            time_list.append(elapsed)
        resp_json = response.json()
        if response.status_code == 200 and resp_json.get("success", False):
            with lock:
                success_count += 1
                # 提取record_id
                records = resp_json.get("records", [])
                for record in records:
                    record_id = record.get("record_id")
                    if record_id:
                        record_id_list.append({"token": token, "record_id": record_id})
        else:
            with lock:
                fail_count += 1
                fail_list.append({"token": token, "resp": response.text})
        print(f"token: {token[:10]}..., 状态码: {response.status_code}, 用时: {elapsed:.3f}s, 返回: {response.text}")
    except Exception as e:
        elapsed = time.time() - start
        with lock:
            fail_count += 1
            fail_list.append({"token": token, "error": str(e)})
            time_list.append(elapsed)
        print(f"token {token[:10]}... 请求异常: {e}, 用时: {elapsed:.3f}s")

if __name__ == "__main__":
    max_workers = 50
    max_tasks = len(token_list)
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(fetch_weight_records, range(max_tasks))
    total_time = time.time() - t0
    avg_time = sum(time_list) / len(time_list) if time_list else 0
    max_time = max(time_list) if time_list else 0
    min_time = min(time_list) if time_list else 0
    qps = max_tasks / total_time if total_time > 0 else 0
    print(f"完成{max_tasks}次体重记录获取，成功{success_count}次，失败{fail_count}次。")
    print(f"总耗时: {total_time:.2f}s，平均单次耗时: {avg_time:.3f}s，最大耗时: {max_time:.3f}s，最小耗时: {min_time:.3f}s")
    print(f"QPS（每秒处理请求数）: {qps:.2f}")

    # 新增：写入record_id到文件
    with open("weight_record_ids.json", "w", encoding="utf-8") as f:
        json.dump(record_id_list, f, ensure_ascii=False, indent=2)
    print(f"已保存 {len(record_id_list)} 条record_id到 weight_record_ids.json")