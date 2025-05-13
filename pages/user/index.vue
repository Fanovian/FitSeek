<script setup>
const userInfo = {
  avatar: 'static/icons/avatar.png',
  name: '健康达人',
  weightGoal: '68kg',
  trainingGoal: '每周3次'
}
</script>

<template>
  <view class="container">
    <view class="user-info">
      <image :src="userInfo.avatar" class="avatar" />
      <text class="username">{{ userInfo.name }}</text>
    </view>

    <view class="goals">
      <text>体重目标：{{ userInfo.weightGoal }}</text>
      <text>训练目标：{{ userInfo.trainingGoal }}</text>
    </view>

    <button @click="navigateToSettings">设置</button>
  </view>
</template>

<style scoped>
.container {
  padding: 40rpx;
}
.user-info {
  text-align: center;
}
.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
}
.goals {
  margin-top: 40rpx;
}
</style>