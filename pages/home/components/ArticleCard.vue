<template>
  <view class="card article-card" @click="$emit('click')">
    <view class="card-title">文章</view>
    <view class="card-content">
      <view v-if="articles && articles.length" v-for="item in previewList" :key="item._id" class="record-line">
        <text>{{ getTitle(item.content) }}</text>
        <text class="date">{{ item.publish_time.slice(0,10) }}</text>
      </view>
      <view v-else class="record-line"><text>暂无文章</text></view>
    </view>
  </view>
</template>
<script>
export default {
  props: { articles: Array },
  computed: {
    previewList() {
      return (this.articles || []).slice(0, 2);
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
.card { width: 100%; border-radius: 16px; padding: 20rpx; box-sizing: border-box; background-color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom: 0; }
.article-card { border-left: 4px solid #43a047; }
.card-title { font-weight: bold; margin-bottom: 10rpx; color: #43a047; }
.card-content { width: 100%; display: flex; flex-direction: column; gap: 8rpx; }
.record-line { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.date { color: #888; font-size: 22rpx; margin-left: 10rpx; }
</style>
