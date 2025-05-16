<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  mealTypes: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['submit', 'cancel']);

// 表单数据
const newMeal = ref({
  type: '早餐',
  name: '',
  calories: null
});

// 表单验证
const formErrors = ref({
  name: '',
  calories: ''
});

// 验证表单
const validateForm = () => {
  let isValid = true;
  formErrors.value.name = '';
  formErrors.value.calories = '';
  
  if (!newMeal.value.name.trim()) {
    formErrors.value.name = '请输入食物名称';
    isValid = false;
  }
  
  if (!newMeal.value.calories) {
    formErrors.value.calories = '请输入热量';
    isValid = false;
  } else if (isNaN(newMeal.value.calories) || newMeal.value.calories <= 0) {
    formErrors.value.calories = '请输入有效的热量值';
    isValid = false;
  }
  
  return isValid;
};

// 提交表单
const submitForm = () => {
  if (!validateForm()) return;
  
  // 提交表单数据
  emit('submit', {
    type: newMeal.value.type,
    name: newMeal.value.name,
    calories: newMeal.value.calories
  });
  
  // 重置表单
  newMeal.value = {
    type: '早餐',
    name: '',
    calories: null
  };
};

// 取消
const cancelForm = () => {
  // 重置表单
  newMeal.value = {
    type: '早餐',
    name: '',
    calories: null
  };
  
  formErrors.value = {
    name: '',
    calories: ''
  };
  
  emit('cancel');
};
</script>

<template>
  <view class="form-section">
    <view class="form-header">
      <text class="form-title">添加饮食记录</text>
    </view>      <view class="form-item">
        <text class="form-label">类型</text>
        <view class="meal-types-container">
          <view 
            v-for="type in mealTypes" 
            :key="type.value" 
            class="meal-type-item" 
            :class="{ 'active': newMeal.type === type.value }"
            @click="newMeal.type = type.value"
          >
            <image :src="type.icon" class="meal-type-icon"></image>
            <text class="meal-type-label">{{ type.label }}</text>
          </view>
        </view>
      </view>
    
    <view class="form-item">
      <text class="form-label">食物名称</text>
      <input type="text" v-model="newMeal.name" placeholder="请输入食物名称" class="form-input" />
      <text v-if="formErrors.name" class="error-text">{{ formErrors.name }}</text>
    </view>
    
    <view class="form-item">
      <text class="form-label">热量 (kcal)</text>
      <input type="number" v-model="newMeal.calories" placeholder="请输入食物热量" class="form-input" />
      <text v-if="formErrors.calories" class="error-text">{{ formErrors.calories }}</text>
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

.meal-types-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}

.meal-type-item {
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

.meal-type-item.active {
  background-color: #e8f5e9;
  border-color: #4CAF50;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.2);
}

.meal-type-item.active::before {
  content: '';
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #4CAF50;
  transform: rotate(45deg);
}

.meal-type-item.active::after {
  content: '✓';
  position: absolute;
  top: 0;
  right: 3rpx;
  color: white;
  font-size: 16rpx;
}

.meal-type-icon {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 10rpx;
}

.meal-type-label {
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
