<!-- pages/home/index.vue -->
<template>
  <view class="container">
    <!-- 顶部信息栏 -->
    <view class="top-section">
      <view class="target-info">
        <text class="label">距离目标</text>
        <text class="value">5.2kg</text>
      </view>
      
      <view class="current-weight">
        <text class="weight">{{ currentWeight }}</text>
        <text class="unit">(目标:{{ targetWeight }})</text>
      </view>
      
      <view class="bmi-info">
        <text class="label">BMI</text>
        <text class="value">{{ currentBMI }}</text>
      </view>
    </view>

    <!-- 数据卡片容器 -->
    <scroll-view 
      scroll-y 
      class="card-container"
      :scroll-with-animation="true"
    >
      <view class="card-list">
        <!-- 公告和文章卡片 -->
        <AnnouncementCard :announcements="announcementList.length ? announcementList : sampleAnnouncementList" @click="goToAnnouncementList" />
        <ArticleCard :articles="articleList.length ? articleList : sampleArticleList" @click="goToArticleList" />
        <!-- 血氧记录 -->
        <BloodOxygenCard :records="bloodOxygenRecords.length ? bloodOxygenRecords : sampleBloodOxygenRecords" />
        <!-- 心率记录 -->
        <HeartRateCard :records="heartRateRecords.length ? heartRateRecords : sampleHeartRateRecords" />
        <!-- 体重记录 -->
        <WeightCard 
          :records="weightRecords.length ? weightRecords : sampleWeightRecords"
        />
        <!-- 体脂记录 -->
        <BodyFatCard 
          :records="bodyFatRecords.length ? bodyFatRecords : sampleBodyFatRecords"
        />
        <!-- 锻炼记录 -->
        <TrainingCard 
          :records="trainingRecords.length ? trainingRecords : sampleTrainingRecords"
        />

      </view>
    </scroll-view>
  </view>
</template>

<script>
import WeightCard from '@/pages/home/components/WeightCard.vue';
import BodyFatCard from '@/pages/home/components/BodyFatCard.vue';
import TrainingCard from '@/pages/home/components/TrainingCard.vue';
import BloodOxygenCard from '@/pages/home/components/BloodOxygenCard.vue';
import HeartRateCard from '@/pages/home/components/HeartRateCard.vue';
import AnnouncementCard from '@/pages/home/components/AnnouncementCard.vue';
import ArticleCard from '@/pages/home/components/ArticleCard.vue';

export default {
  components: {
    WeightCard,
    BodyFatCard,
    TrainingCard,
    BloodOxygenCard,
    HeartRateCard,
    AnnouncementCard,
    ArticleCard,
  },
  data() {
    return {
      weightRecords: [],
      bodyFatRecords: [],
      trainingRecords: [],
      bloodOxygenRecords: [],
      heartRateRecords: [],
      announcementList: [],
      articleList: [],
      // 示例数据
      sampleWeightRecords: [
        { date: '2023-09-09', value: '64.8kg', change: '-0.2kg' },
        { date: '2023-09-08', value: '65.0kg', change: '+0.3kg' },
        { date: '2023-09-07', value: '64.7kg', change: '-0.2kg' },
        { date: '2023-09-06', value: '64.9kg', change: '+0.3kg' },
        { date: '2023-09-05', value: '64.6kg', change: '-0.2kg' },
        { date: '2023-09-04', value: '64.8kg', change: '+0.3kg' },
        { date: '2023-09-03', value: '64.5kg', change: '-0.2kg' },
        { date: '2023-09-02', value: '64.7kg', change: '-0.3kg' },
        { date: '2023-09-01', value: '65.0kg', change: '+0.3kg' },
      ],
      sampleBodyFatRecords: [
        { date: '2023-09-09', value: '22.1%', change: '-0.1%' },
        { date: '2023-09-08', value: '22.2%', change: '+0.2%' },
        { date: '2023-09-07', value: '22.0%', change: '-0.3%' },
        { date: '2023-09-06', value: '22.3%', change: '+0.2%' },
        { date: '2023-09-05', value: '22.1%', change: '-0.1%' },
        { date: '2023-09-04', value: '22.2%', change: '+0.2%' },
        { date: '2023-09-03', value: '22.0%', change: '-0.3%' },
        { date: '2023-09-02', value: '22.3%', change: '+0.2%' },
        { date: '2023-09-01', value: '22.1%', change: '-0.5%' },
      ],
      sampleTrainingRecords: [
        { date: '2023-09-09', duration: '80min', change: '+5min', type: 'aerobic' },
        { date: '2023-09-08', duration: '75min', change: '+5min', type: 'anaerobic' },
        { date: '2023-09-07', duration: '70min', change: '+5min', type: 'streching' },
        { date: '2023-09-06', duration: '65min', change: '+5min', type: 'other' },
        { date: '2023-09-05', duration: '60min', change: '+5min', type: 'aerobic' },
        { date: '2023-09-04', duration: '55min', change: '+5min', type: 'anaerobic' },
        { date: '2023-09-03', duration: '50min', change: '+10min', type: 'streching' },
        { date: '2023-09-02', duration: '40min', change: '-5min', type: 'other' },
        { date: '2023-09-01', duration: '45min', change: '+5min', type: 'aerobic' },
      ],
      sampleBloodOxygenRecords: [
        { time: '2025-06-04 09:00', value: '98.2', change: '+0.2%' },
        { time: '2025-06-04 08:00', value: '98.0', change: '+0.1%' },
        { time: '2025-06-04 07:00', value: '97.9', change: '-0.1%' },
        { time: '2025-06-04 06:00', value: '98.0', change: '+0.2%' },
        { time: '2025-06-04 05:00', value: '97.8', change: '-0.2%' },
        { time: '2025-06-04 04:00', value: '98.0', change: '+0.1%' },
        { time: '2025-06-04 03:00', value: '97.9', change: '-0.1%' },
        { time: '2025-06-04 02:00', value: '98.0', change: '+0.1%' },
        { time: '2025-06-04 01:00', value: '97.9', change: '-0.1%' },
      ],
      sampleHeartRateRecords: [
        { time: '2025-06-04 09:00', value: '72', change: '+2bpm' },
        { time: '2025-06-04 08:00', value: '70', change: '+1bpm' },
        { time: '2025-06-04 07:00', value: '69', change: '-1bpm' },
        { time: '2025-06-04 06:00', value: '70', change: '+2bpm' },
        { time: '2025-06-04 05:00', value: '68', change: '-2bpm' },
        { time: '2025-06-04 04:00', value: '70', change: '+1bpm' },
        { time: '2025-06-04 03:00', value: '69', change: '-1bpm' },
        { time: '2025-06-04 02:00', value: '70', change: '+1bpm' },
        { time: '2025-06-04 01:00', value: '69', change: '-1bpm' },
      ],
      currentWeight: '--',
      currentBMI: '--',
      height: 170, // cm，后续可动态获取
      targetWeight: 60, // 目标体重，后续可动态获取
      sampleAnnouncementList: [
        {
          _id: '1',
          publisher_name: 'fitseek-admin',
          content: '# 端午节放假通知\n\n亲爱的用户：\n\n端午节将至，FitSeek团队祝大家节日安康！6月8日至6月10日平台服务正常，欢迎随时记录健康数据。',
          publish_time: '2025-06-03T09:07:36.862Z'
        },
        {
          _id: '2',
          publisher_name: 'fitseek-admin',
          content: '## 新功能上线\n\n- 支持心率、血氧趋势图\n- 训练记录可选类型\n- 文章/公告支持Markdown格式',
          publish_time: '2025-05-28T10:12:00.000Z'
        }
      ],
      sampleArticleList: [
        {
          _id: 'a1',
          publisher_name: 'fitseek-admin',
          content: '# 健康饮食小贴士\n\n1. 多吃蔬菜水果\n2. 控制油盐糖摄入\n3. 合理搭配主食和蛋白质\n\n```js\n// 示例代码块\nconsole.log(\'Eat healthy!\')\n```',
          publish_time: '2025-06-01T08:44:58.455Z'
        },
        {
          _id: 'a2',
          publisher_name: 'fitseek-admin',
          content: '## 科学锻炼建议\n\n- 每周至少150分钟有氧运动\n- 力量训练每周2次\n- 运动前后注意拉伸',
          publish_time: '2025-05-25T15:30:00.000Z'
        }
      ],
    };
  },
  methods: {
    // 获取体重记录
    async fetchWeightRecords() {
      try {
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: 'Bearer ' + (uni.getStorageSync('jwtToken') || '')
          }
        });
        if (res.data && res.data.success) {
          // 只取type为weight的记录，按时间倒序
          const records = (res.data.records || []).filter(r => r.type === 'weight')
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r, i, arr) => {
              const value = r.value + 'kg';
              let change = '';
              if (i < arr.length - 1) {
                const diff = (r.value - arr[i + 1].value).toFixed(1);
                change = (diff > 0 ? '+' : '') + diff + 'kg';
              } else {
                change = '--';
              }
              return { date: r.time.slice(0, 10), value, change };
            });
          this.weightRecords = records;
        }
      } catch (e) {
        // 网络异常等可忽略，保留示例数据
      }
    },
    // 获取体脂记录
    async fetchBodyFatRecords() {
      try {
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: 'Bearer ' + (uni.getStorageSync('jwtToken') || '')
          }
        });
        if (res.data && res.data.success) {
          // 只取type为body_fat的记录，按时间倒序
          const records = (res.data.records || []).filter(r => r.type === 'body_fat')
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r, i, arr) => {
              const value = r.value + '%';
              let change = '';
              if (i < arr.length - 1) {
                const diff = (r.value - arr[i + 1].value).toFixed(1);
                change = (diff > 0 ? '+' : '') + diff + '%';
              } else {
                change = '--';
              }
              return { date: r.time.slice(0, 10), value, change };
            });
          this.bodyFatRecords = records;
        }
      } catch (e) {
        // 网络异常等可忽略，保留示例数据
      }
    },
    // 获取锻炼记录
    async fetchTrainingRecords() {
      try {
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/training/get',
          method: 'GET',
          header: {
            Authorization: 'Bearer ' + (uni.getStorageSync('jwtToken') || '')
          }
        });
        if (res.data && res.data.success) {
          // 按时间倒序
          const records = (res.data.records || []).sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r, i, arr) => {
              const duration = r.duration + 'min';
              let change = '';
              if (i < arr.length - 1) {
                const diff = r.duration - arr[i + 1].duration;
                change = (diff > 0 ? '+' : '') + diff + 'min';
              } else {
                change = '--';
              }
              return {
                date: r.time.slice(0, 10),
                duration,
                change,
                type: r.train_type || 'other',
                content: r.content || ''
              };
            });
          this.trainingRecords = records;
        }
      } catch (e) {
        // 网络异常等可忽略，保留示例数据
      }
    },
    // 获取血氧记录
    async fetchBloodOxygenRecords() {
      try {
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: 'Bearer ' + (uni.getStorageSync('jwtToken') || '')
          }
        });
        if (res.data && res.data.success) {
          // 只取type为blood_oxygen的记录，按时间倒序
          const records = (res.data.records || []).filter(r => r.type === 'blood_oxygen')
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r, i, arr) => {
              let change = '';
              if (i < arr.length - 1) {
                const diff = (r.value - arr[i + 1].value).toFixed(1);
                change = (diff > 0 ? '+' : '') + diff + '%';
              } else {
                change = '--';
              }
              return {
                time: r.time.replace('T', ' ').slice(0, 16),
                value: r.value.toFixed(1),
                change
              };
            });
          this.bloodOxygenRecords = records;
        }
      } catch (e) {
        // 网络异常等可忽略，保留示例数据
      }
    },
    // 获取心率记录
    async fetchHeartRateRecords() {
      try {
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: 'Bearer ' + (uni.getStorageSync('jwtToken') || '')
          }
        });
        if (res.data && res.data.success) {
          // 只取type为heart_rate的记录，按时间倒序
          const records = (res.data.records || []).filter(r => r.type === 'heart_rate')
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r, i, arr) => {
              let change = '';
              if (i < arr.length - 1) {
                const diff = r.value - arr[i + 1].value;
                change = (diff > 0 ? '+' : '') + diff + 'bpm';
              } else {
                change = '--';
              }
              return {
                time: r.time.replace('T', ' ').slice(0, 16),
                value: r.value,
                change
              };
            });
          this.heartRateRecords = records;
        }
      } catch (e) {
        // 网络异常等可忽略，保留示例数据
      }
    },
    // 获取公告
    async fetchAnnouncements() {
      try {
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/announcement/get',
          method: 'GET',
          header: { 'Content-Type': 'application/json' }
        });
        this.announcementList = res.data.announcements || [];
      } catch (e) {
        this.announcementList = [];
      }
    },
    // 获取文章
    async fetchArticles() {
      try {
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/article/get',
          method: 'GET',
          header: { 'Content-Type': 'application/json' }
        });
        this.articleList = res.data.articles || [];
      } catch (e) {
        this.articleList = [];
      }
    },
    // 获取最新体重和BMI
    async fetchCurrentWeightAndBMI() {
      try {
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: 'Bearer ' + (uni.getStorageSync('jwtToken') || '')
          }
        });
        if (res.data && res.data.success) {
          // 取最新一条体重记录
          const weightRecord = (res.data.records || []).filter(r => r.type === 'weight')
            .sort((a, b) => new Date(b.time) - new Date(a.time))[0];
          if (weightRecord) {
            this.currentWeight = weightRecord.value;
            // BMI = 体重(kg) / (身高(m)^2)
            this.currentBMI = (weightRecord.value / Math.pow(this.height / 100, 2)).toFixed(1);
          }
        }
      } catch (e) {
        // 网络异常等可忽略
      }
    },
    goToAnnouncementList() {
      uni.navigateTo({ url: '/pages/home/announcement_list' });
    },
    goToArticleList() {
      uni.navigateTo({ url: '/pages/home/article_list' });
    },
  },
  created() {
    this.fetchWeightRecords();
    this.fetchBodyFatRecords();
    this.fetchTrainingRecords();
    this.fetchBloodOxygenRecords();
    this.fetchHeartRateRecords();
    this.fetchAnnouncements();
    this.fetchArticles();
    this.fetchCurrentWeightAndBMI();
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* 移除 overflow 和 padding，避免影响 sticky */
  background-color: #f5f5f5;
}

/* 顶部信息栏样式 */
.top-section {
  height: 400rpx;
  background-color: #ffffff;
  display: flex;
  padding: 20rpx;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 10;
}

.target-info, .bmi-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #388e3c;
}

.current-weight {
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #388e3c;
}

.weight {
  font-size: 48px;
  font-weight: bold;
}

.unit {
  font-size: 24px;
  margin-left: 10px;
}

/* 数据卡片容器 */
.card-container {
  flex: 1;
  background: linear-gradient(to bottom, #ffffff, #ffffff);
  padding: 20rpx; /* 移到这里 */
  box-sizing: border-box;
  overflow-y: scroll;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>