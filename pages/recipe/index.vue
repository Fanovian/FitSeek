<script setup>
import { ref, onMounted } from 'vue';
import { useRecipeStore } from './store/recipe.js';
import MealForm from './components/MealForm.vue';
import MealHistory from './components/MealHistory.vue';
import MealStats from './components/MealStats.vue';
import errorReport from '@/utils/errorReport.js';

// 使用饮食记录状态管理
const recipeStore = useRecipeStore();
const { 
  calorieTarget, 
  mealHistory, 
  mealTypes, 
  foodLibrary,
  todayCalorieIntake,
  fetchMealHistory, 
  addMealRecord, 
  deleteMealRecord,
  updateCalorieTarget,
  formatDateDisplay,
  fetchFoodLibrary
} = recipeStore;

// 是否显示添加表单
const showAddForm = ref(false);

// 添加新的饮食记录
const addMeal = async (formData) => {
  try {
    // 创建新记录并添加到store
    await addMealRecord(formData);
    
    // 关闭表单
    showAddForm.value = false;
    
    uni.showToast({
      title: '添加成功',
      icon: 'success'
    });
  } catch (error) {
    uni.showToast({
      title: '添加失败',
      icon: 'error'
    });
    errorReport(error, 'addMeal', '/pages/recipe/index');
  }
};

// 处理删除饮食记录
const handleDeleteRecord = async ({ date, id }) => {
  try {
    const success = await deleteMealRecord(date, id);
    if (success) {
      uni.showToast({
        title: '删除成功',
        icon: 'success'
      });
    } else {
      uni.showToast({
        title: '删除失败',
        icon: 'error'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '删除失败',
      icon: 'error'
    });
    errorReport(error, 'handleDeleteRecord', '/pages/recipe/index');
  }
};

// 处理更新热量目标
const handleUpdateTarget = (newTarget) => {
  try {
    if (updateCalorieTarget(newTarget)) {
      uni.showToast({
        title: '目标已更新',
        icon: 'success'
      });
    }
  } catch (error) {
    errorReport(error, 'handleUpdateTarget', '/pages/recipe/index');
  }
};

// 页面加载时获取数据
onMounted(async () => {
  try {
    await fetchMealHistory();
    await fetchFoodLibrary();
  } catch (error) {
    errorReport(error, 'onMounted', '/pages/recipe/index');
  }
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
      :food-library="foodLibrary"
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
.page, .container, .main {
  padding-top: env(safe-area-inset-top);
}

.container {
  padding-bottom: 30rpx;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.add-meal-section {
  margin: 30rpx 20rpx;
}

.add-meal-btn {
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
</style>