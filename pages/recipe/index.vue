<script setup>
const recipes = [
  { id: 1, name: '燕麦粥', ingredients: '燕麦50g, 牛奶250ml', steps: '煮10分钟' },
  { id: 2, name: '水煮鸡胸', ingredients: '鸡胸肉200g', steps: '煮熟切片' }
]
</script>

<template>
  <view class="container">
    <view v-for="item in recipes" :key="item.id" class="recipe-card" @click="navigateToDetail(item.id)">
      <text class="name">{{ item.name }}</text>
      <text>材料：{{ item.ingredients }}</text>
      <text>做法：{{ item.steps }}</text>
    </view>
  </view>
</template>

<style scoped>
.recipe-card {
  background: #f0fff0;
  margin: 20rpx;
  padding: 20rpx;
  border-left: 5rpx solid #228B22;
}
.name {
  font-size: 32rpx;
  font-weight: bold;
}
</style>