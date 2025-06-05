<template>
  <view class="card heart-rate-card" @click="goDetail">
    <view class="card-title">心率</view>    <view class="card-content">      <view v-for="(item, idx) in recentRecords" :key="idx" class="record-line">
        <view class="record-info">
          <text>{{ item.time.slice(11, 16) }}</text>
          <text class="value">{{ item.value }}bpm</text>
          <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">{{ item.change }}</text>
        </view>
        <view class="action-buttons">
          <text class="modify-btn" @click.stop="modifyRecord(item)">修改</text>
          <text class="delete-btn" @click.stop="deleteRecord(item)">删除</text>
        </view>
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
  },  methods: {
    goDetail() {
      uni.navigateTo({
        url: '/pages/home/heart_rate_detail?data=' + encodeURIComponent(JSON.stringify(this.records))
      });
    },    deleteRecord(item) {
      this.$emit('delete', item.id);
    },
    modifyRecord(item) {
      this.$emit('modify', item);
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
.record-info {
  display: flex;
  align-items: center;
  flex: 1;
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
  font-size: 24rpx;
  color: #ff4757;
  padding: 8rpx 16rpx;
  border: 1px solid #ff4757;
  border-radius: 8rpx;
  background-color: rgba(255, 71, 87, 0.1);
  transition: all 0.2s;
}
.delete-btn:hover {
  background-color: #ff4757;
  color: #ffffff;
}
</style>
