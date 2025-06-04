<template>
  <view class="card announcement-card" @click="$emit('click')">
    <view class="card-title">公告</view>
    <view class="card-content">
      <view v-if="announcements && announcements.length" v-for="item in previewList" :key="item._id" class="record-line">
        <text>{{ getTitle(item.content) }}</text>
        <text class="date">{{ item.publish_time.slice(0,10) }}</text>
      </view>
      <view v-else class="record-line"><text>暂无公告</text></view>
    </view>
  </view>
</template>
<script>
export default {
  props: { announcements: Array },
  computed: {
    previewList() {
      // 优先展示最新2条，若不足2条则补充本地示例
      let arr = (this.announcements || []).slice(0, 2);
      if (arr.length < 2) {
        const today = new Date();
        const sample = [
          {
            _id: 'sample1',
            publisher_name: 'fitseek-admin',
            content: '# 端午节放假通知\n\n亲爱的用户：\n\n端午节将至，FitSeek团队祝大家节日安康！6月8日至6月10日平台服务正常，欢迎随时记录健康数据。',
            publish_time: today.getFullYear() + '-06-03T09:07:36.862Z'
          },
          {
            _id: 'sample2',
            publisher_name: 'fitseek-admin',
            content: '## 新功能上线\n\n- 支持心率、血氧趋势图\n- 训练记录可选类型\n- 文章/公告支持Markdown格式',
            publish_time: today.getFullYear() + '-05-28T10:12:00.000Z'
          }
        ];
        arr = arr.concat(sample.slice(0, 2 - arr.length));
      }
      return arr;
    }
  },
  methods: {
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
.card { width: 100%; border-radius: 16px; padding: 20rpx; box-sizing: border-box; background-color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom: 0; }
.announcement-card { border-left: 4px solid #1976d2; }
.card-title { font-weight: bold; margin-bottom: 10rpx; color: #1976d2; }
.card-content { width: 100%; display: flex; flex-direction: column; gap: 8rpx; }
.record-line { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.date { color: #888; font-size: 22rpx; margin-left: 10rpx; }
</style>
