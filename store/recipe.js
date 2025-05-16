// 饮食记录相关的状态管理
import { ref, computed } from 'vue';

// 创建一个可以在组件外部使用的响应式状态
export const useRecipeStore = () => {
  // 模拟用户配置的每日热量目标
  const calorieTarget = ref(2000);
  
  // 所有饮食历史记录
  const mealHistory = ref([]);

  // 饮食类型选项
  const mealTypes = [
    { value: '早餐', label: '早餐' },
    { value: '午餐', label: '午餐' },
    { value: '晚餐', label: '晚餐' },
    { value: '加餐', label: '加餐' }
  ];

  // 获取今天的日期字符串（YYYY-MM-DD格式）
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 格式化时间戳
  const formatTimestamp = () => {
    const currentDate = getTodayDateString();
    return `${currentDate} ${new Date().toTimeString().slice(0, 5)}`;
  };

  // 从后端获取饮食记录
  const fetchMealHistory = () => {
    // 模拟 API 调用获取历史饮食数据
    // 实际项目中这里应该是API调用
    // 这里使用Promise模拟异步请求
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = [
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
        ];
        mealHistory.value = data;
        resolve(data);
      }, 500);
    });
  };

  // 添加新的饮食记录
  const addMealRecord = (mealData) => {
    // 实际项目中应该先发送到后端，成功后再添加到本地状态
    const currentDate = getTodayDateString();
    
    // 构建新记录
    const newRecord = {
      id: Date.now(), // 使用时间戳作为临时ID
      type: mealData.type,
      name: mealData.name,
      calories: parseInt(mealData.calories),
      timestamp: formatTimestamp()
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
    
    return newRecord;
  };

  // 删除饮食记录
  const deleteMealRecord = (date, id) => {
    // 实际项目中应该发送请求到后端删除
    // 然后再删除本地数据
    const dayIndex = mealHistory.value.findIndex(day => day.date === date);
    if (dayIndex !== -1) {
      const meals = mealHistory.value[dayIndex].meals;
      const mealIndex = meals.findIndex(meal => meal.id === id);
      if (mealIndex !== -1) {
        meals.splice(mealIndex, 1);
        // 如果该天没有记录了，可以考虑移除整天
        if (meals.length === 0) {
          mealHistory.value.splice(dayIndex, 1);
        }
        return true;
      }
    }
    return false;
  };

  // 更新用户的每日热量目标
  const updateCalorieTarget = (newTarget) => {
    // 实际项目中应该发送请求到后端更新
    if (newTarget > 0) {
      calorieTarget.value = newTarget;
      return true;
    }
    return false;
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
    const yesterdayString = yesterday.toISOString().slice(0, 10);
    
    if (dateString === today) {
      return '今天';
    } else if (dateString === yesterdayString) {
      return '昨天';
    } else {
      return `${dateString} ${getDayOfWeek(dateString)}`;
    }
  };

  return {
    calorieTarget,
    mealHistory,
    mealTypes,
    todayCalorieIntake,
    fetchMealHistory,
    addMealRecord,
    deleteMealRecord,
    updateCalorieTarget,
    getTodayDateString,
    formatDateDisplay
  };
};
