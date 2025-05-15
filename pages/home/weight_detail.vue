<!-- pages/weight-detail/index.vue -->
<template>
    <view class="detail-container">
      <view class="chart-container">
        <!-- 这里可以集成ECharts图表 -->
        <text>体重变化趋势图表</text>
        <view class="trend">
          <text v-if="trend > 0" class="positive">总体趋势：+{{ trend }}kg</text>
          <text v-else-if="trend < 0" class="negative">总体趋势：{{ trend }}kg</text>
          <text v-else>总体趋势：无变化</text>
        </view>
      </view>
      
      <view class="record-list">
        <view v-for="(item, index) in detailedRecords" :key="index" class="record-item">
          <text>{{ item.date }} - {{ item.value }}</text>
          <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
            {{ item.change }}
          </text>
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
    trend() {
      if (this.detailedRecords.length < 2) return 0;
      const first = parseFloat(this.detailedRecords[0].value);
      const last = parseFloat(this.detailedRecords[this.detailedRecords.length - 1].value);
      return (last - first).toFixed(2);
    }
  },
  created() {
    this.detailedRecords = JSON.parse(decodeURIComponent(this.data));
  }
};
</script>
  
  <style scoped>
  .detail-container {
    padding: 20rpx;
  }
  
  .chart-container {
    height: 400rpx;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .record-list {
    flex: 1;
  }
  
  .record-item {
    display: flex;
    justify-content: space-between;
    padding: 15rpx 0;
    border-bottom: 1px solid #eee;
  }
  
  .trend {
    margin-top: 10rpx;
    font-size: 28rpx;
  }
  .positive {
    color: #4CAF50;
  }
  .negative {
    color: #F44336;
  }
  </style>