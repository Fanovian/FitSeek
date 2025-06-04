<template>
  <view class="container">
    <view class="user-info">
      <view class="username-row">
        <text class="username">{{ userInfo.name }}</text>
        <button class="edit-btn edit-btn-inline" @click="openEdit('name')">修改</button>
      </view>
    </view>

    <view class="profile-list">
      <view class="profile-item">
        <view class="item-left">
          <text class="label">手机号</text>
        </view>
        <view class="item-right">
          <text class="value">{{ userInfo.tel }}</text>
        </view>
      </view>
      <view class="profile-item">
        <view class="item-left">
          <text class="label">年龄</text>
          <button class="edit-btn" @click="openEdit('age')">修改</button>
        </view>
        <view class="item-right">
          <text class="value">{{ userInfo.age }}</text>
        </view>
      </view>
      <view class="profile-item">
        <view class="item-left">
          <text class="label">性别</text>
          <button class="edit-btn" @click="openEdit('gender')">修改</button>
        </view>
        <view class="item-right">
          <text class="value">{{ userInfo.gender }}</text>
        </view>
      </view>
      <view class="profile-item">
        <view class="item-left">
          <text class="label">身高(cm)</text>
          <button class="edit-btn" @click="openEdit('height')">修改</button>
        </view>
        <view class="item-right">
          <text class="value">{{ userInfo.height }}</text>
        </view>
      </view>
      <view class="profile-item">
        <view class="item-left">
          <text class="label">体重目标(kg)</text>
          <button class="edit-btn" @click="openEdit('weightGoal')">修改</button>
        </view>
        <view class="item-right">
          <text class="value">{{ userInfo.weightGoal }}</text>
        </view>
      </view>
      <view class="profile-item">
        <view class="item-left">
          <text class="label">密码</text>
          <button class="edit-btn" @click="openEdit('password')">修改</button>
        </view>
        <view class="item-right">
          <text class="value">********</text>
        </view>
      </view>
    </view>

    <button class="logout-btn" @click="logout" style="margin-top: 10rpx; margin-bottom: 40rpx;">退出登录</button>
    <!-- 统一资料弹窗 -->
    <uni-popup v-model="showEditProfile" type="dialog">
      <view class="popup-content" v-if="showEditProfile === 'name'">
        <view class="input-row">
          <text class="input-label">新昵称</text>
          <input type="text" v-model="tempValue" placeholder="请输入新用户名" class="popup-input" />
        </view>
        <button class="save-btn" @click="saveEdit('name')">保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'password'">
        <view class="input-row">
          <text class="input-label">新密码</text>
          <input v-model="tempValue" type="number" placeholder="请输入新密码" class="popup-input" />
        </view>
        <button class="save-btn" style="width: 80%;" @click="saveEdit('password')">保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'age'">
        <view class="input-row">
          <text class="input-label">年龄</text>
          <input v-model="tempValue" type="number" placeholder="请输入年龄" class="popup-input" />
        </view>
        <button class="save-btn" style="width: 80%;" @click="saveEdit('age')">保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'gender'">
        <picker :range="['男','女']" :value="['男','女'].indexOf(tempValue)" @change="e => tempValue.value = ['男','女'][e.detail.value]">
          <view class="picker-value">{{ tempValue }}</view>
        </picker>
        <button class="save-btn" style="width: 80%;" @click="saveEdit('gender')">保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'height'">
        <view class="input-row">
          <text class="input-label">身高</text>
          <input v-model="tempValue" type="number" placeholder="请输入身高(cm)" class="popup-input" />
        </view>
        <button class="save-btn" style="width: 80%;" @click="saveEdit('height')">保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'weightGoal'">
        <view class="input-row">
          <text class="input-label">目标体重</text>
          <input v-model="tempValue" type="number" placeholder="请输入体重目标(kg)" class="popup-input" />
        </view>
        <button class="save-btn" style="width: 80%;" @click="saveEdit('weightGoal')">保存</button>
      </view>
    </uni-popup>
    <view style="flex:1"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const userInfo = ref({
  tel: '12345678901',
  name: '健康达人',
  age: 25,
  gender: '男',
  height: 170,
  weightGoal: '68',
  password: '123456'
})

const showEditProfile = ref(false)
const tempValue = ref('')

function openEdit(field) {
  showEditProfile.value = field
  tempValue.value = userInfo.value[field]
}
function saveEdit(field) {
  userInfo.value[field] = tempValue.value
  showEditProfile.value = false
}
function logout() {
  uni.removeStorageSync('jwtToken')
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<style scoped>
.container {
  padding: 40rpx;
  background: #f5fff7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.user-info {
  text-align: center;
  margin-bottom: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18rpx;
}
.username-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}
.username {
  display: block;
  font-size: 36rpx;
  color: #388e3c;
  font-weight: bold;
  margin-bottom: 0;
}
.edit-btn {
  color: #43a047;
  background: #e8f5e9;
  border: none;
  font-size: 24rpx;
  border-radius: 10rpx;
  padding: 4rpx 18rpx;
  margin-left: 8rpx;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-btn-inline {
  background: none;
  color: #43a047;
  font-size: 24rpx;
  padding: 0 10rpx;
  border-radius: 8rpx;
  margin-left: 8rpx;
  box-shadow: none;
  font-weight: 400;
}
.user-info .edit-btn:not(.edit-btn-inline) {
  font-size: 30rpx;
  padding: 12rpx 48rpx;
  background: linear-gradient(90deg, #43a047 0%, #66bb6a 100%);
  color: #fff;
  font-weight: bold;
  border-radius: 18rpx;
  margin-left: 0;
  margin-top: 0;
  box-shadow: 0 2px 8px rgba(76,175,80,0.10);
}
.user-info .edit-btn:active {
  background: #388e3c;
}
.profile-list {
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 2px 12px rgba(76,175,80,0.06);
  padding: 30rpx;
  margin-bottom: 40rpx;
}
.profile-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 0;
  border-bottom: 1px solid #f0f0f0;
}
.profile-item:last-child {
  border-bottom: none;
}
.item-left {
  display: flex;
  align-items: center;
  gap: 18rpx;
  min-width: 180rpx;
}
.label {
  color: #388e3c;
  font-size: 28rpx;
}
.item-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.value {
  color: #333;
  font-size: 28rpx;
  margin-left: 10rpx;
}
.logout-btn {
  width: 100%;
  background: linear-gradient(90deg, #43a047 0%, #66bb6a 100%);
  color: #fff;
  font-size: 32rpx;
  border: none;
  border-radius: 16rpx;
  padding: 22rpx 0;
  font-weight: bold;
  letter-spacing: 2rpx;
  box-shadow: 0 2px 8px rgba(76,175,80,0.10);
  margin-top: 40rpx;
  margin-bottom: 10rpx;
}
.popup-content {
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  align-items: center;
}
.input-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 10rpx;
}
.input-label {
  min-width: 80rpx;
  color: #388e3c;
  font-size: 28rpx;
  text-align: right;
}
.popup-input {
  flex: 1;
  border: 1px solid #d0e6d6;
  border-radius: 10rpx;
  padding: 14rpx 18rpx;
  font-size: 28rpx;
  background: #f8fff9;
  color: #333;
}
.save-btn {
  background: #43a047;
  color: #fff;
  border-radius: 10rpx;
  padding: 18rpx 0;
  font-size: 28rpx;
  font-weight: bold;
  margin-top: 10rpx;
  width: 80%;
}
.picker-value {
  padding: 18rpx 0;
  color: #388e3c;
  font-size: 28rpx;
  text-align: center;
}
</style>