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

const showEditName = ref(false)
// const showEditPassword = ref(false)
const showEditProfile = ref(false)
const tempValue = ref('')
const tempname = ref('')

function openEdit(field) {
  showEditProfile.value = field
  tempValue.value = userInfo.value[field]
}
function saveEdit(field) {
  userInfo.value[field] = tempValue.value
  showEditProfile.value = false
}
function openEditName() {
  showEditName.value = true
  tempname.value = userInfo.value.name
}
function saveEditName() {
  userInfo.value.name = tempname.value
  showEditName.value = false
}
function logout() {
  uni.removeStorageSync('jwtToken')
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<template>
  <view class="container">
    <view class="user-info">
      <text class="username">{{ userInfo.name }}</text>
      <button class="edit-btn" @click="openEditName">修改</button>
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

    <!-- 修改用户名弹窗 -->
    <uni-popup v-model="showEditName" type="dialog">
      <view class="popup-content" v-if="showEditName">
        <input type="text" v-model="tempname" placeholder="请输入新用户名" />
        <button class="save-btn" @click="saveEditName">保存</button>
      </view>
    </uni-popup> 

    <!-- 修改资料弹窗 -->
    <uni-popup v-model="showEditProfile" type="dialog">
      <view class="popup-content" v-if="showEditProfile === 'password'">
        <input v-model="tempValue" type="number" placeholder="请输入新密码" />
        <button class="save-btn" style="width: 80%;"@click="saveEdit('password')" >保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'age'">
        <input v-model="tempValue" type="number" placeholder="请输入年龄" />
        <button class="save-btn" style="width: 80%;" @click="saveEdit('age')">保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'gender'">
        <picker :range="['男','女']" :value="['男','女'].indexOf(tempValue)" @change="e => tempValue.value = ['男','女'][e.detail.value]">
          <view class="picker-value">{{ tempValue }}</view>
        </picker>
        <button class="save-btn" style="width: 80%;" @click="saveEdit('gender')">保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'height'">
        <input v-model="tempValue" type="number" placeholder="请输入身高(cm)" />
        <button class="save-btn" style="width: 80%;" @click="saveEdit('height')">保存</button>
      </view>
      <view class="popup-content" v-if="showEditProfile === 'weightGoal'">
        <input v-model="tempValue" type="number" placeholder="请输入体重目标(kg)" />
        <button class="save-btn" style="width: 80%;" @click="saveEdit('weightGoal')">保存</button>
      </view>
    </uni-popup>
    <view style="flex:1"></view>
    <button class="logout-btn" @click="logout">退出登录</button>
  </view>
</template>

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
}
.username {
  display: block;
  font-size: 36rpx;
  color: #388e3c;
  font-weight: bold;
  margin-bottom: 10rpx;
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
.edit-btn {
  color: #43a047;
  background: none;
  border: none;
  font-size: 24rpx;
  text-decoration: underline;
  cursor: pointer;
  padding: 0 8rpx;
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