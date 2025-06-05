// 锻炼记录相关的状态管理
import { ref, computed } from 'vue';

// 创建一个可以在组件外部使用的响应式状态
const workoutRecords = ref([]);

// 预设训练库
const trainLibrary = ref([]);

// 用户的训练目标
const trainingTarget = ref({
  weeklyMinutes: 120  // 每周锻炼总时长目标（分钟）
});

// 锻炼类型选项
const workoutTypes = [
  { value: 'cardio', label: '有氧' },
  { value: 'strength', label: '无氧' },
  { value: 'stretch', label: '拉伸' },
  { value: 'other', label: '其他' }
];

export const useTrainingStore = () => {
  // 获取锻炼类型对应的中文名称
  const getWorkoutTypeName = (type) => {
    const typeMapping = {
      'cardio': '有氧',
      'strength': '无氧', 
      'aerobic': '有氧',
      'anaerobic': '无氧',
      'stretch': '拉伸',
      'streching': '拉伸',
      'other': '其他'
    };
    return typeMapping[type] || '其他';
  };

  // 格式化时间戳（将ISO时间戳转换为本地格式）
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-');
  };

  // 从后端获取锻炼记录
  const fetchWorkoutRecords = () => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/training/get',
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + uni.getStorageSync('jwtToken')
        },        
        success: (res) => {
          console.log('fetchWorkoutRecords API 返回值:', res);
          console.log('fetchWorkoutRecords 数据:', res.data);
          
          if (res.statusCode === 200 && res.data.success) {
            const records = res.data.records || [];
            
            // 将API数据转换为本地数据结构
            const formattedRecords = records.map(record => ({
              id: record.record_id,
              workoutType: record.train_type || 'other',
              typeName: getWorkoutTypeName(record.train_type || 'other'),
              content: record.content || '未知运动',
              duration: record.duration ? record.duration.toString() : '0',
              createdAt: record.time ? formatTimestamp(record.time) : formatDate(new Date())
            }));
            
            workoutRecords.value = formattedRecords;
            resolve(formattedRecords);
          } else {
            console.error('获取锻炼记录失败:', res);
            workoutRecords.value = [];
            reject(new Error('获取锻炼记录失败'));
          }
        },
        fail: (error) => {
          console.error('API调用失败:', error);
          workoutRecords.value = [];
          reject(error);
        }
      });
    });
  };
  // 添加新的锻炼记录
  const addWorkoutRecord = (record) => {
    return new Promise((resolve, reject) => {
      console.log('addWorkoutRecord 开始添加记录');
      console.log('添加参数:', record);
      
      // 映射前端workoutType到后端train_type
      const trainTypeMap = {
        'cardio': 'aerobic',
        'strength': 'anaerobic', 
        'stretch': 'streching',
        'other': 'other'
      };
      
      const requestData = {
        train_type: trainTypeMap[record.workoutType] || 'other',
        duration: parseInt(record.duration),
        content: record.content
      };
      
      console.log('请求数据:', requestData);
      console.log('JWT Token:', uni.getStorageSync('jwtToken'));
      
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/training/add',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + uni.getStorageSync('jwtToken')
        },
        data: requestData,
        success: (res) => {
          console.log('addWorkoutRecord API 返回值:', res);
          console.log('addWorkoutRecord 数据:', res.data);
          
          if (res.statusCode === 200 && res.data.success) {
            const apiRecord = res.data.record;
            
            // 构建本地记录格式
            const newRecord = {
              id: apiRecord._id || apiRecord.record_id,
              workoutType: record.workoutType, // 保持前端类型
              typeName: record.typeName,
              content: apiRecord.content,
              duration: apiRecord.duration.toString(),
              createdAt: apiRecord.time ? formatTimestamp(apiRecord.time) : formatDate(new Date())
            };
            
            // 添加到本地状态的开头
            workoutRecords.value.unshift(newRecord);
            resolve(newRecord);
          } else {
            console.error('添加锻炼记录失败:', res);
            reject(new Error('添加锻炼记录失败'));
          }
        },
        fail: (error) => {
          console.error('API调用失败:', error);
          reject(error);
        }
      });
    });
  };

  // 格式化日期
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 获取锻炼类型对应的图标
  const getWorkoutTypeIcon = (type) => {
    switch (type) {
      case 'cardio':
        return '/static/icons/training/cardio.svg';
      case 'strength':
        return '/static/icons/training/strength.svg';
      case 'stretch':
        return '/static/icons/training/stretch.svg';
      default:
        return '/static/icons/training/other.svg';
    }
  };
  // 删除锻炼记录
  const deleteWorkoutRecord = (id) => {
    return new Promise((resolve, reject) => {
      console.log('deleteWorkoutRecord 开始删除记录');
      console.log('删除参数 - id:', id);
      console.log('JWT Token:', uni.getStorageSync('jwtToken'));
      
      const requestData = {
        record_id: id
      };
      console.log('请求数据:', requestData);
      
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/training/delete',
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + uni.getStorageSync('jwtToken')
        },
        data: requestData,
        success: (res) => {
          console.log('deleteWorkoutRecord API 返回值:', res);
          console.log('deleteWorkoutRecord 数据:', res.data);
          
          if (res.statusCode === 200 && res.data.success) {
            // API 删除成功后，删除本地数据
            const index = workoutRecords.value.findIndex(record => record.id === id);
            if (index !== -1) {
              workoutRecords.value.splice(index, 1);
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            console.error('删除锻炼记录失败:', res);
            reject(new Error('删除锻炼记录失败'));
          }
        },
        fail: (error) => {
          console.error('API调用失败:', error);
          reject(error);
        }
      });
    });  };
  
  // 获取预设训练库
  const fetchTrainLibrary = () => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/trainlib/get',
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: (res) => {
          console.log('fetchTrainLibrary API 返回值:', res);
          console.log('fetchTrainLibrary 数据:', res.data);
          
          if (res.statusCode === 200 && res.data.success) {
            const trains = res.data.trains || [];
            trainLibrary.value = trains.map(train => ({
              id: train._id,
              name: train.name,
              category: train.category,
              note: train.note || ''
            }));
            resolve(trainLibrary.value);
          } else {
            console.error('获取训练库失败:', res);
            trainLibrary.value = [];
            resolve([]);
          }
        },
        fail: (error) => {
          console.error('获取训练库API调用失败:', error);
          trainLibrary.value = [];
          resolve([]);
        }
      });
    });
  };
  
  // 获取用户的训练目标
  const fetchTrainingTarget = () => {
    // 实际项目中这里应该是API调用
    // 这里使用Promise模拟异步请求
    return new Promise((resolve) => {
      setTimeout(() => {
        // 返回当前保存的目标或默认值
        resolve(trainingTarget.value);
      }, 500);
    });
  };
  
  // 更新用户的训练目标
  const updateTrainingTarget = (newTarget) => {
    // 实际项目中应该发送请求到后端更新
    // 然后再更新本地数据
    if (newTarget.weeklyMinutes > 0) {
      trainingTarget.value = {
        weeklyMinutes: parseInt(newTarget.weeklyMinutes)
      };
      return Promise.resolve(trainingTarget.value);
    }
    return Promise.reject(new Error('训练目标必须为正数'));
  };
  
  // 该函数已移除 - 不再计算每周锻炼次数
  
  // 计算本周已完成的锻炼时长（分钟）
  const weeklyMinutesCompleted = computed(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // 设为本周第一天
    startOfWeek.setHours(0, 0, 0, 0);
    
    // 筛选出本周的记录，并计算总时长
    return workoutRecords.value
      .filter(record => {
        const recordDate = new Date(record.createdAt);
        return recordDate >= startOfWeek;
      })
      .reduce((total, record) => total + parseInt(record.duration), 0);
  });
    return {
    workoutRecords,
    workoutTypes,
    trainLibrary,
    trainingTarget,
    weeklyMinutesCompleted,
    fetchWorkoutRecords,
    addWorkoutRecord,
    deleteWorkoutRecord,
    fetchTrainLibrary,
    getWorkoutTypeIcon,
    formatDate,
    fetchTrainingTarget,
    updateTrainingTarget
  };
};
