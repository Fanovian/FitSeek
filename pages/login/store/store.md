# FitSeek 登录/注册模块 API 路由与方法文档

本文档汇总了登录与注册相关的 API 路由、请求参数、返回格式及前端调用方式，便于开发与维护。

## 1. 登录接口

- **URL**: `https://api.fanovian.cc:3000/api/auth/login`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "type": 0,           // 登录方式，0=手机号，1=用户名
    "value": "手机号或用户名",
    "password": "密码"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "token": "JWT_TOKEN",
    "message": "登录成功"
  }
  ```
- **失败响应**:
  ```json
  {
    "success": false,
    "message": "错误信息"
  }
  ```
- **前端调用示例**:
  ```js
  const response = await uni.request({
    url: 'https://api.fanovian.cc:3000/api/auth/login',
    method: 'POST',
    data: {
      type: parseInt(loginType.value),
      value: value.value,
      password: password.value
    }
  });
  if (response.data.success) {
    uni.setStorageSync('jwtToken', response.data.token);
    uni.switchTab({ url: '/pages/home/index' });
  }
  ```

---

## 2. 注册接口

- **URL**: `https://api.fanovian.cc:3000/api/auth/register`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "tel": "手机号",
    "name": "用户名",
    "password": "密码"
  }
  ```
- **成功响应**:
  ```json
  {
    "success": true,
    "message": "注册成功"
  }
  ```
- **失败响应**:
  ```json
  {
    "success": false,
    "message": "错误信息"
  }
  ```
- **前端调用示例**:
  ```js
  const response = await uni.request({
    url: 'https://api.fanovian.cc:3000/api/auth/register',
    method: 'POST',
    data: {
      tel: registerTel.value,
      name: registerName.value,
      password: registerPassword.value
    }
  });
  if (response.data.success) {
    // 注册成功后自动填充登录表单
    isRegister.value = false;
    value.value = registerTel.value;
    password.value = registerPassword.value;
  }
  ```

---

## 3. 账号测试信息

- 测试账号：
  - 用户名/手机号：`test2` / `12345678900`
  - 密码：`password`

---

## 说明

- 登录成功后，JWT Token 需通过 `uni.setStorageSync('jwtToken', token)` 存储，后续接口需带上该 token。
- 注册成功后可直接用注册信息登录。
- 错误信息通过 `message` 字段返回，前端可直接展示。

如有接口变更，请及时同步本文件。