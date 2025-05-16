# FitSeek 训练模块 API 文档

本文档详细说明了 FitSeek 应用中训练（Training）模块所需的后端 API 接口。前端开发人员将根据此文档中的接口规范实现与后端的数据交互。

## 基础信息

- 基础路径：`/api/training`
- 响应格式：JSON
- 认证方式：待定

## 数据模型

### 1. 锻炼记录 (WorkoutRecord)

```json
{
  "id": 1,                      // 记录ID，整数
  "workoutType": "cardio",      // 锻炼类型，字符串，可选值：cardio, strength, stretch, other
  "typeName": "有氧",           // 锻炼类型名称
  "content": "慢跑",            // 锻炼内容描述
  "duration": "30",             // 锻炼时长（分钟）
  "createdAt": "2025-05-15 15:30:00"  // 创建时间，格式：YYYY-MM-DD HH:MM:SS
}
```

### 2. 训练目标 (TrainingTarget)

```json
{
  "weeklyMinutes": 120          // 每周锻炼时长目标（分钟），整数
}
```

## API 端点

### 1. 获取锻炼记录列表

获取用户的所有锻炼记录。

- **URL**: `/api/training/records`
- **方法**: `GET`
- **URL 参数**: 
  - `page` (可选): 页码，默认为1
  - `limit` (可选): 每页记录数，默认为20
  - `type` (可选): 按锻炼类型筛选 (cardio, strength, stretch, other)

#### 请求示例

```
GET /api/training/records?page=1&limit=10&type=cardio
```

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "records": [
      {
        "id": 1,
        "workoutType": "cardio",
        "typeName": "有氧",
        "content": "慢跑",
        "duration": "30",
        "createdAt": "2025-05-15 15:30:00"
      },
      // ... 更多记录
    ]
  }
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

### 2. 添加锻炼记录

添加新的锻炼记录。

- **URL**: `/api/training/records`
- **方法**: `POST`
- **请求体**: 

```json
{
  "workoutType": "cardio",      // 必填，锻炼类型
  "content": "慢跑",            // 必填，锻炼内容描述
  "duration": "30"              // 必填，锻炼时长（分钟）
}
```

注意：无需传递 `id` 和 `createdAt`，这些字段由后端自动生成。后端应根据 `workoutType` 自动设置 `typeName`。

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 10,
    "workoutType": "cardio",
    "typeName": "有氧",
    "content": "慢跑",
    "duration": "30",
    "createdAt": "2025-05-16 09:15:30"
  }
}
```

#### 错误响应

```json
{
  "code": 1002,
  "message": "参数错误",
  "data": {
    "errors": ["workoutType 为必填项"]
  }
}
```

### 3. 删除锻炼记录

删除指定的锻炼记录。

- **URL**: `/api/training/records/{id}`
- **方法**: `DELETE`
- **URL 参数**: 
  - `id`: 要删除的记录ID

#### 请求示例

```
DELETE /api/training/records/10
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

或

```json
{
  "code": 1004,
  "message": "无权删除此记录",
  "data": null
}
```

### 4. 获取用户训练目标

获取用户当前设置的训练目标。

- **URL**: `/api/training/target`
- **方法**: `GET`

#### 成功响应

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "weeklyMinutes": 120
  }
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

### 5. 更新用户训练目标

更新用户的训练目标设置。

- **URL**: `/api/training/target`
- **方法**: `PUT`
- **请求体**: 

```json
{
  "weeklyMinutes": 180      // 必填，每周锻炼时长目标（分钟）
}
```

#### 成功响应

```json
{
  "code": 0,
  "message": "训练目标已更新",
  "data": {
    "weeklyMinutes": 180
  }
}
```

#### 错误响应

```json
{
  "code": 1002,
  "message": "参数错误",
  "data": {
    "errors": ["weeklyMinutes 必须为正整数"]
  }
}
```


## 锻炼类型映射

前端定义了以下锻炼类型，后端需保持一致：

| 类型值 (workoutType) | 显示名称 (typeName) | 图标路径 |
|-----------------|-----------------|---------|
| cardio          | 有氧              | /static/icons/training/cardio.svg |
| strength        | 无氧              | /static/icons/training/strength.svg |
| stretch         | 拉伸              | /static/icons/training/stretch.svg |
| other           | 其他              | /static/icons/training/other.svg |

## 注意事项

1. 所有API调用应处理用户认证，确保只返回当前登录用户的锻炼记录和训练目标
2. 创建记录时，后端应验证字段值的合法性
3. 时间格式应统一为 `YYYY-MM-DD HH:MM:SS`
4. 训练目标设置中的值必须为正整数


