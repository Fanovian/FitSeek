<template>
  <view class="container">
    <view v-for="item in announcementList" :key="item._id" class="list-item" @click="goDetail(item)">
      <text class="title">{{ getTitle(item.content) }}</text>
      <text class="date">{{ item.publish_time.slice(0,10) }}</text>
    </view>
    <view v-if="!announcementList.length" class="list-item"><text>暂无公告</text></view>
  </view>
</template>
<script>
import errorReport from '@/utils/errorReport.js';
export default {
  data() { return { announcementList: [] } },
  onLoad() {
    try {
      uni.request({
        url: 'https://api.fanovian.cc:3000/api/announcement/get',
        method: 'GET',
        header: { 'Content-Type': 'application/json' },
        success: res => {
          this.announcementList = res.data.announcements || [];
          // 若不足2条补充本地示例
          if (this.announcementList.length < 2) {
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
            this.announcementList = this.announcementList.concat(sample.slice(0, 2 - this.announcementList.length));
          }
        },
        fail: err => {
          errorReport(err, 'uni.request fail in announcement_list.vue', '/pages/home/announcement_list');
        }
      })
    } catch (err) {
      errorReport(err, 'onLoad try-catch in announcement_list.vue', '/pages/home/announcement_list');
    }
  },
  methods: {
    goDetail(item) {
      try {
        uni.navigateTo({
          url: '/pages/home/announcement_detail?content=' + encodeURIComponent(item.content)
        })
      } catch (err) {
        errorReport(err, 'goDetail in announcement_list.vue', '/pages/home/announcement_list');
      }
    },
    getTitle(md) {
      try {
        if (!md) return '';
        const firstLine = md.split('\n')[0].replace(/[#*`>\-]/g, '').trim();
        return firstLine.length > 0 ? firstLine.slice(0, 18) : md.slice(0, 18);
      } catch (err) {
        errorReport(err, 'getTitle in announcement_list.vue', '/pages/home/announcement_list');
        return '';
      }
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
