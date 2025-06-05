<!-- components/WeightCard.vue -->
<!-- 体重卡片组件，展示最近三条体重记录，点击可进入详情页。 -->
<template>
    <!-- 体重卡片主容器 -->
    <view class="card weight-card" @click="navigateToDetail">
      <!-- 卡片标题 -->
      <view class="card-title">体重记录</view>
      <!-- 最近三条体重记录列表 -->
      <view class="card-content">
        <view v-for="(item, index) in recentRecords" :key="index" class="record-line">
          <!-- 体重数值及时间 -->
          <view class="record-info">
            <text>{{ getDate(item.time) + "  " + getTime(item.time) }} - {{ item.value }}</text>
            <!-- 体重变化趋势（正/负） -->
            <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
              {{ item.change }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </template>
  <!-- 体重卡片逻辑：props 传入 records，computed 取最近三条，methods 提供跳转和时间格式化 -->
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