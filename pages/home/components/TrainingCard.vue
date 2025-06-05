<!-- components/TrainingCard.vue -->
<template>
    <view class="card training-card" @click="navigateToDetail">
      <view class="card-title">锻炼记录</view>
      <view class="card-content">
        <view v-for="(item, index) in recentRecords" :key="index" class="record-line">
          <text>{{ item.date }} - {{ item.duration }}</text>
          <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
            {{ item.change }}
          </text>
          <text class="type-label">{{ typeMap[item.type] || '综合' }}</text>
        </view>
      </view>
    </view>
  </template>
  
  <script>
export default {
  props: {
    records: {
      type: Array,
      required: true,
    },
  },
  computed: {
    recentRecords() {
      return this.records.slice(0, 3);
    },
    typeMap() {
      return {
        aerobic: '有氧',
        anaerobic: '无氧',
        stretching: '拉伸',
        other: '其他'
      };
    },
  },
  methods: {
    navigateToDetail() {
      uni.navigateTo({
        url: `/pages/home/training_detail?data=${encodeURIComponent(JSON.stringify(this.records))}`,
      });
    },
  },
};
</script>
  
  <style scoped>
  .card {
    width: 100%;
    border-radius: 16px;
    padding: 20rpx;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .training-card { border-left: 4px solid #4CAF50; }
  
  .card-title {
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }
  
  .record-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10rpx;
  }
  
  .positive { color: #4CAF50; }
  .negative { color: #F44336; }
  .type-label {
    font-size: 22rpx;
    color: #388e3c;
    background: #e8f5e9;
    border-radius: 8rpx;
    padding: 2rpx 10rpx;
    margin-left: 6rpx;
  }
  </style>