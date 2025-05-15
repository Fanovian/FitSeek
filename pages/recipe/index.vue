<script setup>
import { ref, onMounted, computed } from 'vue';

// 模拟用户配置的每日热量目标
const calorieTarget = ref(2000);

// 模拟 API 调用获取历史饮食数据
const fetchMealHistory = () => {
  // 模拟后端 API 请求
  // 实际项目中这里应替换为 uni.request 调用后端接口
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          date: '2025-05-16', // 当天
          meals: [
            { id: 1, type: '早餐', name: '燕麦粥', calories: 200, timestamp: '2025-05-16 08:30' },
            { id: 2, type: '早餐', name: '煮鸡蛋', calories: 80, timestamp: '2025-05-16 08:30' },
            { id: 3, type: '午餐', name: '水煮鸡胸肉', calories: 250, timestamp: '2025-05-16 12:30' },
            { id: 4, type: '午餐', name: '蔬菜沙拉', calories: 120, timestamp: '2025-05-16 12:30' },
            { id: 5, type: '午餐', name: '糙米饭', calories: 180, timestamp: '2025-05-16 12:30' },
          ]
        },
        {
          date: '2025-05-15',
          meals: [
            { id: 6, type: '早餐', name: '全麦面包', calories: 150, timestamp: '2025-05-15 08:15' },
            { id: 7, type: '午餐', name: '烤鸡肉', calories: 300, timestamp: '2025-05-15 12:00' },
            { id: 8, type: '晚餐', name: '烤三文鱼', calories: 220, timestamp: '2025-05-15 18:30' },
            { id: 9, type: '晚餐', name: '蒸青菜', calories: 70, timestamp: '2025-05-15 18:30' },
            { id: 10, type: '加餐', name: '酸奶', calories: 120, timestamp: '2025-05-15 15:00' },
          ]
        }
      ]);
    }, 500);
  });
};

// 饮食类型选项
const mealTypes = [
  { value: '早餐', label: '早餐' },
  { value: '午餐', label: '午餐' },
  { value: '晚餐', label: '晚餐' },
  { value: '加餐', label: '加餐' }
];

// 新增饮食记录表单
const newMeal = ref({
  type: '早餐',
  name: '',
  calories: null
});

// 所有饮食历史记录
const mealHistory = ref([]);
const showAddForm = ref(false);

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

// 获取今天的日期字符串（YYYY-MM-DD格式）
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 添加新饮食记录
const addMeal = () => {
  if (!validateForm()) return;
  
  const currentDate = getTodayDateString();
  const timestamp = `${currentDate} ${new Date().toTimeString().slice(0, 5)}`;
  
  // 构建新记录
  const newRecord = {
    id: Date.now(), // 使用时间戳作为临时ID
    type: newMeal.value.type,
    name: newMeal.value.name,
    calories: parseInt(newMeal.value.calories),
    timestamp
  };
  
  // 查找今天的记录
  const todayIndex = mealHistory.value.findIndex(day => day.date === currentDate);
  
  if (todayIndex >= 0) {
    // 今天已有记录，添加到今天的记录中
    mealHistory.value[todayIndex].meals.push(newRecord);
  } else {
    // 今天没有记录，新建今天的记录
    mealHistory.value.unshift({
      date: currentDate,
      meals: [newRecord]
    });
  }
  
  // 重置表单
  newMeal.value = {
    type: '早餐',
    name: '',
    calories: null
  };
  
  // 关闭表单
  showAddForm.value = false;
  
  // 实际项目中，这里应该调用API将数据发送到后端
  console.log('已添加新饮食记录', newRecord);
  uni.showToast({
    title: '添加成功',
    icon: 'success'
  });
};

// 计算今日摄入的总热量
const todayCalorieIntake = computed(() => {
  const today = getTodayDateString();
  const todayRecord = mealHistory.value.find(day => day.date === today);
  
  if (!todayRecord) return 0;
  
  return todayRecord.meals.reduce((sum, meal) => sum + meal.calories, 0);
});

// 获取指定日期的星期几
const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[date.getDay()];
};

// 格式化日期显示
const formatDateDisplay = (dateString) => {
  const today = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = getTodayDateString();
  
  if (dateString === today) {
    return '今天';
  } else if (dateString === yesterdayString) {
    return '昨天';
  } else {
    return `${dateString} ${getDayOfWeek(dateString)}`;
  }
};

onMounted(async () => {
  try {
    const data = await fetchMealHistory();
    mealHistory.value = data;
  } catch (error) {
    console.error('获取饮食历史数据失败', error);
  }
});
</script>

<template>
  <view class="container">
    <!-- 顶部统计信息 -->
    <view class="header">
      <view class="title">饮食记录</view>
      <view class="calories-info">
        <text>热量目标：{{ calorieTarget }} kcal</text>
        <text>今日摄入：{{ todayCalorieIntake }} kcal</text>
      </view>
    </view>

    <!-- 添加记录按钮 -->
    <view class="add-meal-section" v-if="!showAddForm">
      <button class="add-meal-btn" @click="showAddForm = true">+ 添加饮食记录</button>
    </view>

    <!-- 添加记录表单 -->
    <view class="form-section" v-if="showAddForm">
      <view class="form-header">
        <text class="form-title">添加饮食记录</text>
      </view>
      
      <view class="form-item">
        <text class="form-label">类型</text>
        <picker :value="newMeal.type" :range="mealTypes.map(item => item.label)" @change="(e) => newMeal.type = mealTypes[e.detail.value].value">
          <view class="picker">
            {{ newMeal.type }}
          </view>
        </picker>
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
        <button class="cancel-btn" @click="showAddForm = false">取消</button>
        <button class="submit-btn" @click="addMeal">保存</button>
      </view>
    </view>

    <!-- 历史记录列表 -->
    <view v-for="day in mealHistory" :key="day.date" class="day-section">
      <view class="day-header">
        <text class="day-title">{{ formatDateDisplay(day.date) }}</text>
      </view>
      
      <view v-for="meal in day.meals" :key="meal.id" class="food-item">
        <view class="food-info">
          <text class="food-type">{{ meal.type }}</text>
          <text class="food-name">{{ meal.name }}</text>
          <text class="food-time">{{ meal.timestamp.split(' ')[1] }}</text>
        </view>
        <text class="food-calories">{{ meal.calories }} kcal</text>
      </view>
      
      <!-- 每日合计 -->
      <view class="daily-total">
        <text>合计: {{ day.meals.reduce((sum, meal) => sum + meal.calories, 0) }} kcal</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.container {
  padding-bottom: 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 30rpx;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
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

.add-meal-section {
  margin: 30rpx 20rpx;
}

.add-meal-btn {
  background-color: #4CAF50;
  color: white;
  border-radius: 10rpx;
  font-size: 28rpx;
}

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
  padding: 10rpx;
  border: 1px solid #ddd;
  border-radius: 6rpx;
  margin-top: 10rpx;
}

.picker {
  font-size: 28rpx;
  padding: 10rpx;
  border: 1px solid #ddd;
  border-radius: 6rpx;
  margin-top: 10rpx;
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
  color: #333;
}

.submit-btn {
  flex: 1;
  margin-left: 10rpx;
  background-color: #4CAF50;
  color: white;
}

.day-section {
  margin: 20rpx;
  background: white;
  border-radius: 10rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.day-header {
  padding: 20rpx;
  background: #f0f5ff;
  border-bottom: 1px solid #eaeaea;
}

.day-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #4169E1;
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

.food-type {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 5rpx;
}

.food-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.food-time {
  font-size: 24rpx;
  color: #888;
  margin-top: 5rpx;
}

.food-calories {
  font-size: 26rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.daily-total {
  padding: 15rpx 20rpx;
  text-align: right;
  background-color: #f8f8f8;
}

.daily-total text {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6b6b;
}
</style>