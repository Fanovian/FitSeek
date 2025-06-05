<!-- HeartRateCard.vue -->
<!-- 心率卡片组件，展示最近三条心率记录，点击可进入详情页。 -->
<template>
  <!-- 心率卡片主容器 -->
  <view class="card heart-rate-card" @click="goDetail">
    <!-- 心率卡片标题 -->
    <view class="card-title">心率</view>
      <!-- 最近三条心率记录列表 -->
      <view class="card-content">
        <view v-for="(item, index) in recentRecords" :key="index" class="record-line">
          <!-- 单条心率记录，含时间、数值、变化 -->
          <view class="record-info">
            <text>{{ getDate(item.time) + "  " + getTime(item.time) }} - {{ item.value }}</text>
            <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
              {{ item.change }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  // 组件逻辑：props 传入 records，computed 取最近三条，methods 提供跳转和时间格式化
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
    goDetail() {
      uni.navigateTo({
          url: '/pages/home/heart_rate_detail?data=' + encodeURIComponent(JSON.stringify(this.records))
      });
    },
    // 直接格式化本地时间
    getDate(isoString) {
      if (!isoString) return '';
      // 调试isoString
      // console.log('isoString:', isoString);
      const date = new Date(isoString);
      // 调试date
      // console.log('date:', date);
      // 兼容所有环境，手动加8小时
      const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      // 调试beijing
      // console.log('beijing date:', beijing);
      return beijing.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    },
    getTime(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return beijing.toISOString().slice(11, 16); // 'HH:mm'
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
  margin-bottom: 0;
}
/* 红色边框和文字 */
.heart-rate-card { border-left: 4px solid #e53935; }
.card-title {
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #e53935;
}
.card-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.record-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.record-info {
  display: flex;
  justify-content: space-between;
  flex: 1;
  color: #e53935; /* 红色文字 */
}
.action-buttons {
  display: flex;
  gap: 12rpx;
}
.modify-btn {
  color: #e53935;
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  border: 1px solid #e53935;
  background-color: rgba(229, 57, 53, 0.1);
  transition: all 0.2s;
}
.modify-btn:hover {
  background-color: #e53935;
  color: #ffffff;
}
.value {
  color: #e53935;
  font-weight: bold;
  margin: 0 8rpx;
}
.delete-btn {
  color: #e53935;
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  border: 1px solid #e53935;
  background-color: rgba(229, 57, 53, 0.1);
  transition: all 0.2s;
}
.delete-btn:hover {
  background-color: #e53935;
  color: #ffffff;
}
.positive {
  color: #e53935;
}
.negative {
  color: #F44336;
}
</style>
