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
          @delete="handleDeleteRecord"
          @modify="handleModifyRecord"
        />
        <!-- 体脂记录 -->
        <BodyFatCard 
          :records="bodyFatRecords"
          @delete="handleDeleteRecord"
          @modify="handleModifyRecord"
        />
        <!-- 血氧记录 -->
        <BloodOxygenCard 
          :records="bloodOxygenRecords" 
          @delete="handleDeleteRecord"
          @modify="handleModifyRecord"
        />
        <!-- 心率记录 -->
        <HeartRateCard 
          :records="heartRateRecords" 
          @delete="handleDeleteRecord"
          @modify="handleModifyRecord"
        />

        <!-- 锻炼记录 -->
        <!-- <TrainingCard 
          :records="trainingRecords"
        /> -->      </view>
    </scroll-view>
    
    <!-- 修改记录模态框 -->
    <view v-if="showModifyModal" class="modify-modal-mask" @click="closeModifyModal">
      <view class="modify-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">修改记录</text>
          <text class="modal-close" @click="closeModifyModal">×</text>
        </view>
        
        <view class="modal-content">
          <view class="input-group">
            <text class="input-label">数值</text>
            <input 
              type="digit" 
              v-model="modifyForm.value" 
              class="modal-input" 
              placeholder="输入数值" 
            />
          </view>
          
          <view class="input-group">
            <text class="input-label">日期</text>
            <picker mode="date" :value="modifyForm.dateValue" @change="onModifyDateChange">
              <view class="picker-display">
                {{ modifyForm.dateValue || '选择日期' }}
              </view>
            </picker>
          </view>
          
          <view class="input-group">
            <text class="input-label">时间</text>
            <picker mode="time" :value="modifyForm.timeValue" @change="onModifyTimeChange">
              <view class="picker-display">
                {{ modifyForm.timeValue || '选择时间' }}
              </view>
            </picker>
          </view>
          
          <view class="input-group">
            <text class="input-label">备注</text>
            <input 
              type="text" 
              v-model="modifyForm.note" 
              class="modal-input" 
              placeholder="备注（可选）" 
            />
          </view>
        </view>
        
        <view class="modal-footer">
          <button class="modal-btn cancel-btn" @click="closeModifyModal">取消</button>
          <button class="modal-btn confirm-btn" @click="modifyHealthRecord">确认</button>
        </view>
      </view>
    </view>
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
      articleList: [],
      currentWeight: '--',
      currentBMI: '--',      height: null, // 动态获取
      targetWeight: null, // 动态获取
      distanceToGoal: '--', // 新增
      // 修改记录相关数据
      showModifyModal: false,
      modifyRecord: null,
      modifyForm: {
        value: '',
        time: '',
        note: '',
        dateValue: '',
        timeValue: ''
      }
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
      }
    },
    // 删除健康记录
    async deleteHealthRecord(recordId) {
      try {
        const token = uni.getStorageSync('jwtToken');
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/delete',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          data: {
            record_id: recordId
          }
        });
        
        if (res.data && res.data.success) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          });
          
          // 刷新相关数据
          await this.fetchWeightRecords();
          await this.fetchBodyFatRecords();
          await this.fetchBloodOxygenRecords();
          await this.fetchHeartRateRecords();
          await this.fetchCurrentWeightAndBMI();
        } else {
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('删除健康记录失败:', error);
        uni.showToast({
          title: '删除失败，请重试',
          icon: 'none'
        });
        errorReport(error, 'deleteHealthRecord', '/pages/home/index');
      }
    },    // 处理删除记录事件
    handleDeleteRecord(recordId) {
      uni.showModal({
        title: '确认删除',
        content: '是否确定删除此条记录？',
        success: (res) => {
          if (res.confirm) {
            this.deleteHealthRecord(recordId);
          }
        }
      });
    },    // 处理修改记录事件
    handleModifyRecord(record) {
      console.log('修改记录:', record);
      this.modifyRecord = record;
      
      // 确定记录类型
      let recordType = '';
      if (this.weightRecords.some(r => r.id === record.id)) {
        recordType = 'weight';
      } else if (this.bodyFatRecords.some(r => r.id === record.id)) {
        recordType = 'body_fat';
      } else if (this.heartRateRecords.some(r => r.id === record.id)) {
        recordType = 'heart_rate';
      } else if (this.bloodOxygenRecords.some(r => r.id === record.id)) {
        recordType = 'blood_oxygen';
      }
      
      // 保存记录类型
      this.modifyRecord.type = recordType;
      
      // 初始化修改表单数据
      this.modifyForm.value = record.originalValue || record.value.toString().replace(/[^\d.]/g, '');
      this.modifyForm.note = record.note || '';
      
      // 处理时间格式
      if (record.time) {
        const dateTime = new Date(record.time);
        this.modifyForm.dateValue = dateTime.toISOString().slice(0, 10);
        this.modifyForm.timeValue = dateTime.toTimeString().slice(0, 5);
        this.modifyForm.time = dateTime.toISOString();
      } else if (record.date) {
        this.modifyForm.dateValue = record.date;
        this.modifyForm.timeValue = '12:00';
        this.modifyForm.time = new Date(record.date + 'T12:00:00').toISOString();
      }
      
      this.showModifyModal = true;
    },
    // 修改健康记录API
    async modifyHealthRecord() {
      try {
        const token = uni.getStorageSync('jwtToken');
        if (!token) {
          uni.showToast({ title: '请先登录', icon: 'none' });
          return;
        }        const requestData = {
          record_id: this.modifyRecord.id,
          type: this.modifyRecord.type,
          value: Number(this.modifyForm.value),
          note: this.modifyForm.note || undefined
        };
        
        console.log('修改健康记录请求数据:', requestData);
        
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/modify',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          data: requestData
        });
        
        console.log('修改健康记录响应数据:', res.data);
        
        if (res.data && res.data.success) {
          uni.showToast({
            title: '修改成功',
            icon: 'success'
          });
          
          this.closeModifyModal();
          
          // 刷新相关数据
          await this.fetchWeightRecords();
          await this.fetchBodyFatRecords();
          await this.fetchBloodOxygenRecords();
          await this.fetchHeartRateRecords();
          await this.fetchCurrentWeightAndBMI();
        } else {
          uni.showToast({
            title: res.data?.message || '修改失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('修改健康记录失败:', error);
        uni.showToast({
          title: '修改失败，请重试',
          icon: 'none'
        });
        errorReport(error, 'modifyHealthRecord', '/pages/home/index');
      }
    },
    // 关闭修改模态框
    closeModifyModal() {
      this.showModifyModal = false;
      this.modifyRecord = null;
      this.modifyForm = {
        value: '',
        time: '',
        note: '',
        dateValue: '',
        timeValue: ''
      };
    },
    // 修改表单日期变化
    onModifyDateChange(e) {
      this.modifyForm.dateValue = e.detail.value;
      this.updateModifyTime();
    },
    // 修改表单时间变化
    onModifyTimeChange(e) {
      this.modifyForm.timeValue = e.detail.value;
      this.updateModifyTime();
    },    // 更新修改表单时间
    updateModifyTime() {
      if (this.modifyForm.dateValue && this.modifyForm.timeValue) {
        // 构造完整的时间字符串并转换为ISO 8601格式
        const timeString = this.modifyForm.dateValue + 'T' + this.modifyForm.timeValue + ':00';
        this.modifyForm.time = new Date(timeString).toISOString();
      } else {
        this.modifyForm.time = '';
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

/* 修改记录模态框样式 */
.modify-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;
}

.modify-modal {
  background-color: #ffffff;
  border-radius: 16rpx;
  width: 100%;
  max-width: 600rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.modal-close {
  font-size: 48rpx;
  color: #999;
  line-height: 1;
}

.modal-content {
  padding: 32rpx;
}

.input-group {
  margin-bottom: 24rpx;
}

.input-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 12rpx;
}

.modal-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.picker-display {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  color: #333;
  box-sizing: border-box;
}

.modal-footer {
  display: flex;
  gap: 16rpx;
  padding: 32rpx;
  border-top: 1px solid #eee;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  border: none;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #666;
}

.confirm-btn {
  background-color: #3CB371;
  color: #ffffff;
}
</style>