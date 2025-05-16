<script setup>
import { defineProps } from 'vue';
import WorkoutTypeIcon from './WorkoutTypeIcon.vue';

const props = defineProps({
  records: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['delete']);

// 删除记录
const deleteRecord = (id) => {
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
</script>

<template>
  <view class="records-container">
    <text class="section-title">锻炼记录</text>
    <view v-if="records.length === 0" class="no-data">
      暂无锻炼记录，快去添加吧！
    </view>
    <view v-else class="record-list">
      <view v-for="record in records" :key="record.id" class="record-item">          <view class="record-header">
            <workout-type-icon :type="record.workoutType" />
            <view class="record-type">{{ record.typeName }}</view>
            <view class="record-date">{{ record.createdAt }}</view>
            <view class="delete-btn" @click.stop="deleteRecord(record.id)">删除</view>
          </view>
        <view class="record-content">
          <view class="record-content-item">
            <text class="content-label">锻炼内容:</text>
            <text class="content-value">{{ record.content }}</text>
          </view>
          <view class="record-content-item">
            <text class="content-label">锻炼时长:</text>
            <text class="content-value">{{ record.duration }} 分钟</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.records-container {
  background-color: white;
  border-radius: 10rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40rpx 0;
}

.record-list {
  max-height: 800rpx;
  overflow-y: auto;
}

.record-item {
  border-bottom: 1rpx solid #eee;
  padding: 20rpx 0;
}

.record-item:last-child {
  border-bottom: none;
}

.record-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.type-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
  /* 确保SVG图标可以正常显示 */
  display: inline-block;
}

.record-type {
  font-size: 28rpx;
  font-weight: bold;
  color: #4CAF50;
}

.record-date {
  font-size: 24rpx;
  color: #999;
  margin-left: auto;
  margin-right: 20rpx;
}

.delete-btn {
  font-size: 24rpx;
  color: #ff4d4f;
  padding: 2rpx 10rpx;
  border-radius: 4rpx;
  border: 1rpx solid #ff4d4f;
}

.record-content {
  padding-left: 50rpx;
}

.record-content-item {
  display: flex;
  margin-bottom: 10rpx;
  font-size: 28rpx;
}

.content-label {
  color: #666;
  width: 120rpx;
}

.content-value {
  color: #333;
  flex: 1;
}
</style>
