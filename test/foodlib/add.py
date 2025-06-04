import requests
import threading
import time
from concurrent.futures import ThreadPoolExecutor

url = "https://api.fanovian.cc:3000/api/foodlib/add"  # 或 trainlib/add

fail_count = 0
success_count = 0
lock = threading.Lock()
time_list = []
id_list = []

def add_item(i):
    global fail_count, success_count
    headers = {
        "Content-Type": "application/json"
    }
    # 食物库参数
    data = {
        "name": f"测试食物a{i}",
        "calories": 100 + i,
        "category": "staple",
        "note": f"备注{i}"
    }
    # 训练库参数（如测试训练库请用下面的data）
    # data = {
    #     "name": f"测试训练{i}",
    #     "category": "aerobic",
    #     "note": f"训练备注{i}"
    # }
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
                # 保存 food_id 或 train_id
                item_id = resp_json.get("food", {}).get("food_id") or resp_json.get("train", {}).get("train_id")
                if item_id:
                    id_list.append(item_id)
        else:
            with lock:
                fail_count += 1
        # print(f"添加: 状态码: {response.status_code}, 用时: {elapsed:.3f}s, 返回: {response.text}")
    except Exception as e:
        elapsed = time.time() - start
        with lock:
            fail_count += 1
            time_list.append(elapsed)
        print(f"添加异常: {e}, 用时: {elapsed:.3f}s")

if __name__ == "__main__":
    max_workers = 50
    max_tasks = 1000
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(add_item, range(max_tasks))
    total_time = time.time() - t0
    avg_time = sum(time_list) / len(time_list) if time_list else 0
    max_time = max(time_list) if time_list else 0
    min_time = min(time_list) if time_list else 0
    qps = max_tasks / total_time if total_time > 0 else 0
    print(f"完成{max_tasks}次添加，成功{success_count}次，失败{fail_count}次。")
    print(f"总耗时: {total_time:.2f}s，平均单次耗时: {avg_time:.3f}s，最大耗时: {max_time:.3f}s，最小耗时: {min_time:.3f}s")
    print(f"QPS（每秒处理请求数）: {qps:.2f}")
    # 保存id
    with open("item_ids.json", "w", encoding="utf-8") as f:
        import json
        json.dump(id_list, f, ensure_ascii=False, indent=2)