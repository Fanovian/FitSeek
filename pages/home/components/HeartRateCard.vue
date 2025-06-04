<template>
  <view class="card heart-rate-card" @click="goDetail">
    <view class="card-title">心率</view>
    <view class="card-content">
      <view v-for="(item, idx) in recentRecords" :key="idx" class="record-line">
        <text>{{ item.time.slice(11, 16) }}</text>
        <text class="value">{{ item.value }}bpm</text>
        <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">{{ item.change }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'HeartRateCard',
  props: {
    records: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    recentRecords() {
      return this.records.slice(0, 3);
    }
  },
  methods: {
    goDetail() {
      uni.navigateTo({
        url: '/pages/home/heart_rate_detail?data=' + encodeURIComponent(JSON.stringify(this.records))
      });
    }
  }
}
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
.value {
  color: #e53935;
  font-weight: bold;
  margin: 0 8rpx;
}
.positive {
  color: #e53935;
}
.negative {
  color: #1976d2;
}
</style>
