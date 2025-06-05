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
  props: {
    records: {
      type: Array,
      required: true,
    },
  },
  emits: ['delete'],
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
    },    deleteRecord(record) {
      this.$emit('delete', record.id);
    },
    modifyRecord(record) {
      this.$emit('modify', record);
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