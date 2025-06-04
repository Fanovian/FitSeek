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
      // 优先展示最新2条，若不足2条则补充本地示例
      let arr = (this.articles || []).slice(0, 2);
      if (arr.length < 2) {
        const today = new Date();
        const sample = [
          {
            _id: 'a1',
            publisher_name: 'fitseek-admin',
            content: '# 健康饮食小贴士\n\n1. 多吃蔬菜水果\n2. 控制油盐糖摄入\n3. 合理搭配主食和蛋白质\n\n',
            publish_time: today.getFullYear() + '-06-01T08:44:58.455Z'
          },
          {
            _id: 'a2',
            publisher_name: 'fitseek-admin',
            content: '## 科学锻炼建议\n\n- 每周至少150分钟有氧运动\n- 力量训练每周2次\n- 运动前后注意拉伸',
            publish_time: today.getFullYear() + '-05-25T15:30:00.000Z'
          }
        ];
        arr = arr.concat(sample.slice(0, 2 - arr.length));
      }
      return arr;
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
