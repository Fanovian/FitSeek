<!-- AnnouncementCard.vue -->
<!-- 公告卡片组件，展示最新一条公告标题和日期，点击可跳转详情。 -->
<template>
  <!-- 公告卡片主容器 -->
  <view class="card announcement-card" @click="$emit('click')">
    <!-- 公告标题 -->
    <view class="card-title">公告</view>
    <!-- 公告内容区，显示最新公告或暂无公告 -->
    <view class="card-content">
      <view v-if="latest" class="record-line">
        <!-- 公告标题与日期 -->
        <text>{{ getTitle(latest.content) }}</text>
        <text class="date">{{ getDate(latest.publish_time) }}</text>
      </view>
      <view v-else class="record-line"><text>暂无公告</text></view>
    </view>
  </view>
</template>
<script>
// 组件逻辑：props 传入公告数组，computed 取最新，methods 提供标题/日期格式化
export default {
  props: { announcements: Array },
  computed: {
    latest() {
      return (this.announcements && this.announcements.length) ? this.announcements[0] : null;
    }
  },
  methods: {
    getDate(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' });
    },
    getTime(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Shanghai' });
    },
    getTitle(md) {
      // 取markdown首行或前20字
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
  background: linear-gradient(90deg, #e3f0fd 80%, #f5fafd 100%);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  margin-bottom: 0;
  border-left: 4px solid #1976d2;
}
.announcement-card { border-left: 4px solid #1976d2; }
.card-title {
  font-weight: bold;
  font-size: 32rpx;
  margin-bottom: 12rpx;
  color: #1976d2;
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
  border-bottom: 1px dashed #b3c6e0;
  padding: 8rpx 0 4rpx 0;
}
.record-line:last-child { border-bottom: none; }
.date { color: #888; font-size: 22rpx; margin-left: 10rpx; }
</style>
