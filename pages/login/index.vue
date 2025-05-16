
<template>
  <view class="login-container">
    <view class="form-container">
      <h2>{{ isRegister ? '注册' : '登录' }}</h2>
      <view class="form-group" v-if="isRegister">
        <label for="registerTel">手机号</label>
        <input v-model="registerTel" type="text" id="registerTel" placeholder="请输入手机号" required />
      </view>
      <view class="form-group" v-if="isRegister">
        <label for="registerName">用户名</label>
        <input v-model="registerName" type="text" id="registerName" placeholder="请输入用户名" required />
      </view>
      <view class="form-group" v-if="isRegister">
        <label for="registerPassword">密码</label>
        <input v-model="registerPassword" type="password" id="registerPassword" placeholder="请输入密码" required />
      </view>
      <!-- 登录表单 -->
      <view v-else>
        <view class="form-group">
          <label for="loginType">登录方式</label>
          <select v-model="loginType" id="loginType">
            <option value="0">手机号登录</option>
            <option value="1">用户名登录</option>
          </select>
        </view>
        <view class="form-group">
          <label for="value">{{ loginType === '0' ? '手机号' : '用户名' }}</label>
          <input v-model="value" type="text" id="value" placeholder="请输入手机号或用户名" required />
        </view>
        <view class="form-group">
          <label for="password">密码</label>
          <input v-model="password" type="password" id="password" placeholder="请输入密码" required />
        </view>
      </view>
      <button @click="isRegister ? handleRegister() : handleLogin()" class="login-btn">
        {{ isRegister ? '注册' : '登录' }}
      </button>
      <text class="error-message">{{ errorMessage }}</text>
      <view class="switch-link">
        <text @click="isRegister = !isRegister">
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    // 登录相关
    const loginType = ref('0');
    const value = ref('');
    const password = ref('');
    // 注册相关
    const registerTel = ref('');
    const registerName = ref('');
    const registerPassword = ref('');
    // 公共
    const errorMessage = ref('');
    const isRegister = ref(false);

    // 登录
    const handleLogin = async () => {
      errorMessage.value = '';
      if (!value.value || !password.value) {
        errorMessage.value = '请输入手机号/用户名和密码';
        return;
      }
      try {
        const response = await uni.request({
          url: 'http://123.206.217.44:3000/api/auth/login',
          method: 'POST',
          data: {
            type: parseInt(loginType.value),
            value: value.value,
            password: password.value
          }
        });
        if (response.data.success) {
          const token = response.data.token;
          uni.setStorageSync('jwtToken', token);
          uni.showToast({ title: '登录成功', icon: 'success' });
          uni.switchTab({ url: '/pages/home/index' });
        } else {
          errorMessage.value = response.data.message;
        }
      } catch (err) {
        errorMessage.value = '登录失败，请重试';
      }
    };

    // 注册
    const handleRegister = async () => {
      errorMessage.value = '';
      if (!registerTel.value || !registerName.value || !registerPassword.value) {
        errorMessage.value = '请填写完整注册信息';
        return;
      }
      try {
        const response = await uni.request({
          url: 'http://123.206.217.44:3000/api/auth/register',
          method: 'POST',
          data: {
            tel: registerTel.value,
            name: registerName.value,
            password: registerPassword.value
          }
        });
        if (response.data.success) {
          uni.showToast({ title: '注册成功，请登录', icon: 'success' });
          isRegister.value = false;
          // 可选：自动填充登录表单
          value.value = registerTel.value;
          password.value = registerPassword.value;
        } else {
          errorMessage.value = response.data.message;
        }
      } catch (err) {
        errorMessage.value = '注册失败，请重试';
      }
    };

    return {
      loginType,
      value,
      password,
      errorMessage,
      handleLogin,
      // 注册相关
      isRegister,
      registerTel,
      registerName,
      registerPassword,
      handleRegister
    };
  }
};
</script>