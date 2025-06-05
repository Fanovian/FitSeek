<template>
  <view class="card blood-oxygen-card" @click="goDetail">
    <view class="card-title">血氧</view>    <view class="card-content">      <view v-for="(item, idx) in recentRecords" :key="idx" class="record-line">
        <view class="record-info">
          <text>{{ item.time.slice(11, 16) }}</text>
          <text class="value">{{ item.value }}%</text>
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
  name: 'BloodOxygenCard',
  props: {
    records: {
      type: Array,
      default: () => []
    }
  },
  emits: ['delete'],
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
    },    deleteRecord(record) {
      this.$emit('delete', record.id);
    },
    modifyRecord(record) {
      this.$emit('modify', record);
    },
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

.record-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.value {
  color: #1976d2;
  font-weight: bold;
  margin: 0 8rpx;
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

.positive {
  color: #1976d2;
}
.negative {
  color: #F44336;
}
</style>
