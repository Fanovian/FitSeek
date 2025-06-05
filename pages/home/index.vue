<!-- pages/home/index.vue -->
<template>  <view class="container">
    <!-- 顶部信息栏 -->
    <view class="top-section">
      <view class="target-info">
        <text class="label">距离目标</text>
        <text class="value">{{ distanceToGoal }}kg</text>
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
    
    <!-- 添加健康记录按钮 -->
    <AddHealthRecordForm @record-added="handleRecordAdded" />

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
import AddHealthRecordForm from '@/pages/home/components/AddHealthRecordForm.vue';
import errorReport from '@/utils/errorReport.js';

export default {  components: {
    WeightCard,
    BodyFatCard,
    TrainingCard,
    BloodOxygenCard,
    HeartRateCard,
    AnnouncementCard,
    ArticleCard,
    AddHealthRecordForm,
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
      height: null, // 动态获取
      targetWeight: null, // 动态获取
      distanceToGoal: '--', // 新增
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
          content: '# 健康饮食小贴士\n\n1. 多吃蔬菜水果\n2. 控制油盐糖摄入\n3. 合理搭配主食和蛋白质\n\n',
          // content: '# 健康饮食小贴士\n\n1. 多吃蔬菜水果\n2. 控制油盐糖摄入\n3. 合理搭配主食和蛋白质\n\n```js\n// 示例代码块\n__f__(\'log\',\'at pages/home/index.vue:161\',\'Eat healthy!\')\n```',
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
  },  methods: {
    // 处理健康记录添加后的刷新
    handleRecordAdded(type) {
      // 根据添加的记录类型刷新对应的数据
      switch(type) {
        case 'weight':
          this.fetchWeightRecords();
          this.fetchCurrentWeightAndBMI();
          break;
        case 'body_fat':
          this.fetchBodyFatRecords();
          break;
        case 'heart_rate':
          this.fetchHeartRateRecords();
          break;
        case 'blood_oxygen':
          this.fetchBloodOxygenRecords();
          break;
      }
    },
    // 获取体重记录
    async fetchWeightRecords() {
      try {
        const token = uni.getStorageSync('jwtToken');
        console.log('Fetching weight records with token:', token);
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: token ? 'Bearer ' + token : ''
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
          this.weightRecords = records.length ? records : this.sampleWeightRecords;
        } else {
          this.weightRecords = this.sampleWeightRecords;
        }
      } catch (e) {
        errorReport(e, 'fetchWeightRecords', '/pages/home/index');
        this.weightRecords = this.sampleWeightRecords;
      }
    },
    // 获取体脂记录
    async fetchBodyFatRecords() {
      try {
        const token = uni.getStorageSync('jwtToken');
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: token ? 'Bearer ' + token : ''
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
          this.bodyFatRecords = records.length ? records : this.sampleBodyFatRecords;
        } else {
          this.bodyFatRecords = this.sampleBodyFatRecords;
        }
      } catch (e) {
        errorReport(e, 'fetchBodyFatRecords', '/pages/home/index');
        this.bodyFatRecords = this.sampleBodyFatRecords;
      }
    },
    // 获取锻炼记录
    async fetchTrainingRecords() {
      try {
        const token = uni.getStorageSync('jwtToken');
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/training/get',
          method: 'GET',
          header: {
            Authorization: token ? 'Bearer ' + token : ''
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
          this.trainingRecords = records.length ? records : this.sampleTrainingRecords;
        } else {
          this.trainingRecords = this.sampleTrainingRecords;
        }
      } catch (e) {
        errorReport(e, 'fetchTrainingRecords', '/pages/home/index');
        this.trainingRecords = this.sampleTrainingRecords;
      }
    },
    // 获取血氧记录
    async fetchBloodOxygenRecords() {
      try {
        const token = uni.getStorageSync('jwtToken');
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: token ? 'Bearer ' + token : ''
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
          this.bloodOxygenRecords = records.length ? records : this.sampleBloodOxygenRecords;
        } else {
          this.bloodOxygenRecords = this.sampleBloodOxygenRecords;
        }
      } catch (e) {
        errorReport(e, 'fetchBloodOxygenRecords', '/pages/home/index');
        this.bloodOxygenRecords = this.sampleBloodOxygenRecords;
      }
    },
    // 获取心率记录
    async fetchHeartRateRecords() {
      try {
        const token = uni.getStorageSync('jwtToken');
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: token ? 'Bearer ' + token : ''
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
          this.heartRateRecords = records.length ? records : this.sampleHeartRateRecords;
        } else {
          this.heartRateRecords = this.sampleHeartRateRecords;
        }
      } catch (e) {
        errorReport(e, 'fetchHeartRateRecords', '/pages/home/index');
        this.heartRateRecords = this.sampleHeartRateRecords;
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
        this.announcementList = (res.data.announcements && res.data.announcements.length) ? res.data.announcements : this.sampleAnnouncementList;
      } catch (e) {
        errorReport(e, 'fetchAnnouncements', '/pages/home/index');
        this.announcementList = this.sampleAnnouncementList;
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
        this.articleList = (res.data.articles && res.data.articles.length) ? res.data.articles : this.sampleArticleList;
      } catch (e) {
        errorReport(e, 'fetchArticles', '/pages/home/index');
        this.articleList = this.sampleArticleList;
      }
    },
    // 获取用户资料（身高和目标体重）
    async fetchProfile() {
      try {
        const token = uni.getStorageSync('jwtToken');
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/profile/get',
          method: 'GET',
          header: {
            Authorization: token ? 'Bearer ' + token : ''
          }
        });
        if (res.data && res.data.success && res.data.profile) {
          this.height = res.data.profile.height;
          this.targetWeight = res.data.profile.weight_goal;
        }
      } catch (e) {
        errorReport(e, 'fetchProfile', '/pages/home/index');
        // 网络异常等可忽略，保留默认
      }
    },
    // 获取最新体重、BMI、距离目标
    async fetchCurrentWeightAndBMI() {
      try {
        const token = uni.getStorageSync('jwtToken');
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/get',
          method: 'GET',
          header: {
            Authorization: token ? 'Bearer ' + token : ''
          }
        });
        if (res.data && res.data.success) {
          // 取最新一条体重记录
          const weightRecord = (res.data.records || []).filter(r => r.type === 'weight')
            .sort((a, b) => new Date(b.time) - new Date(a.time))[0];
          if (weightRecord) {
            this.currentWeight = weightRecord.value;
            if (this.height) {
              this.currentBMI = (weightRecord.value / Math.pow(this.height / 100, 2)).toFixed(1);
            } else {
              this.currentBMI = '--';
            }
            if (this.targetWeight !== null) {
              this.distanceToGoal = (weightRecord.value - this.targetWeight).toFixed(1) + 'kg';
            } else {
              this.distanceToGoal = '--';
            }
          }
        }
      } catch (e) {
        errorReport(e, 'fetchCurrentWeightAndBMI', '/pages/home/index');
        // 网络异常等可忽略
      }
    },
    goToAnnouncementList() {
      try {
        uni.navigateTo({ url: '/pages/home/announcement_list' });
      } catch (e) {
        errorReport(e, 'goToAnnouncementList', '/pages/home/index');
      }
    },
    goToArticleList() {
      try {
        uni.navigateTo({ url: '/pages/home/article_list' });
      } catch (e) {
        errorReport(e, 'goToArticleList', '/pages/home/index');
      }
    },
  },
  async created() {
    try {
      await this.fetchProfile();
      await this.fetchCurrentWeightAndBMI();
      this.fetchWeightRecords();
      this.fetchBodyFatRecords();
      this.fetchTrainingRecords();
      this.fetchBloodOxygenRecords();
      this.fetchHeartRateRecords();
      this.fetchAnnouncements();
      this.fetchArticles();
    } catch (e) {
      errorReport(e, 'created lifecycle', '/pages/home/index');
    }
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
  padding-bottom: 140rpx; /* 为底部按钮留出空间 */
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>