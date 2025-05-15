<script setup>
import { ref, onMounted } from 'vue';

// 模拟 API 调用获取饮食数据
const fetchMealData = () => {
  // 模拟后端 API 请求
  // 实际项目中这里应替换为 uni.request 调用后端接口
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        calorieTarget: 2000,
        calorieIntake: 1450,
        meals: {
          breakfast: [
            { id: 1, name: '燕麦粥', quantity: '1碗', calories: 200 },
            { id: 2, name: '煮鸡蛋', quantity: '1个', calories: 80 }
          ],
          lunch: [
            { id: 3, name: '水煮鸡胸肉', quantity: '150g', calories: 250 },
            { id: 4, name: '蔬菜沙拉', quantity: '1份', calories: 120 },
            { id: 5, name: '糙米饭', quantity: '1碗', calories: 180 }
          ],
          dinner: [
            { id: 6, name: '烤三文鱼', quantity: '100g', calories: 220 },
            { id: 7, name: '蒸青菜', quantity: '1份', calories: 70 },
            { id: 8, name: '番薯', quantity: '1个', calories: 150 }
          ]
        }
      });
    }, 500);
  });
};

const mealData = ref({
  calorieTarget: 0,
  calorieIntake: 0,
  meals: {
    breakfast: [],
    lunch: [],
    dinner: []
  }
});

// 计算总热量
const calculateTotalCalories = (meals) => {
  let total = 0;
  Object.keys(meals).forEach(mealType => {
    meals[mealType].forEach(food => {
      total += food.calories;
    });
  });
  return total;
};

onMounted(async () => {
  try {
    const data = await fetchMealData();
    mealData.value = data;
  } catch (error) {
    console.error('获取饮食数据失败', error);
  }
});
</script>

<template>
  <view class="container">
    <view class="header">
      <view class="title">今日饮食</view>
      <view class="calories-info">
        <text>热量目标：{{ mealData.calorieTarget }} kcal</text>
        <text>摄入量：{{ mealData.calorieIntake }} kcal</text>
      </view>
    </view>

    <!-- 早餐 -->
    <view class="meal-section">
      <view class="meal-header">
        <text class="meal-title">早</text>
      </view>
      <view v-for="item in mealData.meals.breakfast" :key="item.id" class="food-item">
        <view class="food-info">
          <text class="food-name">{{ item.name }}</text>
          <text class="food-quantity">{{ item.quantity }}</text>
        </view>
        <text class="food-calories">{{ item.calories }} kcal</text>
      </view>
    </view>

    <!-- 午餐 -->
    <view class="meal-section">
      <view class="meal-header">
        <text class="meal-title">中</text>
      </view>
      <view v-for="item in mealData.meals.lunch" :key="item.id" class="food-item">
        <view class="food-info">
          <text class="food-name">{{ item.name }}</text>
          <text class="food-quantity">{{ item.quantity }}</text>
        </view>
        <text class="food-calories">{{ item.calories }} kcal</text>
      </view>
    </view>

    <!-- 晚餐 -->
    <view class="meal-section">
      <view class="meal-header">
        <text class="meal-title">晚</text>
      </view>
      <view v-for="item in mealData.meals.dinner" :key="item.id" class="food-item">
        <view class="food-info">
          <text class="food-name">{{ item.name }}</text>
          <text class="food-quantity">{{ item.quantity }}</text>
        </view>
        <text class="food-calories">{{ item.calories }} kcal</text>
      </view>
    </view>

    <!-- 总计 -->
    <view class="meal-section total-section">
      <view class="meal-header">
        <text class="meal-title">总计</text>
      </view>
      <view class="total-calories">
        <text>{{ calculateTotalCalories(mealData.meals) }} kcal</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
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

.meal-section {
  margin: 20rpx;
  background: #ffffff;
  border-radius: 10rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.meal-header {
  padding: 20rpx;
  background: #f0fff0;
  border-bottom: 1px solid #eaeaea;
}

.meal-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #228B22;
}

.food-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  border-bottom: 1px solid #f5f5f5;
}

.food-info {
  display: flex;
  flex-direction: column;
}

.food-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.food-quantity {
  font-size: 24rpx;
  color: #666;
  margin-top: 5rpx;
}

.food-calories {
  font-size: 26rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.total-section {
  margin-top: 30rpx;
  background-color: #f8f8f8;
}

.total-calories {
  padding: 20rpx;
  text-align: right;
}

.total-calories text {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6b6b;
}
</style>