<!-- AddHealthRecordForm.vue -->
<template>
  <view class="health-record-form" :class="{ 'form-expanded': isExpanded }">
    <!-- Add button -->
    <view class="add-button" @click="toggleForm" :class="{ 'button-active': isExpanded }">
      <view class="button-content">
        <text class="add-icon">{{ isExpanded ? '×' : '+' }}</text>
        <text class="add-text" v-if="!isExpanded">添加健康记录</text>
      </view>
    </view>
    
    <!-- Expandable form -->
    <view class="form-container" v-if="isExpanded">
      <view class="form-header">
        <text class="form-title">添加健康记录</text>
      </view>
      
      <view class="record-types">
        <view 
          v-for="option in recordTypes" 
          :key="option.type" 
          class="record-type-option"
          :class="{ 'selected': selectedType === option.type }"
          @click="selectType(option.type)"
        >
          <image :src="option.icon" class="type-icon"></image>
          <text class="type-name">{{ option.name }}</text>
        </view>
      </view>
      
      <view class="input-container">
        <view class="input-group">
          <input 
            type="digit" 
            v-model="recordValue" 
            class="record-input" 
            :placeholder="`输入${getSelectedTypeName()}数值`" 
          />
          <text class="input-unit">{{ getSelectedTypeUnit() }}</text>
        </view>
        
        <button class="submit-button" @click="submitRecord" :disabled="!isValidInput">提交</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AddHealthRecordForm',
  data() {
    return {
      isExpanded: false,
      selectedType: 'weight',
      recordValue: '',
      recordTypes: [
        { type: 'weight', name: '体重', icon: '/static/icons/home/weight.svg', unit: 'kg' },
        { type: 'body_fat', name: '体脂', icon: '/static/icons/home/body_fat.svg', unit: '%' },
        { type: 'heart_rate', name: '心率', icon: '/static/icons/home/heart_rate.svg', unit: '次/分钟' },
        { type: 'blood_oxygen', name: '血氧', icon: '/static/icons/home/blood_oxygen.svg', unit: '%' }
      ]
    };
  },
  computed: {
    isValidInput() {
      return this.recordValue !== '' && !isNaN(Number(this.recordValue)) && Number(this.recordValue) > 0;
    }
  },
  methods: {
    toggleForm() {
      this.isExpanded = !this.isExpanded;
      if (!this.isExpanded) {
        this.resetForm();
      }
    },
    resetForm() {
      this.selectedType = 'weight';
      this.recordValue = '';
    },
    selectType(type) {
      this.selectedType = type;
    },
    getSelectedTypeName() {
      const selected = this.recordTypes.find(item => item.type === this.selectedType);
      return selected ? selected.name : '';
    },
    getSelectedTypeUnit() {
      const selected = this.recordTypes.find(item => item.type === this.selectedType);
      return selected ? selected.unit : '';
    },    async submitRecord() {
      if (!this.isValidInput) return;
      
      try {
        const token = uni.getStorageSync('jwtToken');
        if (!token) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          });
          return;
        }
        
        // 构建请求数据
        const requestData = {
          type: this.selectedType,
          value: Number(this.recordValue)
        };
        
        // 打印请求数据
        console.log('健康记录添加请求数据:', requestData);
        console.log('请求URL:', 'https://api.fanovian.cc:3000/api/fitness/add');
        console.log('请求Header:', {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token.substring(0, 10) + '...' // 只显示部分token
        });
        
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/add',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          data: requestData
        });
        
        // 打印响应数据
        console.log('健康记录添加响应数据:', res.data);
        
        if (res.data && res.data.success) {
          uni.showToast({
            title: '记录添加成功',
            icon: 'success'
          });
          this.resetForm();
          this.toggleForm();
          
          // 发出事件，通知父组件刷新数据
          this.$emit('record-added', this.selectedType);
        } else {
          uni.showToast({
            title: res.data?.message || '添加失败',
            icon: 'none'
          });
        }
      } catch (e) {
        console.error('添加健康记录失败:', e);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style scoped>
.health-record-form {
  position: fixed;
  bottom: 30rpx;
  right: 30rpx;
  z-index: 100;
}

.add-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: #388e3c;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  margin-left: auto;
}

.add-button.button-active {
  transform: rotate(45deg);
}

.button-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.add-icon {
  font-size: 40rpx;
  font-weight: bold;
}

.add-text {
  font-size: 16rpx;
  margin-top: 4rpx;
}

.form-container {
  position: absolute;
  bottom: 120rpx;
  right: 0;
  width: 600rpx;
  background-color: white;
  border-radius: 12rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 20rpx rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.form-header {
  padding-bottom: 10rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.form-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.record-types {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
}

.record-type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx;
  border-radius: 8rpx;
  width: 120rpx;
  cursor: pointer;
}

.record-type-option.selected {
  background-color: rgba(56, 142, 60, 0.1);
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}

.type-name {
  font-size: 24rpx;
  color: #333;
}

.input-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  height: 80rpx;
}

.record-input {
  flex: 1;
  height: 100%;
  font-size: 32rpx;
}

.input-unit {
  color: #666;
  font-size: 26rpx;
  margin-left: 10rpx;
}

.submit-button {
  height: 80rpx;
  background-color: #388e3c;
  color: white;
  border-radius: 8rpx;
  font-size: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button[disabled] {
  background-color: #cccccc;
  cursor: not-allowed;
}

</style>
