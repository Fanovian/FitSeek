# FitSeek 首页数据获取方法文档

本文档详细说明了 FitSeek 首页（Home）模块的数据获取 JS 方法，便于前端开发调用和维护。

## 方法列表

### 1. 获取体重记录

- **方法名**: `fetchWeightRecords`
- **请求方式**: `GET`
- **接口地址**: `https://api.fanovian.cc:3000/api/weight/records`
- **请求头**: 
  - `Authorization`: JWT Token（从本地存储获取）
- **返回数据**:
  - `success`: 是否成功
  - `records`: 体重记录数组
- **调用示例**:
  ```js
  await this.fetchWeightRecords();
  ```
- **代码示例**:
  ```js
  async fetchWeightRecords() {
    try {
      const res = await uni.request({
        url: 'https://api.fanovian.cc:3000/api/weight/records',
        method: 'GET',
        header: {
          Authorization: uni.getStorageSync('jwtToken') || ''
        }
      });
      if (res.data && res.data.success) {
        this.weightRecords = res.data.records;
      }
    } catch (e) {
      // 网络异常等可忽略，保留示例数据
    }
  }
  ```

---

### 2. 获取体脂记录

- **方法名**: `fetchBodyFatRecords`
- **请求方式**: `GET`
- **接口地址**: `https://api.fanovian.cc:3000/api/bodyfat/records`
- **请求头**: 
  - `Authorization`: JWT Token（从本地存储获取）
- **返回数据**:
  - `success`: 是否成功
  - `records`: 体脂记录数组
- **调用示例**:
  ```js
  await this.fetchBodyFatRecords();
  ```
- **代码示例**:
  ```js
  async fetchBodyFatRecords() {
    try {
      const res = await uni.request({
        url: 'https://api.fanovian.cc:3000/api/bodyfat/records',
        method: 'GET',
        header: {
          Authorization: uni.getStorageSync('jwtToken') || ''
        }
      });
      if (res.data && res.data.success) {
        this.bodyFatRecords = res.data.records;
      }
    } catch (e) {
      // 网络异常等可忽略，保留示例数据
    }
  }
  ```

---

### 3. 获取锻炼记录

- **方法名**: `fetchTrainingRecords`
- **请求方式**: `GET`
- **接口地址**: `https://api.fanovian.cc:3000/api/training/records`
- **请求头**: 
  - `Authorization`: JWT Token（从本地存储获取）
- **返回数据**:
  - `success`: 是否成功
  - `records`: 锻炼记录数组
- **调用示例**:
  ```js
  await this.fetchTrainingRecords();
  ```
- **代码示例**:
  ```js
  async fetchTrainingRecords() {
    try {
      const res = await uni.request({
        url: 'https://api.fanovian.cc:3000/api/training/records',
        method: 'GET',
        header: {
          Authorization: uni.getStorageSync('jwtToken') || ''
        }
      });
      if (res.data && res.data.success) {
        this.trainingRecords = res.data.records;
      }
    } catch (e) {
      // 网络异常等可忽略，保留示例数据
    }
  }
  ```

---

## 说明

- 所有方法均需在组件 `created` 生命周期或需要时调用。
- 若接口异常，将保留本地示例数据，不影响页面展示。
- 所有接口均需携带用户 JWT Token 进行鉴权。

如需扩展更多首页相关数据方法，请补充本表。