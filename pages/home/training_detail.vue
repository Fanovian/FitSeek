<!-- pages/training-detail/index.vue -->
<template>
    <view class="detail-container">
      <view class="training-summary">
        <text class="summary-title">本周锻炼概览</text>
        <view class="summary-item">
          <text>总时长：{{ totalDuration }}分钟</text>
          <text>平均时长：{{ avgDuration }}分钟/次</text>
          <text v-if="trend > 0" class="positive">总体趋势：+{{ trend }}分钟</text>
          <text v-else-if="trend < 0" class="negative">总体趋势：{{ trend }}分钟</text>
          <text v-else>总体趋势：无变化</text>
        </view>
      </view>
      
      <view class="record-list">
        <view v-for="(item, index) in detailedRecords" :key="index" class="record-item">
          <text>{{ item.date }} - {{ item.duration }}</text>
          <text>{{ item.type || '综合训练' }}</text>
        </view>
      </view>
    </view>
  </template>
  
  <script>
export default {
  props: {
    data: {
      type: String,
      default: '{}'
    }
  },
  data() {
    return {
      detailedRecords: [],
    };
  },
  computed: {
    totalDuration() {
      return this.detailedRecords.reduce((sum, item) => {
        const duration = parseInt(item.duration);
        return sum + (isNaN(duration) ? 0 : duration);
      }, 0);
    },
    avgDuration() {
      return this.detailedRecords.length
        ? (this.totalDuration / this.detailedRecords.length).toFixed(1)
        : 0;
    },
    trend() {
      if (this.detailedRecords.length < 2) return 0;
      const first = parseInt(this.detailedRecords[0].duration);
      const last = parseInt(this.detailedRecords[this.detailedRecords.length - 1].duration);
      return last - first;
    }
  },
  created() {
    this.detailedRecords = JSON.parse(decodeURIComponent(this.data));
  }
};
</script>
  
  <style scoped>
  .training-summary {
    padding: 20rpx;
  }
  
  .summary-title {
    font-weight: bold;
    margin-bottom: 15rpx;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-top: 10rpx;
  }
  
  .positive {
    color: #4CAF50;
  }
  .negative {
    color: #F44336;
  }
  </style>