<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  mealTypes: {
    type: Array,
    required: true
  },
  foodLibrary: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['submit', 'cancel']);

// 表单数据
const newMeal = ref({
  type: '早餐',
  name: '',
  calories: null
});

// 控制下拉菜单显示
const showDropdown = ref(false);

// 过滤后的食物库（根据输入内容筛选）
const filteredFoodLibrary = computed(() => {
  if (!newMeal.value.name.trim()) {
    return props.foodLibrary;
  }
  return props.foodLibrary.filter(food => 
    food.name.toLowerCase().includes(newMeal.value.name.toLowerCase())
  );
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

// 选择预设食物
const selectFood = (food) => {
  newMeal.value.name = food.name;
  newMeal.value.calories = food.calories;
  showDropdown.value = false;
};

// 获取食物分类的中文名称
const getFoodCategoryName = (category) => {
  const categoryMapping = {
    'staple': '主食',
    'vegetable': '蔬菜',
    'fruit': '水果',
    'meat': '肉类',
    'seafood': '海鲜',
    'dairy': '乳制品',
    'drink': '饮品',
    'snack': '零食',
    'dessert': '甜品',
    'other': '其他'
  };
  return categoryMapping[category] || '其他';
};

// 处理食物名称输入
const handleFoodNameInput = () => {
  showDropdown.value = true;
  // 如果清空了输入，重置热量
  if (!newMeal.value.name.trim()) {
    newMeal.value.calories = null;
  }
};

// 显示下拉菜单
const showFoodDropdown = () => {
  showDropdown.value = true;
};

// 隐藏下拉菜单
const hideFoodDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200); // 延迟隐藏，让点击事件能够执行
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
    showDropdown.value = false;
  
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
      </view>    <view class="form-item">
      <text class="form-label">食物名称</text>
      
      <view class="food-input-container">
        <input 
          type="text" 
          v-model="newMeal.name" 
          placeholder="请输入食物名称"
          class="form-input" 
          @input="handleFoodNameInput"
          @focus="showFoodDropdown"
          @blur="hideFoodDropdown"
        />
          <!-- 预设食物下拉菜单 -->
        <view 
          v-if="showDropdown && filteredFoodLibrary.length > 0" 
          class="food-dropdown"
        >          <view 
            v-for="food in filteredFoodLibrary" 
            :key="food.id"
            class="food-dropdown-item"
            @click="selectFood(food)"
          >
            <view class="food-left">
              <text class="food-name">{{ food.name }}</text>
            </view>
            <view class="food-right">
              <text class="food-calories">{{ food.calories }} kcal</text>
              <text v-if="food.category" class="food-category">{{ getFoodCategoryName(food.category) }}</text>
            </view>
          </view>
        </view>
      </view>
      
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

/* 食物名称输入区域样式 */
.food-input-container {
  position: relative;
}

.food-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 10rpx 10rpx;
  max-height: 500rpx;
  overflow-y: scroll;
  z-index: 999;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

/* 美化滚动条 */
.food-dropdown::-webkit-scrollbar {
  width: 8rpx;
}

.food-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10rpx;
}

.food-dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10rpx;
}

.food-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.food-dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s ease;
}

.food-dropdown-item:hover {
  background-color: #f8f8f8;
}

.food-dropdown-item:last-child {
  border-bottom: none;
}

.food-left {
  flex: 1;
  display: flex;
  align-items: center;
}

.food-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5rpx;
}

.food-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.food-calories {
  font-size: 24rpx;
  color: #4CAF50;
  font-weight: bold;
}

.food-category {
  font-size: 20rpx;
  color: #999;
  background-color: #f0f0f0;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}
</style>
