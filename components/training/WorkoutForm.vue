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

// 提交表单
const submitForm = () => {
  if (!formData.value.content || !formData.value.duration) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }
  
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
};

// 取消
const cancelForm = () => {
  emit('cancel');
};
</script>

<template>
  <view class="form-container">
    <view class="form-item">
      <text class="form-label">锻炼类型</text>
      <picker 
        :value="formData.workoutType"
        :range="workoutTypes"
        range-key="label"
        @change="e => formData.workoutType = workoutTypes[e.detail.value].value"
        class="form-picker"
      >
        <view class="picker-value">
          {{ workoutTypes.find(t => t.value === formData.workoutType).label }}
        </view>
      </picker>
    </view>
    
    <view class="form-item">
      <text class="form-label">锻炼内容</text>
      <input
        v-model="formData.content"
        class="form-input"
        placeholder="请输入锻炼内容"
      />
    </view>
    
    <view class="form-item">
      <text class="form-label">锻炼时长</text>
      <input
        v-model="formData.duration"
        class="form-input"
        placeholder="请输入锻炼时长(分钟)"
        type="number"
      />
    </view>
    
    <view class="form-buttons">
      <button class="cancel-btn" @click="cancelForm">取消</button>
      <button class="submit-btn" @click="submitForm">保存</button>
    </view>
  </view>
</template>

<style scoped>
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

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.submit-btn, .cancel-btn {
  width: 48%;
  border-radius: 6rpx;
  font-size: 28rpx;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 1rpx solid #ddd;
}
</style>
