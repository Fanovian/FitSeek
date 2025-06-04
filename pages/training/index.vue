<script setup>
import { ref, onMounted } from 'vue';
import { useTrainingStore } from './store/training.js';
import WorkoutForm from './components/WorkoutForm.vue';
import WorkoutRecords from './components/WorkoutRecords.vue';
import TrainingStats from './components/TrainingStats.vue';
import errorReport from '@/utils/errorReport.js';

// 使用训练记录状态管理
const trainingStore = useTrainingStore();
const { 
  workoutRecords, 
  workoutTypes, 
  trainLibrary,
  fetchWorkoutRecords, 
  addWorkoutRecord: storeAddWorkoutRecord,
  deleteWorkoutRecord,
  fetchTrainLibrary,
  getWorkoutTypeIcon 
} = trainingStore;

// 是否显示添加表单
const showAddForm = ref(false);

// 添加新的锻炼记录
const addWorkoutRecord = async (formData) => {
  try {
    // 调用store中的API方法
    await storeAddWorkoutRecord(formData);
    
    // 关闭表单
    showAddForm.value = false;
    
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    });
  } catch (error) {
    console.error('添加锻炼记录失败:', error);
    uni.showToast({
      title: '添加失败，请重试',
      icon: 'none'
    });
    errorReport(error, 'addWorkoutRecord', '/pages/training/index');
  }
};

// 处理删除锻炼记录
const handleDeleteRecord = async (id) => {
  try {
    await deleteWorkoutRecord(id);
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    });
  } catch (error) {
    console.error('删除锻炼记录失败:', error);
    uni.showToast({
      title: '删除失败，请重试',
      icon: 'none'
    });
    errorReport(error, 'handleDeleteRecord', '/pages/training/index');
  }
};

// 页面加载时获取数据
onMounted(async () => {
  try {
    await fetchWorkoutRecords();
    await fetchTrainLibrary();
  } catch (error) {
    errorReport(error, 'onMounted', '/pages/training/index');
  }
});
</script>

<template>
  <view class="container">
    <!-- 顶部统计信息 -->
    <training-stats />
    
    <!-- 添加记录按钮 -->
    <view class="add-workout-section" v-if="!showAddForm">
      <button class="add-workout-btn" @click="showAddForm = true">+ 添加锻炼记录</button>
    </view>
      <!-- 添加锻炼记录表单 -->
    <workout-form 
      v-if="showAddForm"
      :workout-types="workoutTypes"
      :train-library="trainLibrary"
      @submit="addWorkoutRecord"
      @cancel="showAddForm = false"
    />
    
    <!-- 锻炼历史记录 -->
    <workout-records 
      :records="workoutRecords" 
      @delete="handleDeleteRecord"
    />
  </view>
</template>

<style scoped>
.container {
  padding-bottom: 30rpx;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.add-workout-section {
  margin: 30rpx 20rpx;
}

.add-workout-btn {
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  color: white;
  border-radius: 50rpx;
  font-size: 28rpx;
  padding: 15rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
  letter-spacing: 2rpx;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.form-container {
  background-color: white;
  border-radius: 10rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 20rpx;
}

.form-label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
  display: block;
  color: #333;
}

.form-input, .form-picker {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 6rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  font-size: 28rpx;
}

.picker-value {
  height: 80rpx;
  line-height: 80rpx;
  color: #333;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
  border-radius: 6rpx;
  margin-top: 20rpx;
}

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