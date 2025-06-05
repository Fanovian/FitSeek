// 饮食记录相关的状态管理
import { ref, computed } from 'vue';

// 创建一个可以在组件外部使用的响应式状态
export const useRecipeStore = () => {
  // 模拟用户配置的每日热量目标
  const calorieTarget = ref(2000);
    // 所有饮食历史记录
  const mealHistory = ref([]);

  // 预设食物库
  const foodLibrary = ref([]);

  // 饮食类型选项
  const mealTypes = [
    { value: '早餐', label: '早餐', icon: '../../static/icons/recipe/breakfast.svg' },
    { value: '午餐', label: '午餐', icon: '../../static/icons/recipe/lunch.svg' },
    { value: '晚餐', label: '晚餐', icon: '../../static/icons/recipe/dinner.svg' },
    { value: '加餐', label: '加餐', icon: '../../static/icons/recipe/addition.svg' }
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

  // 中文餐食类型到英文的映射
  const mealTypeMap = {
    '早餐': 'breakfast',
    '午餐': 'lunch', 
    '晚餐': 'dinner',
    '加餐': 'snack'
  };

  // 英文餐食类型到中文的映射
  const englishToChineseMap = {
    'breakfast': '早餐',
    'lunch': '午餐',
    'dinner': '晚餐', 
    'snack': '加餐'
  };

  // 从后端获取饮食记录
  const fetchMealHistory = () => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/diet/get',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + uni.getStorageSync('jwtToken')
        },          
        success: (res) => {
          console.log('fetchMealHistory API 返回值:', res);
          console.log('fetchMealHistory 数据:', res.data);
            if (res.statusCode === 200 && res.data.success) {
            const records = res.data.records; // API返回的是 {success: true, records: [...]}
            
            // 将API数据转换为本地数据结构
            const groupedData = {};
            
            records.forEach(record => {
              // 将时间戳转换为日期字符串
              const date = new Date(record.created_at).toISOString().slice(0, 10);
                // 构建本地记录格式
              const localRecord = {
                id: record.record_id,
                type: englishToChineseMap[record.meal_type] || record.meal_type,
                name: record.food_name,
                calories: record.calories,
                timestamp: new Date(record.created_at).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }).replace(/\//g, '-')
              };
              
              // 按日期分组
              if (!groupedData[date]) {
                groupedData[date] = {
                  date: date,
                  meals: []
                };
              }
              
              groupedData[date].meals.push(localRecord);
            });
            
            // 转换为数组并按日期排序（最新的在前）
            const formattedData = Object.values(groupedData).sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });
            
            // 每天的meals按时间排序
            formattedData.forEach(day => {
              day.meals.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
              });
            });
            
            mealHistory.value = formattedData;
            resolve(formattedData);
          } else {
            console.error('获取饮食记录失败:', res);
            reject(new Error('获取饮食记录失败'));
          }
        },        fail: (error) => {
          console.error('API调用失败:', error);
          reject(error);
        }
      });
    });
  };

  // 添加新的饮食记录
  const addMealRecord = (mealData) => {
    return new Promise((resolve, reject) => {
      // 将中文餐食类型转换为英文
      const englishMealType = mealTypeMap[mealData.type] || 'snack';
      
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/diet/add',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + uni.getStorageSync('jwtToken')
        },
        data: {
          meal_type: englishMealType,
          calories: parseInt(mealData.calories),
          food_name: mealData.name
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            const apiRecord = res.data.record;
            const currentDate = getTodayDateString();
              // 构建本地记录格式
            const newRecord = {
              id: apiRecord._id,
              type: englishToChineseMap[apiRecord.meal_type] || apiRecord.meal_type,
              name: apiRecord.food_name,
              calories: apiRecord.calories,
              timestamp: new Date(apiRecord.created_at).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }).replace(/\//g, '-')
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
            
            resolve(newRecord);
          } else {
            console.error('添加饮食记录失败:', res);
            reject(new Error('添加饮食记录失败'));
          }
        },
        fail: (error) => {
          console.error('API调用失败:', error);
          reject(error);
        }
      });
    });
  };  // 删除饮食记录
  const deleteMealRecord = (date, id) => {
    return new Promise((resolve, reject) => {
      console.log('deleteMealRecord 开始删除记录');
      console.log('删除参数 - date:', date);
      console.log('删除参数 - id:', id);
      console.log('JWT Token:', uni.getStorageSync('jwtToken'));
      
      const requestData = {
        record_id: id
      };
      console.log('请求数据:', requestData);
      
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/diet/delete',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + uni.getStorageSync('jwtToken')
        },
        data: requestData,
        success: (res) => {
          if (res.statusCode === 200 && res.data.success) {
            // API 删除成功后，删除本地数据
            const dayIndex = mealHistory.value.findIndex(day => day.date === date);
            if (dayIndex !== -1) {
              const meals = mealHistory.value[dayIndex].meals;
              const mealIndex = meals.findIndex(meal => meal.id === id);
              if (mealIndex !== -1) {
                meals.splice(mealIndex, 1);
                // 如果该天没有记录了，移除整天
                if (meals.length === 0) {
                  mealHistory.value.splice(dayIndex, 1);
                }
                resolve(true);
              } else {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          } else {
            console.error('删除饮食记录失败:', res);
            reject(new Error('删除饮食记录失败'));
          }
        },
        fail: (error) => {
          console.error('API调用失败:', error);
          reject(error);
        }
      });
    });
  };

  // 获取预设食物库
  const fetchFoodLibrary = () => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/foodlib/get',
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          console.log('fetchFoodLibrary API 返回值:', res);
          console.log('fetchFoodLibrary 数据:', res.data);
          
          if (res.statusCode === 200 && res.data.success) {
            const foods = res.data.foods || [];
            foodLibrary.value = foods.map(food => ({
              id: food._id,
              name: food.name,
              calories: food.calories,
              category: food.category,
              note: food.note || ''
            }));
            resolve(foodLibrary.value);
          } else {
            console.error('获取食物库失败:', res);
            foodLibrary.value = [];
            resolve([]);
          }
        },
        fail: (error) => {
          console.error('获取食物库API调用失败:', error);
          foodLibrary.value = [];
          resolve([]);
        }
      });
    });
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

  // 根据饮食类型获取对应的图标
  const getMealTypeIcon = (type) => {
    const mealType = mealTypes.find(item => item.value === type);
    return mealType ? mealType.icon : 'static/icons/recipe/addition.svg';
  };
  return {
    calorieTarget,
    mealHistory,
    mealTypes,
    foodLibrary,
    todayCalorieIntake,
    fetchMealHistory,
    addMealRecord,
    deleteMealRecord,
    updateCalorieTarget,
    getTodayDateString,
    formatDateDisplay,
    getMealTypeIcon,
    fetchFoodLibrary
  };
};
