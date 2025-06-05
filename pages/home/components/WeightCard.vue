<!-- components/WeightCard.vue -->
<template>
    <view class="card weight-card" @click="navigateToDetail">
      <view class="card-title">体重记录</view>      <view class="card-content">        <view v-for="(item, index) in recentRecords" :key="index" class="record-line">
          <view class="record-info">
            <text>{{ item.date }} - {{ item.value }}</text>
            <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
              {{ item.change }}
            </text>
          </view>
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
  },
  methods: {
    navigateToDetail() {
      uni.navigateTo({
        url: `/pages/home/weight_detail?data=${encodeURIComponent(JSON.stringify(this.records))}`,
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
  
  .weight-card { border-left: 4px solid #FF9800; }
  
  .card-title {
    font-weight: bold;
    margin-bottom: 10rpx;
    color: #FF9800;
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
  }    .record-info {
    display: flex;
    justify-content: space-between;
    flex: 1;
  }

  .positive { color: #4CAF50; }
  .negative { color: #F44336; }
  </style>