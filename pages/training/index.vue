<script setup>
const trainingList = [
  { id: 1, name: '深蹲', desc: '锻炼腿部力量', icon: 'static/icons/squat.png' },
  { id: 2, name: '俯卧撑', desc: '增强胸肌', icon: 'static/icons/pushup.png' }
]
</script>

<template>
  <view class="container">
    <view v-for="item in trainingList" :key="item.id" class="training-card" @click="navigateToDetail(item.id)">
      <image :src="item.icon" class="icon" />
      <text>{{ item.name }}</text>
      <text>{{ item.desc }}</text>
    </view>
  </view>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.training-card {
  width: 45%;
  margin: 20rpx;
  padding: 20rpx;
  background: #e6ffe6;
  text-align: center;
}
.icon {
  width: 100rpx;
  height: 100rpx;
}
</style>