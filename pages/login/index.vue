<template>
  <view class="login-bg">
    <view class="logo-area">
      <image src="/static/logo.png" class="logo-img" mode="aspectFit"></image>
      <text class="logo-title">FitSeek</text>
    </view>
    <view class="form-container">
      <h2 class="form-title">{{ isRegister ? '注册' : '登录' }}</h2>
      <view v-if="isRegister">
        <view class="form-group">
          <label>手机号</label>
          <input v-model="registerTel" type="text" placeholder="请输入手机号" maxlength="11" />
        </view>
        <view class="form-group">
          <label>用户名</label>
          <input v-model="registerName" type="text" placeholder="请输入用户名" />
        </view>
        <view class="form-group">
          <label>密码</label>
          <input v-model="registerPassword" type="password" placeholder="请输入密码" maxlength="20" />
        </view>
      </view>
      <view v-else>
        <view class="form-group">
          <label>登录方式</label>
          <picker :range="loginTypeOptions" :value="loginTypeIndex" @change="onLoginTypeChange">
            <view class="picker">
              {{ loginTypeOptions[loginTypeIndex] }}
            </view>
          </picker>
        </view>
        <view class="form-group">
          <label>{{ loginType === '0' ? '手机号' : '用户名' }}</label>
          <input v-model="value" type="text" :placeholder="loginType === '0' ? '请输入手机号' : '请输入用户名'" />
        </view>
        <view class="form-group">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" maxlength="20" />
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
    const value = ref('');
    const password = ref('');
    // 注册相关
    const registerTel = ref('');
    const registerName = ref('');
    const registerPassword = ref('');
    // 公共
    const errorMessage = ref('');
    const isRegister = ref(false);

    const loginTypeOptions = ['手机号登录', '用户名登录'];
    const loginTypeIndex = ref(0);
    const loginType = ref('0');

    // 登录
    const handleLogin = async () => {
      errorMessage.value = '';
      if (!value.value || !password.value) {
        errorMessage.value = '请输入手机号/用户名和密码';
        return;
      }
      try {        
		  const response = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/auth/login', // 使用HTTP
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
          console.log('JWT Token:', uni.getStorageSync('jwtToken'))
          
          // 保存用户信息用于资料页面
          const userInfo = {
            tel: loginType.value === '0' ? value.value : '', // 如果是手机号登录则保存手机号
            name: loginType.value === '1' ? value.value : '', // 如果是用户名登录则保存用户名
            loginValue: value.value, // 保存登录时使用的值
            loginType: loginType.value
          };
          uni.setStorageSync('userInfo', userInfo);
          
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
          url: 'https://api.fanovian.cc:3000/api/auth/register',
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
          value.value = registerTel.value;
          password.value = registerPassword.value;
        } else {
          errorMessage.value = response.data.message;
        }
      } catch (err) {
        errorMessage.value = '注册失败，请重试';
      }
    };

    const onLoginTypeChange = (e) => {
      loginTypeIndex.value = e.detail.value;
      loginType.value = String(e.detail.value);
    };

    return {
      loginType,
      loginTypeOptions,
      loginTypeIndex,
      onLoginTypeChange,
      value,
      password,
      errorMessage,
      handleLogin,
      isRegister,
      registerTel,
      registerName,
      registerPassword,
      handleRegister
    };
  }
};
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.logo-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80rpx;
  margin-bottom: 30rpx;
}
.logo-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 16px rgba(76,175,80,0.15);
}
.logo-title {
  margin-top: 16rpx;
  font-size: 40rpx;
  color: #388e3c;
  font-weight: bold;
  letter-spacing: 4rpx;
}
.form-container {
  width: 80vw;
  max-width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8px 32px rgba(76,175,80,0.10);
  padding: 48rpx 32rpx 32rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.form-title {
  color: #388e3c;
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32rpx;
  letter-spacing: 2rpx;
}
.form-group {
  margin-bottom: 28rpx;
  display: flex;
  flex-direction: column;
}
.form-group label {
  color: #388e3c;
  font-size: 26rpx;
  margin-bottom: 8rpx;
}
input, select {
  border: 1px solid #c8e6c9;
  border-radius: 12rpx;
  padding: 18rpx 20rpx;
  font-size: 28rpx;
  background: #f1f8e9;
  outline: none;
  transition: border-color 0.2s;
}
input:focus, select:focus {
  border-color: #66bb6a;
}
.login-btn {
  background: linear-gradient(90deg, #43a047 0%, #66bb6a 100%);
  color: #fff;
  font-size: 32rpx;
  border: none;
  border-radius: 16rpx;
  padding: 22rpx 0;
  margin-top: 10rpx;
  margin-bottom: 18rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  box-shadow: 0 2px 8px rgba(76,175,80,0.10);
  /* 新增宽度设置 */
  width: 100%;
  min-width: 200rpx;
  max-width: 100%;
  align-self: center;
}
.login-btn:active {
  background: #388e3c;
}
.switch-link {
  text-align: center;
  margin-top: 10rpx;
}
.switch-link text {
  color: #43a047;
  font-size: 26rpx;
  text-decoration: underline;
  cursor: pointer;
}
.error-message {
  color: #e53935;
  font-size: 24rpx;
  text-align: center;
  margin-bottom: 8rpx;
  min-height: 32rpx;
  display: block;
}
.picker {
  border: 1px solid #c8e6c9;
  border-radius: 12rpx;
  padding: 18rpx 20rpx;
  font-size: 28rpx;
  background: #f1f8e9;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60rpx;
}
</style>