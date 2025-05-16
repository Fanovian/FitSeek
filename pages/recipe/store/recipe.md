# FitSeek 饮食模块 API 文档

本文档详细说明了 FitSeek 应用中饮食（Recipe）模块所需的后端 API 接口。前端开发人员将根据此文档中的接口规范实现与后端的数据交互。

## 基础信息

- 基础路径：`/api/recipe`
- 响应格式：JSON
- 认证方式：待定（建议使用 JWT Token）

## 数据模型

### 1. 饮食记录 (MealRecord)

```json
{
  "id": 1,                     // 记录ID，整数
  "type": "早餐",              // 餐食类型：早餐、午餐、晚餐、加餐
  "name": "燕麦粥",            // 食物名称
  "calories": 200,             // 热量（千卡）
  "timestamp": "2025-05-16 08:30"  // 记录时间，格式：YYYY-MM-DD HH:MM
}
```

### 2. 每日记录 (DailyRecord)

```json
{
  "date": "2025-05-16",        // 日期，格式：YYYY-MM-DD
  "meals": [
    // MealRecord 对象数组
  ]
}
```

### 3. 用户配置 (UserConfig)

```json
{
  "userId": 1,                 // 用户ID
  "calorieTarget": 2000        // 每日热量摄入目标（千卡）
}
```

## API 端点

### 1. 获取饮食记录历史

获取用户的历史饮食记录。

- **URL**: `/api/recipe/history`
- **方法**: `GET`
- **URL 参数**: 
  - `startDate` (可选): 开始日期，格式：YYYY-MM-DD
  - `endDate` (可选): 结束日期，格式：YYYY-MM-DD
  - `limit` (可选): 返回记录天数，默认为7
  - `type` (可选): 按餐食类型筛选（早餐、午餐、晚餐、加餐）

#### 请求示例

```
GET /api/recipe/history?startDate=2025-05-10&endDate=2025-05-16
```

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "date": "2025-05-16",
      "meals": [
        {
          "id": 1,
          "type": "早餐",
          "name": "燕麦粥",
          "calories": 200,
          "timestamp": "2025-05-16 08:30"
        },
        {
          "id": 2,
          "type": "早餐",
          "name": "煮鸡蛋",
          "calories": 80,
          "timestamp": "2025-05-16 08:30"
        }
        // ...更多餐食记录
      ]
    },
    {
      "date": "2025-05-15",
      "meals": [
        // ...餐食记录
      ]
    }
    // ...更多日期记录
  ]
}
```

#### 错误响应

```json
{
  "code": 1001,
  "message": "未授权访问",
  "data": null
}
```

### 2. 添加饮食记录

添加新的饮食记录。

- **URL**: `/api/recipe/meal`
- **方法**: `POST`
- **请求体**: 

```json
{
  "type": "早餐",          // 必填，餐食类型
  "name": "燕麦粥",        // 必填，食物名称
  "calories": 200          // 必填，热量（千卡）
}
```

注意：无需传递 `id` 和 `timestamp`，这些字段由后端自动生成。

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 11,
    "type": "早餐",
    "name": "燕麦粥",
    "calories": 200,
    "timestamp": "2025-05-16 08:45"
  }
}
```

#### 错误响应

```json
{
  "code": 1002,
  "message": "参数错误",
  "data": {
    "errors": ["calories 必须是正整数"]
  }
}
```

### 3. 删除饮食记录

删除指定的饮食记录。

- **URL**: `/api/recipe/meal/{id}`
- **方法**: `DELETE`
- **URL 参数**: 
  - `id`: 要删除的记录ID
  - `date` (可选): 记录日期，格式：YYYY-MM-DD

#### 请求示例

```
DELETE /api/recipe/meal/11?date=2025-05-16
```

#### 成功响应

```json
{
  "code": 0,
  "message": "记录已成功删除",
  "data": null
}
```

#### 错误响应

```json
{
  "code": 1003,
  "message": "找不到对应记录",
  "data": null
}
```

### 4. 获取用户热量目标

获取用户设置的每日热量摄入目标。

- **URL**: `/api/recipe/calorie-target`
- **方法**: `GET`

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "calorieTarget": 2000
  }
}
```

### 5. 更新用户热量目标

更新用户的每日热量摄入目标。

- **URL**: `/api/recipe/calorie-target`
- **方法**: `PUT`
- **请求体**: 

```json
{
  "calorieTarget": 2200  // 必填，每日热量目标（千卡）
}
```

#### 成功响应

```json
{
  "code": 0,
  "message": "热量目标已更新",
  "data": {
    "calorieTarget": 2200
  }
}
```

#### 错误响应

```json
{
  "code": 1002,
  "message": "参数错误",
  "data": {
    "errors": ["calorieTarget 必须大于0"]
  }
}
```


## 日期和时间格式

- 日期格式：`YYYY-MM-DD`（如：2025-05-16）
- 时间格式：`YYYY-MM-DD HH:MM`（如：2025-05-16 08:30）

## 注意事项

1. 所有API调用应处理用户认证，确保只返回当前登录用户的饮食记录
2. 创建记录时，后端应验证字段值的合法性，特别是热量值必须为正整数
3. 热量目标值必须为正整数
4. 添加记录时，后端应自动填充当前时间作为 timestamp

