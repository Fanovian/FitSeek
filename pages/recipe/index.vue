<script setup>
import { ref, onMounted } from 'vue';
import { useRecipeStore } from '../../store/recipe.js';
import MealForm from '../../components/recipe/MealForm.vue';
import MealHistory from '../../components/recipe/MealHistory.vue';
import MealStats from '../../components/recipe/MealStats.vue';

// 使用饮食记录状态管理
const recipeStore = useRecipeStore();
const { 
  calorieTarget, 
  mealHistory, 
  mealTypes, 
  todayCalorieIntake,
  fetchMealHistory, 
  addMealRecord, 
  deleteMealRecord,
  updateCalorieTarget,
  formatDateDisplay
} = recipeStore;

// 是否显示添加表单
const showAddForm = ref(false);

// 添加新的饮食记录
const addMeal = (formData) => {
  // 创建新记录并添加到store
  addMealRecord(formData);
  
  // 关闭表单
  showAddForm.value = false;
  
  uni.showToast({
    title: '添加成功',
    icon: 'success'
  });
};

// 处理删除饮食记录
const handleDeleteRecord = ({ date, id }) => {
  if (deleteMealRecord(date, id)) {
    uni.showToast({
      title: '删除成功',
      icon: 'success'
    });
  }
};

// 处理更新热量目标
const handleUpdateTarget = (newTarget) => {
  if (updateCalorieTarget(newTarget)) {
    uni.showToast({
      title: '目标已更新',
      icon: 'success'
    });
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchMealHistory();
});
</script>

<template>
  <view class="container">
    <!-- 顶部统计信息 -->
    <meal-stats 
      :calorie-target="calorieTarget" 
      :today-calorie-intake="todayCalorieIntake"
      @update-target="handleUpdateTarget"
    />

    <!-- 添加记录按钮 -->
    <view class="add-meal-section" v-if="!showAddForm">
      <button class="add-meal-btn" @click="showAddForm = true">+ 添加饮食记录</button>
    </view>
    
    <!-- 添加饮食记录表单 -->
    <meal-form 
      v-if="showAddForm"
      :meal-types="mealTypes"
      @submit="addMeal"
      @cancel="showAddForm = false"
    />
    
    <!-- 饮食历史记录 -->
    <meal-history 
      :meal-history="mealHistory" 
      :format-date-display="formatDateDisplay"
      @delete="handleDeleteRecord"
    />
  </view>
</template>

<style scoped>
.container {
  padding-bottom: 30rpx;
}

.add-meal-section {
  margin: 30rpx 20rpx;
}

.add-meal-btn {
  background-color: #4CAF50;
  color: white;
  border-radius: 10rpx;
  font-size: 28rpx;
  padding: 10rpx 30rpx;
}
</style>