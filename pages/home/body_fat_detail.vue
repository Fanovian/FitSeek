<!-- pages/body-fat-detail/index.vue -->
<!-- 体脂详情页，展示体脂变化趋势图、详细记录列表，并支持记录的修改与删除。 -->
<template>
  <!-- 体脂详情主容器 -->
  <view class="detail-container">
    <!-- 趋势图表区域 -->
    <view class="chart-container">
      <text>体脂变化趋势图表</text>
      <qiun-data-charts
        type="line"
        :opts="{ color: ['#4CAF50'], legend: false, xAxis: { disableGrid: true }, yAxis: { min: null, gridType: 'dash', splitNumber: 4 }, extra: { line: { type: 'curve', width: 3 } } }"
        :chartData="chartData"
        :canvas2d="false"
        :ontouch="false"
        :width="screenWidth"
        :height="svgHeight"
      />
      <view class="trend">
        <text v-if="trend > 0" class="positive">总体趋势：+{{ trend }}%</text>
        <text v-else-if="trend < 0" class="negative">总体趋势：{{ trend }}%</text>
        <text v-else>总体趋势：无变化</text>
      </view>
      <!-- 不再显示纵坐标标识view -->
    </view>    <!-- 记录列表区域 -->
    <view class="record-list">
      <!-- 单条体脂记录，含时间、数值、操作按钮 -->
      <view v-for="(item, index) in detailedRecords" :key="index" class="record-item">
        <view class="record-info">
          <!-- 修正：显示北京时间日期和时间 -->
          <text>{{ getBeijingDate(item.time || item.originalTime || item.date) + " " + getBeijingTime(item.time || item.originalTime || item.date) }}</text>
          <text>{{ item.value || item.duration }}</text>
        </view>
        <view class="action-buttons" style="z-index:1;">
          <button class="modify-btn" @click="modifyRecord(item)">修改</button>
          <button class="delete-btn" @click="deleteRecord(item.id)">删除</button>
        </view>
      </view>
      <!-- 修改记录模态框 -->
      <view v-if="showModifyModal" class="modify-modal-mask" @click="closeModifyModal" style="z-index:1000;">
        <view class="modify-modal" @click.stop>
          <view class="modal-header">
            <text class="modal-title">修改记录</text>
            <text class="modal-close" @click="closeModifyModal">×</text>
          </view>
          <view class="modal-content">
            <!-- 时间选择器放在最上面 -->
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
              <text class="input-label">数值</text>
              <input type="digit" v-model="modifyForm.value" class="modal-input" placeholder="输入数值" />
            </view>
            <view class="input-group">
              <text class="input-label">备注</text>
              <input type="text" v-model="modifyForm.note" class="modal-input" placeholder="备注（可选）" />
            </view>
          </view>
          <view class="modal-footer">
            <button class="modal-btn cancel-btn" @click="closeModifyModal">取消</button>
            <button class="modal-btn confirm-btn" @click="modifyHealthRecord">确认</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// 页面逻辑：支持通过参数或接口获取体脂记录，渲染趋势图，支持记录的增删改，含表单与弹窗交互
import QiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue';
import errorReport from '@/utils/errorReport.js';
export default {
  components: { 'qiun-data-charts': QiunDataCharts },  data() {
    const sysInfo = uni.getSystemInfoSync();
    const screenWidth = sysInfo.windowWidth || 375;
    return {
      detailedRecords: [],
      screenWidth,
      svgHeight: Math.max(160, Math.floor(screenWidth * 0.45)),
      chartData: { categories: [], series: [] },      // 修改记录相关数据
      showModifyModal: false,
      modifyingRecord: null,
      modifyForm: {
        value: '',
        time: '',
        note: '',
        dateValue: '',
        timeValue: ''
      }
    };
  },
  computed: {
    trend() {
      if (this.detailedRecords.length < 2) return 0;
      const first = parseFloat(this.detailedRecords[0].value);
      const last = parseFloat(this.detailedRecords[this.detailedRecords.length - 1].value);
      return (last - first).toFixed(2);
    }
  },
  async created() {
    // 兼容通过页面参数 data 传递的 records
    let records = [];
    if (this.$route && this.$route.query && this.$route.query.data) {
      try {
        records = JSON.parse(decodeURIComponent(this.$route.query.data));
      } catch (e) {
        records = [];
      }
    } else if (this.$mp && this.$mp.query && this.$mp.query.data) {
      try {
        records = JSON.parse(decodeURIComponent(this.$mp.query.data));
      } catch (e) {
        records = [];
      }
    } else if (typeof getCurrentPages === 'function') {
      const pages = getCurrentPages();
      const current = pages[pages.length - 1];
      if (current && current.options && current.options.data) {
        try {
          records = JSON.parse(decodeURIComponent(current.options.data));
        } catch (e) {
          records = [];
        }
      }
    }
    if (records && records.length) {
      this.detailedRecords = records;
      this.initChart();
    } else {
      await this.fetchBodyFatRecords();
      await this.$nextTick();
      this.initChart();
    }
  },
  methods: {
    getBeijingDate(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return beijing.toISOString().slice(0, 10);
    },
    getBeijingTime(isoString) {
      if (!isoString) return '';
      const date = new Date(isoString);
      const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
      return beijing.toISOString().slice(11, 16);
    },
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
          const records = (res.data.records || []).filter(r => r.type === 'body_fat')
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
                date: r.time.slice(0, 10),
                value: r.value.toFixed(1),
                originalValue: r.value,
                change,
                note: r.note || '',
                originalTime: r.time
              };
            });
          this.detailedRecords = records;
        } else {
          this.detailedRecords = [];
        }
      } catch (e) {
        errorReport(e, 'fetchBodyFatRecords', '/pages/home/body_fat_detail');
        this.detailedRecords = [];
      }
    },
    initChart() {
      // 横坐标（categories）按时间升序排列
      const sortedRecords = [...this.detailedRecords].sort((a, b) => {
        const dateA = new Date(a.date || a.time);
        const dateB = new Date(b.date || b.time);
        return dateA - dateB;
      });
      const categories = sortedRecords.map(item => item.date && item.date.length === 10 ? item.date.slice(5) : (item.date || ''));
      const data = sortedRecords.map(item => parseFloat(item.value || 0));
      this.chartData = {
        categories,
        series: [{ name: '体脂率', data }]
      };
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
          
          // 刷新数据
          await this.fetchBodyFatRecords();
          this.initChart();
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
      }
    },
    
    // 处理删除记录事件
    deleteRecord(recordId) {
      uni.showModal({
        title: '确认删除',
        content: '是否确定删除此条记录？',
        success: (res) => {
          if (res.confirm) {
            this.deleteHealthRecord(recordId);
          }
        }
      });
    },
      // 处理修改记录事件
    modifyRecord(record) {
      this.modifyingRecord = record;
      // 修正：兼容 originalTime 和 date 字段，保证时间赋值正确
      const timeStr = record.originalTime || record.date || '';
      let dateValue = '', timeValue = '';
      if (timeStr) {
        const dateObj = new Date(timeStr);
        dateValue = dateObj.toISOString().slice(0, 10);
        timeValue = dateObj.toTimeString().slice(0, 5);
      }
      this.modifyForm = {
        value: record.originalValue || record.value.toString().replace(/[^\d.]/g, ''),
        time: timeStr,
        note: record.note || '',
        dateValue,
        timeValue
      };
      this.showModifyModal = true;
    },

    // 修改健康记录API
    async modifyHealthRecord() {
      // 修正：确保 time 字段拼接并传递给后端
      if (!this.modifyForm.value || !this.modifyForm.dateValue || !this.modifyForm.timeValue) {
        uni.showToast({ title: '请填写完整信息', icon: 'none' });
        return;
      }
      this.updateModifyTime();
      try {
        const token = uni.getStorageSync('jwtToken');
        if (!token) {
          uni.showToast({ title: '请先登录', icon: 'none' });
          return;
        }
        const requestData = {
          record_id: this.modifyingRecord.id,
          type: 'body_fat',
          value: Number(this.modifyForm.value),
          note: this.modifyForm.note || undefined,
          time: this.modifyForm.time // 修正：加上时间字段
        };
        const res = await uni.request({
          url: 'https://api.fanovian.cc:3000/api/fitness/modify',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          data: requestData
        });
        
        if (res.data && res.data.success) {
          uni.showToast({
            title: '修改成功',
            icon: 'success'
          });
          
          this.closeModifyModal();
          
          // 刷新数据
          await this.fetchBodyFatRecords();
          this.initChart();
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
      }
    },
      // 关闭修改模态框
    closeModifyModal() {
      this.showModifyModal = false;
      this.modifyingRecord = null;
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
    },
    
    // 更新修改表单时间
    updateModifyTime() {
      if (this.modifyForm.dateValue && this.modifyForm.timeValue) {
        this.modifyForm.time = this.modifyForm.dateValue + 'T' + this.modifyForm.timeValue + ':00+08:00';
      } else {
        this.modifyForm.time = '';
      }
    }
  }
};
</script>

<style scoped>
.detail-container {
  padding: 16rpx;
  padding-top: env(safe-area-inset-top);
}
.chart-container {
  min-height: 320rpx;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
}
.trend {
  margin-top: 10rpx;
  font-size: 28rpx;
}
.record-list {
  flex: 1;
}
.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1px solid #eee;
}

.record-info {
  display: flex;
  justify-content: space-between;
  flex: 1;
  margin-right: 10rpx;
}

.action-buttons {
  display: flex;
  gap: 12rpx;
}

.modify-btn {
  color: #1976d2;
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  border: 1px solid #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
  transition: all 0.2s;
}

.delete-btn {
  color: #ff4757;
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  border: 1px solid #ff4757;
  background-color: rgba(255, 71, 87, 0.1);
  transition: all 0.2s;
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

.positive {
  color: #4CAF50;
}
.negative {
  color: #F44336;
}
.chart-x-axis {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10rpx;
}
.x-label {
  font-size: 24rpx;
}
</style>