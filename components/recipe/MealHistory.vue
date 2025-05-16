<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  mealHistory: {
    type: Array,
    required: true
  },
  formatDateDisplay: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['delete']);

// 删除记录
const deleteMeal = (date, id) => {
  uni.showModal({
    title: '确认删除',
    content: '是否确定删除此条饮食记录？',
    success: (res) => {
      if (res.confirm) {
        emit('delete', { date, id });
      }
    }
  });
};
</script>

<template>
  <view>
    <!-- 历史记录列表 -->
    <view v-for="day in mealHistory" :key="day.date" class="day-section">
      <view class="day-header">
        <text class="day-title">{{ formatDateDisplay(day.date) }}</text>
      </view>
      
      <view v-for="meal in day.meals" :key="meal.id" class="food-item">
        <view class="food-info">
          <text class="food-type">{{ meal.type }}</text>
          <text class="food-name">{{ meal.name }}</text>
          <text class="food-time">{{ meal.timestamp.split(' ')[1] }}</text>
        </view>
        <view class="food-details">
          <text class="food-calories">{{ meal.calories }} kcal</text>
          <text class="delete-btn" @click="deleteMeal(day.date, meal.id)">删除</text>
        </view>
      </view>
      
      <!-- 每日合计 -->
      <view class="daily-total">
        <text>合计: {{ day.meals.reduce((sum, meal) => sum + meal.calories, 0) }} kcal</text>
      </view>
    </view>

    <!-- 没有记录的提示 -->
    <view v-if="mealHistory.length === 0" class="empty-records">
      <text class="empty-text">暂无饮食记录，点击上方按钮添加</text>
    </view>
  </view>
</template>

<style scoped>
.day-section {
  margin: 20rpx;
  background: white;
  border-radius: 10rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.day-header {
  padding: 20rpx;
  background: #f0f5ff;
  border-bottom: 1px solid #eaeaea;
}

.day-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #4169E1;
}

.food-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1px solid #f5f5f5;
}

.food-info {
  display: flex;
  flex-direction: column;
}

.food-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.food-type {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 5rpx;
}

.food-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.food-time {
  font-size: 24rpx;
  color: #888;
  margin-top: 5rpx;
}

.food-calories {
  font-size: 26rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.delete-btn {
  font-size: 24rpx;
  color: #ff4d4f;
  margin-top: 10rpx;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
  border: 1px solid #ff4d4f;
}

.daily-total {
  padding: 15rpx 20rpx;
  text-align: right;
  background-color: #f8f8f8;
}

.daily-total text {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b6b;
}

.empty-records {
  margin: 40rpx 20rpx;
  padding: 40rpx;
  background: white;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
