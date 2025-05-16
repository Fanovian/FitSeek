<script setup>
import { ref, computed } from 'vue';
import { useTrainingStore } from '../../store/training.js';

// 使用训练记录状态管理
const trainingStore = useTrainingStore();
const { workoutRecords } = trainingStore;

// 计算本周的锻炼时长总计
const weeklyTrainingMinutes = computed(() => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // 本周开始（周日）
  weekStart.setHours(0, 0, 0, 0);
  
  return workoutRecords.value
    .filter(record => {
      const recordDate = new Date(record.createdAt);
      return recordDate >= weekStart;
    })
    .reduce((sum, record) => sum + parseInt(record.duration || 0), 0);
});

// 设定每周锻炼时长目标（分钟）
const weeklyTargetMinutes = ref(180); // 默认每周目标180分钟

// 更新锻炼目标
const updateTarget = () => {
  uni.showModal({
    title: '设置锻炼目标',
    content: '请输入您的每周锻炼时长目标(分钟)',
    editable: true,
    placeholderText: String(weeklyTargetMinutes.value),
    success: (res) => {
      if (res.confirm) {
        const newTarget = parseInt(res.content);
        if (!isNaN(newTarget) && newTarget > 0) {
          weeklyTargetMinutes.value = newTarget;
          uni.showToast({
            title: '目标已更新',
            icon: 'success'
          });
        } else {
          uni.showToast({
            title: '请输入有效的时长值',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 计算进度百分比
const progressPercentage = computed(() => {
  if (weeklyTargetMinutes.value <= 0) return 0;
  const percentage = (weeklyTrainingMinutes.value / weeklyTargetMinutes.value) * 100;
  return Math.min(percentage, 100);
});
</script>

<template>
  <view class="stats-container">
    <view class="header">
      <view class="title-container">
        <view class="title-icon"></view>
        <view class="title">锻炼记录</view>
      </view>
      <view class="training-info" @click="updateTarget">
        <view class="info-item">
          <text class="info-label">每周目标</text>
          <text class="info-value">{{ weeklyTargetMinutes }} 分钟</text>
        </view>
        <view class="info-item">
          <text class="info-label">本周累计</text>
          <text class="info-value">{{ weeklyTrainingMinutes }} 分钟</text>
        </view>
      </view>
    </view>
    
    <!-- 进度条 -->
    <view class="progress-container">
      <view class="progress-bar">
        <view 
          class="progress-fill" 
          :style="{ width: `${progressPercentage}%` }"
        ></view>
      </view>
      <view class="progress-text">
        <text>本周锻炼进度: {{ progressPercentage.toFixed(1) }}%</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.stats-container {
  margin-bottom: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(to right, #e3f2fd, #e8f5e9);
  border-radius: 15rpx 15rpx 0 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.title-container {
  display: flex;
  align-items: center;
}

.title-icon {
  width: 40rpx;
  height: 40rpx;
  background-image: url('../../static/icons/training/title.svg');
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 15rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-shadow: 1rpx 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

.training-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10rpx 15rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 5rpx;
}

.info-label {
  font-size: 24rpx;
  color: #666;
  margin-right: 8rpx;
}

.info-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.progress-container {
  padding: 15rpx 30rpx 20rpx;
  background-color: #f8f8f8;
  border-radius: 0 0 15rpx 15rpx;
  border: 1px solid #eaeaea;
  border-top: none;
}

.progress-bar {
  height: 20rpx;
  background-color: #e0e0e0;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
  box-shadow: inset 0 1rpx 3rpx rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s;
  background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent);
  background-size: 40rpx 40rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #666;
  text-align: right;
  padding-top: 5rpx;
}
</style>
