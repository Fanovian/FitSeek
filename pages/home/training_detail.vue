<!-- pages/training-detail/index.vue -->
<template>
    <view class="detail-container">
      <view class="chart-container">
        <text>锻炼时长变化趋势图表</text>
        <view class="trend">
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
.detail-container {
  padding: 20rpx;
}

.chart-container {
  height: 400rpx;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
}

.trend {
  margin-top: 10rpx;
  font-size: 28rpx;
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

.positive {
  color: #4CAF50;
}

.negative {
  color: #F44336;
}
</style>