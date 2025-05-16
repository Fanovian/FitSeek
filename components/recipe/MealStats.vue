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
    editable: true,
    placeholderText: `请输入每日热量目标(kcal), 当前: ${props.calorieTarget}`,
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
      <view class="title-container">
        <view class="title-icon"></view>
        <view class="title">饮食记录</view>
        <button class="goal-button" @click="updateTarget">设置目标</button>
      </view>
      <view class="calories-info">
        <view class="info-item">
          <text class="info-label">热量目标</text>
          <text class="info-value">{{ calorieTarget }} kcal</text>
        </view>
        <view class="info-item">
          <text class="info-label">今日摄入</text>
          <text class="info-value" :class="{ 'over-limit': caloriePercentage() > 100 }">{{ todayCalorieIntake }} kcal</text>
        </view>
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
      <view class="progress-text" :class="{ 'over-limit': caloriePercentage() > 100 }">
        <text v-if="caloriePercentage() <= 100">今日热量摄入进度: {{ caloriePercentage().toFixed(1) }}%</text>
        <text v-else>已超出目标: {{ (caloriePercentage() - 100).toFixed(1) }}%</text>
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
  background: linear-gradient(to right, #f0f8ff, #e8f5e9);
  border-radius: 15rpx 15rpx 0 0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.title-container {
  display: flex;
  align-items: center;
  flex: 1;
}

.title-icon {
  width: 40rpx;
  height: 40rpx;
  background-image: url('../../static/icons/recipe/title.svg');
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 15rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-shadow: 1rpx 1rpx 3rpx rgba(0, 0, 0, 0.1);
  margin-right: 20rpx;
}

.goal-button {
  font-size: 24rpx;
  color: #fff;
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  border-radius: 30rpx;
  padding: 6rpx 24rpx;
  border: none;
  box-shadow: 0 2rpx 6rpx rgba(76, 175, 80, 0.3);
  line-height: 1.6;
  height: auto;
  margin-left: 10rpx;
  transition: all 0.3s ease;
}

.goal-button:active {
  transform: scale(0.95);
  opacity: 0.9;
}

.calories-info {
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
  color: #4CAF50;
  font-weight: bold;
}

.info-value.over-limit {
  color: #ff4d4f;
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

.progress-text.over-limit {
  color: #ff4d4f;
  font-weight: bold;
}
</style>
