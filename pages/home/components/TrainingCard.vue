<!-- components/TrainingCard.vue -->
<!-- 锻炼卡片组件，展示最近三条锻炼记录，点击可进入详情页。 -->
<template>
    <!-- 锻炼卡片主容器 -->
    <view class="card training-card" @click="navigateToDetail">
      <!-- 卡片标题 -->
      <view class="card-title">锻炼记录</view>
      <!-- 最近三条锻炼记录列表 -->
      <view class="card-content">
        <view v-for="(item, index) in recentRecords" :key="index" class="record-line">
          <!-- 单条锻炼记录，含类型、时长、变化 -->
          <text>{{ getDate(item.time) }} - {{ item.duration }}</text>
          <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
            {{ item.change }}
          </text>
          <text class="type-label">{{ typeMap[item.type] || '综合' }}</text>
        </view>
      </view>
    </view>
  </template>
  <script>
  // 锻炼卡片逻辑：props 传入 records，computed 取最近三条，methods 提供跳转和时间格式化，typeMap 显示类型中文
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
    }
  },
  methods: {
    navigateToDetail() {
      uni.navigateTo({
        url: `/pages/home/training_detail?data=${encodeURIComponent(JSON.stringify(this.records))}`,
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