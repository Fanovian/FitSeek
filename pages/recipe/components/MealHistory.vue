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

// 导入store以获取图标
import { useRecipeStore } from '../store/recipe.js';
const recipeStore = useRecipeStore();
const { getMealTypeIcon } = recipeStore;

const emit = defineEmits(['delete', 'edit']);

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

// 修改记录
const editMeal = (meal) => {
  emit('edit', meal);
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
          <view class="food-type-container">
            <image :src="getMealTypeIcon(meal.type)" class="food-type-icon"></image>
            <text class="food-type">{{ meal.type }}</text>
          </view>
          <text class="food-name">{{ meal.name }}</text>
          <text class="food-time">{{ meal.timestamp.split(' ')[1] }}</text>
        </view>        <view class="food-details">
          <text class="food-calories">{{ meal.calories }} kcal</text>
          <view class="action-buttons">
            <text class="edit-btn" @click="editMeal(meal)">修改</text>
            <text class="delete-btn" @click="deleteMeal(day.date, meal.id)">删除</text>
          </view>
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
  border-radius: 8rpx;
  margin: 0 2rpx;
  transition: all 0.2s;
  position: relative;
}

.food-item:hover, .food-item:active {
  background-color: #f9f9f9;
}

.food-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4rpx;
  background: linear-gradient(to bottom, #4CAF50, #8BC34A);
  opacity: 0;
  transition: opacity 0.2s;
}

.food-item:active::before {
  opacity: 1;
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

.food-type-container {
  display: flex;
  align-items: center;
  margin-bottom: 5rpx;
}

.food-type-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 8rpx;
}

.food-type {
  font-size: 24rpx;
  color: #666;
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
  color: #4CAF50;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 15rpx;
  margin-top: 10rpx;
}

.edit-btn, .delete-btn {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  border: 1px solid;
  transition: all 0.3s;
}

.edit-btn {
  color: #1890ff;
  border-color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.edit-btn:active {
  background-color: rgba(24, 144, 255, 0.1);
  color: #0066cc;
}

.delete-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;  
  background-color: rgba(255, 77, 79, 0.05);
}

.delete-btn:active {
  background-color: rgba(255, 77, 79, 0.1);
  color: #f00;
}

.daily-total {
  padding: 15rpx 20rpx;
  text-align: right;
  background-color: #f8f8f8;
}

.daily-total text {
  font-size: 28rpx;
  font-weight: bold;
  color: #4CAF50;
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
