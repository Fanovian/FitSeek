<!-- components/BodyFatCard.vue -->
<!-- 体脂卡片组件，展示最近三条体脂记录，点击可进入详情页。 -->
<template>
    <!-- 体脂卡片主容器 -->
    <view class="card body-fat-card" @click="navigateToDetail">
      <!-- 卡片标题 -->
      <view class="card-title">体脂记录</view>
      <!-- 最近三条体脂记录列表 -->
      <view class="card-content">
        <view v-for="(item, index) in recentRecords" :key="index" class="record-line">
          <!-- 体脂记录行 -->
          <view class="record-info">
            <text>{{ getDate(item.time) + " " + getTime(item.time) }} - {{ item.value }}</text>
            <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
              {{ item.change }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </template>
  <!-- 体脂卡片逻辑：props 传入 records，computed 取最近三条，methods 提供跳转和时间格式化 -->
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
        url: `/pages/home/body_fat_detail?data=${encodeURIComponent(JSON.stringify(this.records))}`,
      });
    },
    getDate(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return beijing.toISOString().slice(0, 10);
    },
    getTime(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return beijing.toISOString().slice(11, 16);
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
  
  .body-fat-card { border-left: 4px solid #2196F3; }

  .card-title {
    font-weight: bold;
    margin-bottom: 10rpx;
    color: #2196F3;
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
  }
  .record-info {
    display: flex;
    justify-content: space-between;
    flex: 1;
    margin-right: 10rpx;
  }
  
  .action-buttons {
    display: flex;
    gap: 12rpx;
  }
  
  .modify-btn {
    color: #1976d2;
    font-size: 24rpx;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    border: 1px solid #1976d2;
    background-color: rgba(25, 118, 210, 0.1);
    transition: all 0.2s;
  }
  
  .modify-btn:hover {
    background-color: #1976d2;
    color: #ffffff;
  }
  
  .delete-btn {
    color: #ff4757;
    font-size: 24rpx;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    border: 1px solid #ff4757;
    background-color: rgba(255, 71, 87, 0.1);
    transition: all 0.2s;
  }
  
  .delete-btn:hover {
    background-color: #ff4757;
    color: #ffffff;
  }

  .positive { color: #4CAF50; }
  .negative { color: #F44336; }
  </style>