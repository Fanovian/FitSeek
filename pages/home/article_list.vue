<!-- article_list.vue -->
<!-- 文章列表页，展示所有文章摘要，点击可进入详情。 -->
<template>
  <!-- 文章列表主容器 -->
  <view class="container">
    <!-- 文章列表项，显示标题和日期 -->
    <view v-for="item in articleList" :key="item._id" class="list-item" @click="goDetail(item)">
      <text class="title">{{ getTitle(item.content) }}</text>
      <text class="date">{{ getDate(item.publish_time) }}</text>
    </view>
    <!-- 无文章时的提示 -->
    <view v-if="!articleList.length" class="list-item"><text>暂无文章</text></view>
  </view>
</template>
<script>
// 页面逻辑：onLoad 拉取文章数据，若不足补本地示例，methods 提供跳转、标题/日期格式化
import errorReport from '@/utils/errorReport.js';
export default {
  data() { return { articleList: [] } },
  onLoad() {
    try {
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/article/get',
        method: 'GET',
        header: { 'Content-Type': 'application/json' },
        success: res => {
          this.articleList = res.data.articles || [];
          // 若不足2条补充本地示例
          if (this.articleList.length < 2) {
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
            this.articleList = this.articleList.concat(sample.slice(0, 2 - this.articleList.length));
          }
        },
        fail: err => {
          errorReport(err, 'uni.request fail in article_list.vue', '/pages/home/article_list');
        }
      })
    } catch (err) {
      errorReport(err, 'onLoad try-catch in article_list.vue', '/pages/home/article_list');
    }
  },
  methods: {
    goDetail(item) {
      try {
        uni.navigateTo({
          url: '/pages/home/article_detail?content=' + encodeURIComponent(item.content)
        })
      } catch (err) {
        errorReport(err, 'goDetail in article_list.vue', '/pages/home/article_list');
      }
    },
    getTitle(md) {
      try {
        if (!md) return '';
        const firstLine = md.split('\n')[0].replace(/[#*`>\-]/g, '').trim();
        return firstLine.length > 0 ? firstLine.slice(0, 18) : md.slice(0, 18);
      } catch (err) {
        errorReport(err, 'getTitle in article_list.vue', '/pages/home/article_list');
        return '';
      }
    },
    getDate(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleDateString();
    }
  }
}
</script>
<style scoped>
.container { padding: 30rpx; }
.list-item { padding: 24rpx 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 30rpx; font-weight: bold; }
.date { font-size: 22rpx; color: #888; margin-left: 20rpx; }
</style>
