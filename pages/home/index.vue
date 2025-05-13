<script setup>
import { ref } from 'vue'
const currentWeight = ref(75)
const targetWeight = ref(68)
const recentTraining = ref([
  { id: 1, name: '深蹲', count: '3组×15次' },
  { id: 2, name: '跑步', count: '30分钟' }
])
</script>

<template>
  <view class="container">
    <!-- 体重显示 -->
    <view class="weight-card">
      <text>当前体重：{{ currentWeight }}kg</text>
      <text>目标体重：{{ targetWeight }}kg</text>
    </view>

    <!-- 食谱推荐 -->
    <view class="section">
      <text class="section-title">推荐食谱</text>
      <view class="recipe-recommend">
        <!-- 示例数据可替换为动态获取 -->
        <text>燕麦牛奶 | 鸡胸肉沙拉</text>
      </view>
    </view>

    <!-- 训练记录 -->
    <view class="section">
      <text class="section-title">最近训练</text>
      <view v-for="item in recentTraining" :key="item.id" class="training-item">
        {{ item.name }} - {{ item.count }}
      </view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding: 20rpx;
}
.weight-card {
  background: #e0ffe0;
  padding: 40rpx;
  margin-bottom: 30rpx;
  text-align: center;
}
.section-title {
  font-weight: bold;
  margin-bottom: 20rpx;
}
.recipe-recommend, .training-item {
  margin: 15rpx 0;
}
</style>