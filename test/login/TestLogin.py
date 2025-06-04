import requests
from concurrent.futures import ThreadPoolExecutor
import threading
import time
import json

url = "https://api.fanovian.cc:3000/api/auth/login"

fail_count = 0
fail_list = []
token_list = []
lock = threading.Lock()
time_list = []

def login(i):
    global fail_count
    tel = f"00034567819{str(i).zfill(4)}"
    password = "password"
    data = {
        "type": 0,
        "value": tel,
        "password": password
    }
    start = time.time()
    try:
        response = requests.post(url, json=data, timeout=150)
        elapsed = time.time() - start
        resp_json = response.json()
        with lock:
            time_list.append(elapsed)
        if response.status_code == 200 and resp_json.get("success", False):
            token = resp_json.get("token", "")
            with lock:
                token_list.append({"tel": tel, "token": token})
        else:
            with lock:
                fail_count += 1
                fail_list.append({"tel": tel, "resp": response.text})
        print(f"登录账号: {tel}, 状态码: {response.status_code}, 用时: {elapsed:.3f}s, 返回: {response.text}")
    except Exception as e:
        elapsed = time.time() - start
        with lock:
            fail_count += 1
            fail_list.append({"tel": tel, "error": str(e)})
            time_list.append(elapsed)
        print(f"账号 {tel} 登录异常: {e}, 用时: {elapsed:.3f}s")

if __name__ == "__main__":
    max_workers = 50
    max_tasks = 1000  # 设置最大任务数
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(login, range(max_tasks))
    total_time = time.time() - t0
    avg_time = sum(time_list) / len(time_list) if time_list else 0
    max_time = max(time_list) if time_list else 0
    min_time = min(time_list) if time_list else 0
    qps = max_tasks / total_time if total_time > 0 else 0
    print(f"完成登录{max_tasks}个账号，失败{fail_count}个。")
    print(f"总耗时: {total_time:.2f}s，平均单次耗时: {avg_time:.3f}s，最大耗时: {max_time:.3f}s，最小耗时: {min_time:.3f}s")
    print(f"QPS（每秒处理请求数）: {qps:.2f}")
    if fail_count > 0:
        print(f"失败账号列表: {fail_list}")

    # 写入文件
    with open("login_tokens.json", "w", encoding="utf-8") as f:
        json.dump(token_list, f, ensure_ascii=False, indent=2)
    print(f"已保存 {len(token_list)} 个token到 login_tokens.json")