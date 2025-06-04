import requests
import json
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

url = "https://api.fanovian.cc:3000/api/training/add"

fail_count = 0
success_count = 0
lock = threading.Lock()
time_list = []

with open("login_tokens.json", "r", encoding="utf-8") as f:
    token_list = json.load(f)

def add_training_record(i):
    global fail_count, success_count
    token = token_list[i]["token"]
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    data = {
        "train_type": "aerobic",
        "duration": 30 + i % 10,
        "content": f"锻炼内容{i}",
        "note": f"测试{i}",
        "time": datetime.utcnow().isoformat() + "Z"
    }
    start = time.time()
    try:
        response = requests.post(url, headers=headers, json=data, timeout=150)
        elapsed = time.time() - start
        with lock:
            time_list.append(elapsed)
        if response.status_code == 200 and response.json().get("success", False):
            with lock:
                success_count += 1
        else:
            with lock:
                fail_count += 1
        #print(f"添加training: 状态码: {response.status_code}, 用时: {elapsed:.3f}s, 返回: {response.text}")
    except Exception as e:
        elapsed = time.time() - start
        with lock:
            fail_count += 1
            time_list.append(elapsed)
        print(f"添加training异常: {e}, 用时: {elapsed:.3f}s")

if __name__ == "__main__":
    max_workers = 50
    max_tasks = len(token_list)
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(add_training_record, range(max_tasks))
    total_time = time.time() - t0
    avg_time = sum(time_list) / len(time_list) if time_list else 0
    max_time = max(time_list) if time_list else 0
    min_time = min(time_list) if time_list else 0
    qps = max_tasks / total_time if total_time > 0 else 0
    print(f"完成{max_tasks}次training添加，成功{success_count}次，失败{fail_count}次。")
    print(f"总耗时: {total_time:.2f}s，平均单次耗时: {avg_time:.3f}s，最大耗时: {max_time:.3f}s，最小耗时: {min_time:.3f}s")
    print(f"QPS（每秒处理请求数）: {qps:.2f}")