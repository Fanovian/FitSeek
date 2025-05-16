<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  calorieTarget: {
    type: Number,
    required: true
  },
  todayCalorieIntake: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['updateTarget']);

// 更新热量目标
const updateTarget = () => {
  uni.showModal({
    title: '设置热量目标',
    content: '请输入您的每日热量目标(kcal)',
    editable: true,
    placeholderText: String(props.calorieTarget),
    success: (res) => {
      if (res.confirm) {
        const newTarget = parseInt(res.content);
        if (!isNaN(newTarget) && newTarget > 0) {
          emit('updateTarget', newTarget);
        } else {
          uni.showToast({
            title: '请输入有效的热量值',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 计算进度百分比
const caloriePercentage = () => {
  if (props.calorieTarget <= 0) return 0;
  const percentage = (props.todayCalorieIntake / props.calorieTarget) * 100;
  return Math.min(percentage, 100);
};
</script>

<template>
  <view class="stats-container">
    <view class="header">
      <view class="title">饮食记录</view>
      <view class="calories-info" @click="updateTarget">
        <text>热量目标：{{ calorieTarget }} kcal</text>
        <text>今日摄入：{{ todayCalorieIntake }} kcal</text>
      </view>
    </view>
    
    <!-- 热量进度条 -->
    <view class="progress-container">
      <view class="progress-bar">
        <view 
          class="progress-fill" 
          :style="{ width: `${caloriePercentage()}%`, backgroundColor: caloriePercentage() > 100 ? '#ff4d4f' : '#4CAF50' }"
        ></view>
      </view>
      <view class="progress-text">
        今日热量摄入进度: {{ caloriePercentage().toFixed(1) }}%
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
  align-items: flex-start;
  padding: 30rpx;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eaeaea;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.calories-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.calories-info text {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 5rpx;
}

.progress-container {
  padding: 0 30rpx 20rpx;
  background-color: #f8f8f8;
}

.progress-bar {
  height: 20rpx;
  background-color: #e0e0e0;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s;
}

.progress-text {
  font-size: 24rpx;
  color: #666;
  text-align: right;
}
</style>
