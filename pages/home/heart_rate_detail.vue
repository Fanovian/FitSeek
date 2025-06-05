<template>
  <view class="detail-container">
    <view class="chart-container">
      <text>心率变化趋势图表</text>
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
        <text v-if="trend > 0" class="positive">总体趋势：+{{ trend }}bpm</text>
        <text v-else-if="trend < 0" class="negative">总体趋势：{{ trend }}bpm</text>
        <text v-else>总体趋势：无变化</text>
      </view>
      <view class="chart-x-axis">
        <text v-for="(cat, idx) in chartData.categories" :key="idx" class="x-label">{{ cat }}</text>
      </view>
      <view class="chart-y-axis">
        <text>心率(bpm)</text>
      </view>
    </view>    <view class="record-list">
      <view v-for="(item, index) in detailedRecords" :key="index" class="record-item">
        <view class="record-info">
          <text>{{ item.time }} - {{ item.value }}bpm</text>
          <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
            {{ item.change }}
          </text>
        </view>
        <view class="action-buttons">
          <text class="modify-btn" @click="modifyRecord(item)">修改</text>
          <text class="delete-btn" @click="deleteRecord(item.id)">删除</text>      </view>
    </view>
    
    <!-- 修改记录模态框 -->
    <view v-if="showModifyModal" class="modify-modal-mask" @click="closeModifyModal">
      <view class="modify-modal" @click.stop>
        <view class="modal-header">
          <text class="modal-title">修改心率记录</text>
          <text class="modal-close" @click="closeModifyModal">×</text>
        </view>
        
        <view class="modal-content">
          <view class="input-group">
            <text class="input-label">心率(bpm)</text>
            <input 
              type="digit" 
              v-model="modifyForm.value" 
              class="modal-input" 
              placeholder="输入心率" 
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
  </view>
</template>

<script>
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
      const first = parseInt(this.detailedRecords[0].value);
      const last = parseInt(this.detailedRecords[this.detailedRecords.length - 1].value);
      return last - first;
    }
  },
  async created() {
    await this.fetchHeartRateRecords();
    await this.$nextTick();
    this.initChart();
  },
  methods: {
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
          const records = (res.data.records || []).filter(r => r.type === 'heart_rate')
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map((r, i, arr) => {
              let change = '';
              if (i < arr.length - 1) {
                const diff = (r.value - arr[i + 1].value);
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
          this.detailedRecords = records;
        }
      } catch (e) {
        errorReport(e, 'fetchHeartRateRecords', '/pages/home/heart_rate_detail');
      }
    },
    initChart() {
      // 横轴仅显示日期，纵轴为心率
      const categories = this.detailedRecords.map(item => {
        // 只取日期部分（如 '06-04'）
        if (item.time) {
          const d = item.time.split(' ')[0];
          return d.length === 10 ? d.slice(5) : item.time;
        }
        return '';
      });
      const data = this.detailedRecords.map(item => parseInt(item.value) || 0);      this.chartData = {
        categories,
        series: [{ name: '心率', data }]
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
          await this.fetchHeartRateRecords();
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
      this.modifyForm.value = record.originalValue || record.value.toString();
      this.modifyForm.note = record.note || '';
      
      // 处理时间格式
      if (record.originalTime) {
        const dateTime = new Date(record.originalTime);
        this.modifyForm.dateValue = dateTime.toISOString().slice(0, 10);
        this.modifyForm.timeValue = dateTime.toTimeString().slice(0, 5);
        this.modifyForm.time = dateTime.toISOString();
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
        }
          const requestData = {
          record_id: this.modifyingRecord.id,
          type: 'heart_rate',
          value: Number(this.modifyForm.value),
          note: this.modifyForm.note || undefined
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
          await this.fetchHeartRateRecords();
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
        const timeString = this.modifyForm.dateValue + 'T' + this.modifyForm.timeValue + ':00';
        this.modifyForm.time = new Date(timeString).toISOString();
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
  padding: 15rpx 0;
  border-bottom: 1px solid #eee;
}
.positive {
  color: #e53935;
}
.negative {
  color: #1976d2;
}
.chart-x-axis {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: 10rpx;
}
.x-label {
  font-size: 24rpx;
}
.chart-y-axis {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chart-y-axis text {
  margin: 5rpx 0;
}

.record-info {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 10rpx;
}

.modify-btn, .delete-btn {
  padding: 5rpx 15rpx;
  border-radius: 5rpx;
  font-size: 26rpx;
  cursor: pointer;
}

.modify-btn {
  background-color: #007aff;
  color: white;
}

.delete-btn {
  background-color: #ff3b30;
  color: white;
}

/* 修改模态框样式 */
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
