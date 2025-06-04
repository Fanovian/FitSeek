import requests
from concurrent.futures import ThreadPoolExecutor
import threading
import time

url = "https://api.fanovian.cc:3000/api/auth/register"

fail_count = 0
fail_list = []
lock = threading.Lock()
time_list = []

def register(i):
    global fail_count
    tel = f"00034567819{str(i).zfill(4)}"
    name = f"t1aaestusera{i}"
    password = "password"
    data = {
        "tel": tel,
        "name": name,
        "password": password
    }
    start = time.time()
    try:
        response = requests.post(url, json=data, timeout=150)
        elapsed = time.time() - start
        with lock:
            time_list.append(elapsed)
        if response.status_code != 200 or not response.json().get("success", False):
            with lock:
                fail_count += 1
                fail_list.append({"name": name, "tel": tel, "resp": response.text})
        print(f"注册账号: {name}, 状态码: {response.status_code}, 用时: {elapsed:.3f}s, 返回: {response.text}")
    except Exception as e:
        elapsed = time.time() - start
        with lock:
            fail_count += 1
            fail_list.append({"name": name, "tel": tel, "error": str(e)})
            time_list.append(elapsed)
        print(f"账号 {name} 注册异常: {e}, 用时: {elapsed:.3f}s")

if __name__ == "__main__":
    max_workers = 50  # 设置最大线程数
    max_tasks = 1000  # 设置最大任务数
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(register, range(max_tasks))
    total_time = time.time() - t0
    avg_time = sum(time_list) / len(time_list) if time_list else 0
    max_time = max(time_list) if time_list else 0
    min_time = min(time_list) if time_list else 0
    qps = max_tasks / total_time if total_time > 0 else 0
    print(f"完成注册{max_tasks}个账号，失败{fail_count}个。")
    print(f"总耗时: {total_time:.2f}s，平均单次耗时: {avg_time:.3f}s，最大耗时: {max_time:.3f}s，最小耗时: {min_time:.3f}s")
    print(f"QPS（每秒处理请求数）: {qps:.2f}")