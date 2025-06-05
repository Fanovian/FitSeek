<script setup>
import { defineProps, computed } from 'vue';
import { useTrainingStore } from '../store/training.js';

const props = defineProps({
  records: {
    type: Array,
    required: true
  }
});

// 使用store获取图标
const trainingStore = useTrainingStore();
const { getWorkoutTypeIcon } = trainingStore;

const emit = defineEmits(['delete', 'edit']);

// 按日期分组记录
const groupedRecords = computed(() => {
  if (!props.records || props.records.length === 0) {
    return [];
  }
  
  const groups = {};
  
  props.records.forEach(record => {
    // 提取日期部分（YYYY-MM-DD）
    const date = record.createdAt.split(' ')[0];
    
    if (!groups[date]) {
      groups[date] = {
        date: date,
        workouts: []
      };
    }
    
    groups[date].workouts.push(record);
  });
  
  // 转换为数组并按日期排序（最新的在前）
  return Object.values(groups).sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

// 格式化日期显示
const formatDateDisplay = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  const dateStr = dateString;
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (dateStr === todayStr) {
    return '今天';
  } else if (dateStr === yesterdayStr) {
    return '昨天';
  } else {
    // 格式化为 MM月DD日
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }
};

// 删除记录
const deleteWorkout = (id) => {
  uni.showModal({
    title: '确认删除',
    content: '是否确定删除此条锻炼记录？',
    success: (res) => {
      if (res.confirm) {
        emit('delete', id);
      }
    }
  });
};

// 修改记录
const editWorkout = (workout) => {
  emit('edit', workout);
};
</script>

<template>
  <view>
    <!-- 历史记录列表 -->
    <view v-for="day in groupedRecords" :key="day.date" class="day-section">
      <view class="day-header">
        <text class="day-title">{{ formatDateDisplay(day.date) }}</text>
      </view>
      
      <view v-for="workout in day.workouts" :key="workout.id" class="workout-item">
        <view class="workout-info">
          <view class="workout-type-container">
            <image :src="getWorkoutTypeIcon(workout.workoutType)" class="workout-type-icon"></image>
            <text class="workout-type">{{ workout.typeName }}</text>
          </view>
          <text class="workout-name">{{ workout.content }}</text>
          <text class="workout-time">{{ workout.createdAt.split(' ')[1] }}</text>
        </view>        <view class="workout-details">
          <text class="workout-duration">{{ workout.duration }} 分钟</text>
          <view class="action-buttons">
            <text class="edit-btn" @click="editWorkout(workout)">修改</text>
            <text class="delete-btn" @click="deleteWorkout(workout.id)">删除</text>
          </view>
        </view>
      </view>
      
      <!-- 每日合计 -->
      <view class="daily-total">
        <text>合计: {{ day.workouts.reduce((sum, workout) => sum + parseInt(workout.duration || 0), 0) }} 分钟</text>
      </view>
    </view>

    <!-- 没有记录的提示 -->
    <view v-if="records.length === 0" class="empty-records">
      <text class="empty-text">暂无锻炼记录，点击上方按钮添加</text>
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

.workout-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1px solid #f5f5f5;
  border-radius: 8rpx;
  margin: 0 2rpx;
  transition: all 0.2s;
  position: relative;
}

.workout-item:hover, .workout-item:active {
  background-color: #f9f9f9;
}

.workout-item::before {
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

.workout-item:active::before {
  opacity: 1;
}

.workout-info {
  display: flex;
  flex-direction: column;
}

.workout-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.workout-type-container {
  display: flex;
  align-items: center;
  margin-bottom: 5rpx;
}

.workout-type-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 8rpx;
  object-fit: contain;
}

.workout-type {
  font-size: 24rpx;
  color: #666;
}

.workout-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.workout-time {
  font-size: 24rpx;
  color: #888;
  margin-top: 5rpx;
}

.workout-duration {
  font-size: 26rpx;
  color: #4CAF50;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 10rpx;
  margin-top: 10rpx;
}

.edit-btn {
  font-size: 24rpx;
  color: #1890ff;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  border: 1px solid #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
  transition: all 0.3s;
}

.edit-btn:active {
  background-color: rgba(24, 144, 255, 0.1);
  color: #0050b3;
}

.delete-btn {
  font-size: 24rpx;
  color: #ff4d4f;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  border: 1px solid #ff4d4f;
  background-color: rgba(255, 77, 79, 0.05);
  transition: all 0.3s;
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
