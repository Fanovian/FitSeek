<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  workoutTypes: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['submit', 'cancel']);

// 表单数据
const formData = ref({
  workoutType: 'cardio',
  content: '',
  duration: '',
});

// 表单验证
const formErrors = ref({
  content: '',
  duration: ''
});

// 验证表单
const validateForm = () => {
  let isValid = true;
  formErrors.value.content = '';
  formErrors.value.duration = '';
  
  if (!formData.value.content.trim()) {
    formErrors.value.content = '请输入锻炼内容';
    isValid = false;
  }
  
  if (!formData.value.duration) {
    formErrors.value.duration = '请输入锻炼时长';
    isValid = false;
  } else if (isNaN(formData.value.duration) || formData.value.duration <= 0) {
    formErrors.value.duration = '请输入有效的时长值';
    isValid = false;
  }
  
  return isValid;
};

// 提交表单
const submitForm = () => {
  if (!validateForm()) return;
  
  // 获取当前类型的名称
  const selectedType = props.workoutTypes.find(type => type.value === formData.value.workoutType);
  
  // 提交表单数据
  emit('submit', {
    workoutType: formData.value.workoutType,
    typeName: selectedType.label,
    content: formData.value.content,
    duration: formData.value.duration,
  });
  
  // 重置表单
  formData.value.content = '';
  formData.value.duration = '';
  formErrors.value = { content: '', duration: '' };
};

// 取消
const cancelForm = () => {
  // 重置错误
  formErrors.value = { content: '', duration: '' };
  
  emit('cancel');
};
</script>

<template>
  <view class="form-section">
    <view class="form-header">
      <text class="form-title">添加锻炼记录</text>
    </view>
    
    <view class="form-item">
      <text class="form-label">锻炼类型</text>
      <view class="workout-types-container">
        <view 
          v-for="type in workoutTypes" 
          :key="type.value" 
          class="workout-type-item" 
          :class="{ 'active': formData.workoutType === type.value }"
          @click="formData.workoutType = type.value"
        >
          <image :src="`/static/icons/training/${type.value}.svg`" class="workout-type-icon"></image>
          <text class="workout-type-label">{{ type.label }}</text>
        </view>
      </view>
    </view>
    
    <view class="form-item">
      <text class="form-label">锻炼内容</text>
      <input type="text" v-model="formData.content" placeholder="请输入锻炼内容" class="form-input" />
      <text v-if="formErrors.content" class="error-text">{{ formErrors.content }}</text>
    </view>
    
    <view class="form-item">
      <text class="form-label">锻炼时长 (分钟)</text>
      <input type="number" v-model="formData.duration" placeholder="请输入锻炼时长" class="form-input" />
      <text v-if="formErrors.duration" class="error-text">{{ formErrors.duration }}</text>
    </view>
    
    <view class="form-actions">
      <button class="cancel-btn" @click="cancelForm">取消</button>
      <button class="submit-btn" @click="submitForm">保存</button>
    </view>
  </view>
</template>

<style scoped>
.form-section {
  margin: 20rpx;
  background: white;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.form-header {
  padding: 20rpx;
  background: #f0fff0;
  border-bottom: 1px solid #eaeaea;
}

.form-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #228B22;
}

.form-item {
  padding: 20rpx;
  border-bottom: 1px solid #f5f5f5;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}

.form-input {
  font-size: 28rpx;
  padding: 15rpx;
  border: 1px solid #ddd;
  border-radius: 10rpx;
  margin-top: 10rpx;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 8rpx rgba(76, 175, 80, 0.2);
  background-color: #fff;
}

.workout-types-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}

.workout-type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 22%;
  padding: 15rpx 0;
  border: 1px solid #ddd;
  border-radius: 10rpx;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.workout-type-item.active {
  background-color: #e8f5e9;
  border-color: #4CAF50;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.2);
}

.workout-type-item.active::before {
  content: '';
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #4CAF50;
  transform: rotate(45deg);
}

.workout-type-item.active::after {
  content: '✓';
  position: absolute;
  top: 0;
  right: 3rpx;
  color: white;
  font-size: 16rpx;
}

.workout-type-icon {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 10rpx;
}

.workout-type-label {
  font-size: 24rpx;
  color: #333;
}

.error-text {
  font-size: 24rpx;
  color: #ff0000;
  margin-top: 5rpx;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
}

.cancel-btn {
  flex: 1;
  margin-right: 10rpx;
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 50rpx;
  transition: all 0.3s ease;
}

.cancel-btn:active {
  background-color: #e0e0e0;
}

.submit-btn {
  flex: 1;
  margin-left: 10rpx;
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  color: white;
  border-radius: 50rpx;
  box-shadow: 0 4rpx 12rpx rgba(76, 175, 80, 0.3);
  border: none;
  transition: all 0.3s ease;
}

.submit-btn:active {
  transform: translateY(2rpx);
  box-shadow: 0 2rpx 6rpx rgba(76, 175, 80, 0.2);
}
</style>
