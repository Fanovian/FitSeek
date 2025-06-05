<template>
  <view class="card article-card" @click="$emit('click')">
    <view class="card-title">文章</view>
    <view class="card-content">
      <view v-if="latest" class="record-line">
        <text>{{ getTitle(latest.content) }}</text>
        <text class="date">{{ latest.publish_time.slice(0,10) }}</text>
      </view>
      <view v-else class="record-line"><text>暂无文章</text></view>
    </view>
  </view>
</template>
<script>
export default {
  props: { articles: Array },
  computed: {
    latest() {
      return (this.articles && this.articles.length) ? this.articles[0] : null;
    }
  },
  methods: {
    getTitle(md) {
      if (!md) return '';
      const firstLine = md.split('\n')[0].replace(/[#*`>\-]/g, '').trim();
      return firstLine.length > 0 ? firstLine.slice(0, 18) : md.slice(0, 18);
    }
  }
}
</script>
<style scoped>
.card {
  width: 100%;
  border-radius: 16px;
  padding: 24rpx 24rpx 18rpx 24rpx;
  box-sizing: border-box;
  background: linear-gradient(90deg, #e8f5e9 80%, #f5faf7 100%);
  box-shadow: 0 2px 8px rgba(67, 160, 71, 0.08);
  margin-bottom: 0;
  border-left: 4px solid #43a047;
}
.article-card { border-left: 4px solid #43a047; }
.card-title {
  font-weight: bold;
  font-size: 32rpx;
  margin-bottom: 12rpx;
  color: #43a047;
  letter-spacing: 2rpx;
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
  border-bottom: 1px dashed #b2d8b6;
  padding: 8rpx 0 4rpx 0;
}
.record-line:last-child { border-bottom: none; }
.date { color: #888; font-size: 22rpx; margin-left: 10rpx; }
</style>
