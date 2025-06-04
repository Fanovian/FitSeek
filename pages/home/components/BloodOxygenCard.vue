<template>
  <view class="card blood-oxygen-card" @click="goDetail">
    <view class="card-title">血氧</view>
    <view class="card-content">
      <view v-for="(item, idx) in recentRecords" :key="idx" class="record-line">
        <text>{{ item.time.slice(11, 16) }}</text>
        <text class="value">{{ item.value }}%</text>
        <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">{{ item.change }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BloodOxygenCard',
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
        url: '/pages/home/blood_oxygen_detail?data=' + encodeURIComponent(JSON.stringify(this.records))
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
.blood-oxygen-card { border-left: 4px solid #1976d2; }
.card-title {
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #1976d2;
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
  color: #1976d2;
  font-weight: bold;
  margin: 0 8rpx;
}
.positive {
  color: #1976d2;
}
.negative {
  color: #F44336;
}
</style>
