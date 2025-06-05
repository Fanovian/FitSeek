<!-- WorkoutForm.vue -->
<!-- 锻炼记录表单组件，支持添加/编辑锻炼内容、类型、时长，含下拉选择与表单校验。 -->
<script setup>
// 组件逻辑：props 传入类型/库/编辑项，emit 事件，含表单数据、校验、下拉、提交/取消等
import { ref, defineProps, defineEmits, computed, watch } from 'vue';

const props = defineProps({
  workoutTypes: {
    type: Array,
    required: true
  },
  trainLibrary: {
    type: Array,
    default: () => []
  },
  editingWorkout: {
    type: Object,
    default: null
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);

// 表单数据
const formData = ref({
  workoutType: 'cardio',
  content: '',
  duration: '',
});

// 监听编辑数据变化，初始化表单
watch(() => props.editingWorkout, (editingWorkout) => {
  if (editingWorkout && props.isEditing) {
    formData.value = {
      workoutType: editingWorkout.workoutType,
      content: editingWorkout.content,
      duration: editingWorkout.duration
    };
  } else {
    formData.value = {
      workoutType: 'cardio',
      content: '',
      duration: ''
    };
  }
}, { immediate: true });

// 控制下拉菜单显示
const showDropdown = ref(false);

// 过滤后的训练库（根据输入内容筛选）
const filteredTrainLibrary = computed(() => {
  if (!formData.value.content.trim()) {
    return props.trainLibrary;
  }
  return props.trainLibrary.filter(train => 
    train.name.toLowerCase().includes(formData.value.content.toLowerCase())
  );
});

// 表单验证
const formErrors = ref({
  content: '',
  duration: ''
});

// 验证表单
const validateForm = () => {
  let isValid = true;
  formErrors.value.content = '';
  formErrors.value.duration = '';
  
  if (!formData.value.content.trim()) {
    formErrors.value.content = '请输入锻炼内容';
    isValid = false;
  }
  
  if (!formData.value.duration) {
    formErrors.value.duration = '请输入锻炼时长';
    isValid = false;
  } else if (isNaN(formData.value.duration) || formData.value.duration <= 0) {
    formErrors.value.duration = '请输入有效的时长值';
    isValid = false;
  }
  
  return isValid;
};

// 选择预设训练
const selectTrain = (train) => {
  formData.value.content = train.name;
  showDropdown.value = false;
};

// 获取训练分类的中文名称
const getTrainCategoryName = (category) => {
  const categoryMapping = {
    'cardio': '有氧运动',
    'aerobic': '有氧运动',
    'strength': '力量训练',
    'anaerobic': '无氧运动',
    'stretch': '拉伸运动',
    'stretching': '拉伸运动',
    'other': '其他运动'
  };
  return categoryMapping[category] || '其他运动';
};

// 处理锻炼内容输入
const handleContentInput = () => {
  showDropdown.value = true;
};

// 显示下拉菜单
const showTrainDropdown = () => {
  showDropdown.value = true;
};

// 隐藏下拉菜单
const hideTrainDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200); // 延迟隐藏，让点击事件能够执行
};

// 提交表单
const submitForm = () => {
  if (!validateForm()) return;
  
  // 获取当前类型的名称
  const selectedType = props.workoutTypes.find(type => type.value === formData.value.workoutType);
  
  // 提交表单数据
  emit('submit', {
    workoutType: formData.value.workoutType,
    typeName: selectedType.label,
    content: formData.value.content,
    duration: formData.value.duration,
  });
  
  // 重置表单（只在非编辑模式下重置）
  if (!props.isEditing) {
    formData.value.content = '';
    formData.value.duration = '';
    formErrors.value = { content: '', duration: '' };
  }
};

// 取消
const cancelForm = () => {
  // 重置错误
  formErrors.value = { content: '', duration: '' };
  
  showDropdown.value = false;
  
  emit('cancel');
};
</script>
<template>
  <!-- 锻炼表单主区域 -->
  <view class="form-section">
    <!-- 表单头部 -->
    <view class="form-header">
      <text class="form-title">{{ isEditing ? '修改锻炼记录' : '添加锻炼记录' }}</text>
    </view>
    
    <!-- 训练内容输入区 -->
    <view class="form-item">
      <text class="form-label">锻炼内容</text>
      
      <view class="content-input-container">
        <input 
          type="text" 
          v-model="formData.content" 
          placeholder="请输入锻炼内容"
          class="form-input" 
          @input="handleContentInput"
          @focus="showTrainDropdown"
          @blur="hideTrainDropdown"
        />
        
        <!-- 预设训练下拉菜单 -->
        <view 
          v-if="showDropdown && filteredTrainLibrary.length > 0" 
          class="train-dropdown"
        >
          <view 
            v-for="train in filteredTrainLibrary" 
            :key="train.id"
            class="train-dropdown-item"
            @click="selectTrain(train)"
          >            <view class="train-info">
              <text class="train-name">{{ train.name }}</text>
            </view>
            <text v-if="train.category" class="train-category">{{ getTrainCategoryName(train.category) }}</text>
          </view>
        </view>
      </view>
      
      <text v-if="formErrors.content" class="error-text">{{ formErrors.content }}</text>
    </view>
    
    <!-- 时长输入与错误提示 -->
    <view class="form-item">
      <text class="form-label">锻炼时长 (分钟)</text>
      <input type="number" v-model="formData.duration" placeholder="请输入锻炼时长" class="form-input" />
      <text v-if="formErrors.duration" class="error-text">{{ formErrors.duration }}</text>
    </view>
      <view class="form-actions">
      <button class="cancel-btn" @click="cancelForm">取消</button>
      <button class="submit-btn" @click="submitForm">{{ isEditing ? '更新' : '保存' }}</button>
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

.workout-types-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
}

.workout-type-item {
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

.workout-type-item.active {
  background-color: #e8f5e9;
  border-color: #4CAF50;
  box-shadow: 0 2rpx 8rpx rgba(76, 175, 80, 0.2);
}

.workout-type-item.active::before {
  content: '';
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: #4CAF50;
  transform: rotate(45deg);
}

.workout-type-item.active::after {
  content: '✓';
  position: absolute;
  top: 0;
  right: 3rpx;
  color: white;
  font-size: 16rpx;
}

.workout-type-icon {
  width: 50rpx;
  height: 50rpx;
  margin-bottom: 10rpx;
}

.workout-type-label {
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

/* 训练内容输入区域样式 */
.content-input-container {
  position: relative;
}

.train-dropdown {
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
.train-dropdown::-webkit-scrollbar {
  width: 8rpx;
}

.train-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10rpx;
}

.train-dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10rpx;
}

.train-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.train-dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s ease;
}

.train-dropdown-item:hover {
  background-color: #f8f8f8;
}

.train-dropdown-item:last-child {
  border-bottom: none;
}

.train-info {
  flex: 1;
}

.train-name {
  font-size: 28rpx;
  color: #333;
  display: block;
}

.train-category {
  font-size: 22rpx;
  color: #999;
  background-color: #f0f0f0;
  padding: 4rpx 8rpx;
  border-radius: 10rpx;
}
</style>
