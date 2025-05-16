// 锻炼记录相关的状态管理
import { ref } from 'vue';

// 创建一个可以在组件外部使用的响应式状态
const workoutRecords = ref([]);

// 锻炼类型选项
const workoutTypes = [
  { value: 'cardio', label: '有氧' },
  { value: 'strength', label: '无氧' },
  { value: 'stretch', label: '拉伸' },
  { value: 'other', label: '其他' }
];

export const useTrainingStore = () => {

  // 从后端获取锻炼记录
  const fetchWorkoutRecords = () => {
    // 实际项目中这里应该是API调用
    // 现在用模拟数据替代
    const mockData = [
      {
        id: 1,
        workoutType: 'cardio',
        typeName: '有氧',
        content: '慢跑',
        duration: '30',
        createdAt: '2025-05-15 15:30:00'
      },
      {
        id: 2,
        workoutType: 'strength',
        typeName: '无氧',
        content: '哑铃卧推',
        duration: '45',
        createdAt: '2025-05-14 10:20:00'
      },
      {
        id: 3,
        workoutType: 'stretch',
        typeName: '拉伸',
        content: '瑜伽',
        duration: '20',
        createdAt: '2025-05-13 18:45:00'
      }
    ];
    
    workoutRecords.value = mockData;
    return mockData;
  };

  // 添加新的锻炼记录
  const addWorkoutRecord = (record) => {
    // 实际项目中应该先发送到后端，成功后再添加到本地状态
    const newRecord = {
      id: workoutRecords.value.length + 1,
      ...record,
      createdAt: formatDate(new Date())
    };
    
    // 添加到列表开头
    workoutRecords.value.unshift(newRecord);
    return newRecord;
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
    // 实际项目中应该发送请求到后端删除
    // 然后再删除本地数据
    const index = workoutRecords.value.findIndex(record => record.id === id);
    if (index !== -1) {
      workoutRecords.value.splice(index, 1);
      return true;
    }
    return false;
  };
  
  return {
    workoutRecords,
    workoutTypes,
    fetchWorkoutRecords,
    addWorkoutRecord,
    deleteWorkoutRecord,
    getWorkoutTypeIcon,
    formatDate
  };
};
