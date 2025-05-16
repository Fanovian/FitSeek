<!-- pages/home/index.vue -->
<template>
  <view class="container">
    <!-- 顶部信息栏 -->
    <view class="top-section">
      <view class="target-info">
        <text class="label">距离目标</text>
        <text class="value">5.2kg</text>
      </view>
      
      <view class="current-weight">
        <text class="weight">65.0</text>
        <text class="unit">(72.5)</text>
      </view>
      
      <view class="bmi-info">
        <text class="label">BMI</text>
        <text class="value">21.8</text>
      </view>
    </view>

    <!-- 数据卡片容器 -->
    <scroll-view 
      scroll-y 
      class="card-container"
      :scroll-with-animation="true"
    >
      <view class="card-list">
        <!-- 体重记录 -->
        <WeightCard 
          :records="weightRecords"
        />
        <!-- 体脂记录 -->
        <BodyFatCard 
          :records="bodyFatRecords"
        />
        <!-- 锻炼记录 -->
        <TrainingCard 
          :records="trainingRecords"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import WeightCard from '@/pages/home/components/WeightCard.vue';
import BodyFatCard from '@/pages/home/components/BodyFatCard.vue';
import TrainingCard from '@/pages/home/components/TrainingCard.vue';

export default {
  components: {
    WeightCard,
    BodyFatCard,
    TrainingCard,
  },
  data() {
    return {
      weightRecords: [
        { date: '2023-09-09', value: '64.8kg', change: '-0.2kg' },
        { date: '2023-09-08', value: '65.0kg', change: '+0.3kg' },
        { date: '2023-09-07', value: '64.7kg', change: '-0.2kg' },
        { date: '2023-09-06', value: '64.9kg', change: '+0.3kg' },
        { date: '2023-09-05', value: '64.6kg', change: '-0.2kg' },
        { date: '2023-09-04', value: '64.8kg', change: '+0.3kg' },
        { date: '2023-09-03', value: '64.5kg', change: '-0.2kg' },
        { date: '2023-09-02', value: '64.7kg', change: '-0.3kg' },
        { date: '2023-09-01', value: '65.0kg', change: '+0.3kg' },
      ],
      bodyFatRecords: [
        { date: '2023-09-09', value: '22.1%', change: '-0.1%' },
        { date: '2023-09-08', value: '22.2%', change: '+0.2%' },
        { date: '2023-09-07', value: '22.0%', change: '-0.3%' },
        { date: '2023-09-06', value: '22.3%', change: '+0.2%' },
        { date: '2023-09-05', value: '22.1%', change: '-0.1%' },
        { date: '2023-09-04', value: '22.2%', change: '+0.2%' },
        { date: '2023-09-03', value: '22.0%', change: '-0.3%' },
        { date: '2023-09-02', value: '22.3%', change: '+0.2%' },
        { date: '2023-09-01', value: '22.1%', change: '-0.5%' },
      ],
      trainingRecords: [
        { date: '2023-09-09', duration: '80min', change: '+5min' },
        { date: '2023-09-08', duration: '75min', change: '+5min' },
        { date: '2023-09-07', duration: '70min', change: '+5min' },
        { date: '2023-09-06', duration: '65min', change: '+5min' },
        { date: '2023-09-05', duration: '60min', change: '+5min' },
        { date: '2023-09-04', duration: '55min', change: '+5min' },
        { date: '2023-09-03', duration: '50min', change: '+10min' },
        { date: '2023-09-02', duration: '40min', change: '-5min' },
        { date: '2023-09-01', duration: '45min', change: '+5min' },
      ],
    };
  },
  methods: {
    // 获取体重记录
    async fetchWeightRecords() {
      try {
        const res = await uni.request({
          url: 'http://123.206.217.44:3000/api/weight/records',
          method: 'GET',
          header: {
            Authorization: uni.getStorageSync('jwtToken') || ''
          }
        });
        if (res.data && res.data.success) {
          this.weightRecords = res.data.records;
        }
      } catch (e) {
        // 网络异常等可忽略，保留示例数据
      }
    },
    // 获取体脂记录
    async fetchBodyFatRecords() {
      try {
        const res = await uni.request({
          url: 'http://123.206.217.44:3000/api/bodyfat/records',
          method: 'GET',
          header: {
            Authorization: uni.getStorageSync('jwtToken') || ''
          }
        });
        if (res.data && res.data.success) {
          this.bodyFatRecords = res.data.records;
        }
      } catch (e) {
        // 网络异常等可忽略，保留示例数据
      }
    },
    // 获取锻炼记录
    async fetchTrainingRecords() {
      try {
        const res = await uni.request({
          url: 'http://123.206.217.44:3000/api/training/records',
          method: 'GET',
          header: {
            Authorization: uni.getStorageSync('jwtToken') || ''
          }
        });
        if (res.data && res.data.success) {
          this.trainingRecords = res.data.records;
        }
      } catch (e) {
        // 网络异常等可忽略，保留示例数据
      }
    }
  },
  created() {
    // 如需启用接口数据，取消注释即可
    // this.fetchWeightRecords();
    // this.fetchBodyFatRecords();
    // this.fetchTrainingRecords();
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden; /* 防止页面整体滚动 */
}

/* 顶部信息栏样式 */
.top-section {
  height: 400rpx; /* 固定高度 */
  background-color: #f0fff0;
  display: flex;
  padding: 20rpx;
  box-sizing: border-box;
  position: sticky; /* 固定顶部 */
  top: 0;
  z-index: 10;
}

.target-info, .bmi-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #388e3c;
}

.current-weight {
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #388e3c;
}

.weight {
  font-size: 48px;
  font-weight: bold;
}

.unit {
  font-size: 24px;
  margin-left: 10px;
}

/* 数据卡片容器 */
.card-container {
  flex: 1; /* 占满剩余空间 */
  background: linear-gradient(to bottom, #f0fff0, #ffffff);
  padding: 20rpx;
  box-sizing: border-box;
  overflow-y: auto; /* 启用滚动 */
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>