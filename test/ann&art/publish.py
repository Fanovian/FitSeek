import requests
import threading
import time
from concurrent.futures import ThreadPoolExecutor

url = "https://api.fanovian.cc:3000/api/article/publish"  # 或 announcement/publish

fail_count = 0
success_count = 0
lock = threading.Lock()
time_list = []
id_list = []

# 管理员用户名
publisher_name = "fitseek-admin"

def publish_article(i):
    global fail_count, success_count
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "publisher_name": publisher_name,
        "content": f"# 测试文章 {i}"
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
                # 存储 art_id 或 ann_id
                art_id = resp_json.get("article", {}).get("art_id") or resp_json.get("announcement", {}).get("ann_id")
                if art_id:
                    id_list.append(art_id)
        else:
            with lock:
                fail_count += 1
        # print(f"发布: 状态码: {response.status_code}, 用时: {elapsed:.3f}s, 返回: {response.text}")
    except Exception as e:
        elapsed = time.time() - start
        with lock:
            fail_count += 1
            time_list.append(elapsed)
        print(f"发布异常: {e}, 用时: {elapsed:.3f}s")

if __name__ == "__main__":
    max_workers = 50
    max_tasks = 1000
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        executor.map(publish_article, range(max_tasks))
    total_time = time.time() - t0
    avg_time = sum(time_list) / len(time_list) if time_list else 0
    max_time = max(time_list) if time_list else 0
    min_time = min(time_list) if time_list else 0
    qps = max_tasks / total_time if total_time > 0 else 0
    print(f"完成{max_tasks}次发布，成功{success_count}次，失败{fail_count}次。")
    print(f"总耗时: {total_time:.2f}s，平均单次耗时: {avg_time:.3f}s，最大耗时: {max_time:.3f}s，最小耗时: {min_time:.3f}s")
    print(f"QPS（每秒处理请求数）: {qps:.2f}")
    # 保存id
    with open("article_ids.json", "w", encoding="utf-8") as f:
        import json
        json.dump(id_list, f, ensure_ascii=False, indent=2)