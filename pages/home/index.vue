<!-- pages/home/index.vue -->
<template>
  <view class="container">
    <!-- 顶部信息栏 -->
    <view class="top-section">
      <view class="target-info">
        <text class="label">距离<br>目标</text>
        <text class="value">{{ distanceToGoal }}</text>
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
        <AnnouncementCard :announcements="announcementList" @click="goToAnnouncementList" />
        <ArticleCard :articles="articleList" @click="goToArticleList" />        <!-- 体重记录 -->
        <WeightCard 
          :records="weightRecords"
        />
        <!-- 体脂记录 -->
        <BodyFatCard 
          :records="bodyFatRecords"
        />
        <!-- 血氧记录 -->
        <BloodOxygenCard 
          :records="bloodOxygenRecords" 
        />
        <!-- 心率记录 -->
        <HeartRateCard 
          :records="heartRateRecords" 
        />        <!-- 锻炼记录 -->
        <!-- <TrainingCard 
          :records="trainingRecords"
        /> -->      </view>
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

export default {
  components: {
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
      articleList: [],      currentWeight: '--',
      currentBMI: '--',      height: null, // 动态获取
      targetWeight: null, // 动态获取
      distanceToGoal: '--', // 新增
    };
  },
  methods: {
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
        });        if (res.data && res.data.success) {          // 只取type为weight的记录，按时间倒序
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
              return { 
                id: r.record_id, 
                date: r.time.slice(0, 10), 
                time: r.time,
                value, 
                originalValue: r.value,
                change,
                note: r.note || ''
              };
            });
          this.weightRecords = records;
        } else {
          this.weightRecords = [];
        }
      } catch (e) {
        errorReport(e, 'fetchWeightRecords', '/pages/home/index');
        this.weightRecords = [];
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
        if (res.data && res.data.success) {          // 只取type为body_fat的记录，按时间倒序
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
              }              return { 
                id: r.record_id, 
                date: r.time.slice(0, 10), 
                time: r.time,
                value, 
                originalValue: r.value,
                change,
                note: r.note || ''
              };
            });
          this.bodyFatRecords = records;
        } else {
          this.bodyFatRecords = [];
        }
      } catch (e) {
        errorReport(e, 'fetchBodyFatRecords', '/pages/home/index');
        this.bodyFatRecords = [];
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
          this.trainingRecords = records;
        } else {
          this.trainingRecords = [];
        }
      } catch (e) {
        errorReport(e, 'fetchTrainingRecords', '/pages/home/index');
        this.trainingRecords = [];
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
        if (res.data && res.data.success) {          // 只取type为blood_oxygen的记录，按时间倒序
          const records = (res.data.records || []).filter(r => r.type === 'blood_oxygen')
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r, i, arr) => {
              let change = '';
              if (i < arr.length - 1) {
                const diff = (r.value - arr[i + 1].value).toFixed(1);
                change = (diff > 0 ? '+' : '') + diff + '%';
              } else {
                change = '--';
              }              return {
                id: r.record_id,
                time: r.time.replace('T', ' ').slice(0, 16),
                originalTime: r.time,
                value: r.value.toFixed(1),
                originalValue: r.value,
                change,
                note: r.note || ''
              };
            });
          this.bloodOxygenRecords = records;
        } else {
          this.bloodOxygenRecords = [];
        }
      } catch (e) {
        errorReport(e, 'fetchBloodOxygenRecords', '/pages/home/index');
        this.bloodOxygenRecords = [];
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
        if (res.data && res.data.success) {          // 只取type为heart_rate的记录，按时间倒序
          const records = (res.data.records || []).filter(r => r.type === 'heart_rate')
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r, i, arr) => {
              let change = '';
              if (i < arr.length - 1) {
                const diff = r.value - arr[i + 1].value;
                change = (diff > 0 ? '+' : '') + diff + 'bpm';
              } else {
                change = '--';
              }              return {
                id: r.record_id,
                time: r.time.replace('T', ' ').slice(0, 16),
                originalTime: r.time,
                value: r.value,
                originalValue: r.value,
                change,
                note: r.note || ''
              };
            });
          this.heartRateRecords = records;
        } else {
          this.heartRateRecords = [];
        }
      } catch (e) {
        errorReport(e, 'fetchHeartRateRecords', '/pages/home/index');
        this.heartRateRecords = [];
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
        this.announcementList = (res.data.announcements && res.data.announcements.length) ? res.data.announcements : [];
      } catch (e) {
        errorReport(e, 'fetchAnnouncements', '/pages/home/index');
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
        this.articleList = (res.data.articles && res.data.articles.length) ? res.data.articles : [];
      } catch (e) {
        errorReport(e, 'fetchArticles', '/pages/home/index');
        this.articleList = [];
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
      }    },
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
  background-color: #ffffff;
  position: relative; /* 新增，作为绝对定位的参考 */
  padding: 0;
  margin: 0;
  padding-top: env(safe-area-inset-top); /* 适配手机安全区 */
}

/* 顶部信息栏样式 */
.top-section {
  width: 100vw;
  left: 0;
  right: 0;
  margin: 0;
  padding: 20rpx 0;
  height: 400rpx;
  background-color: #3CB371; /* 使用绿色背景 */
  display: flex;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 0;
  box-shadow: 0 8rpx 32rpx rgba(56,142,60,0.10); /* 柔和阴影 */
  /* 让内容不贴边 */
  overflow: hidden;
  padding-top: env(safe-area-inset-top); /* 安全区适配 */
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  justify-content: center;
  align-items: center;
}

.label {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 1px;
  font-family: inherit;
  line-height: 1.2;
  text-align: center;
  white-space: pre-line;
}
.value {
  font-size: 32px;
  font-weight: bold;
  font-family: inherit;
  text-align: center;
}
.current-weight .weight {
  font-size: 44px;
  font-weight: bold;
  font-family: inherit;
  text-align: center;
}
.current-weight .unit {
  font-size: 18px;
  font-family: inherit;
  text-align: center;
}

.target-info, .bmi-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  color: #ffffff;
  text-align: center;
}
.bmi-info {
  align-items: flex-start;
}
.current-weight {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  text-align: center;
}

/* 添加健康记录按钮样式 */
.add-record-btn-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 320rpx; /* 约80rpx，略高于原来 */
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
  /* 增加阴影和圆角提升悬浮感 */
  box-shadow: 0 8rpx 32rpx rgba(56,142,60,0.12);
  border-radius: 32rpx;
}

/* 数据卡片容器 */
.card-container {
  flex: 1;
  background: linear-gradient(to bottom, #ffffff, #ffffff);
  padding: 20rpx;
  box-sizing: border-box;
  overflow-y: scroll;
  padding-bottom: 0;
  margin-top: 20rpx;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
</style>