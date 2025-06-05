<!-- pages/training-detail/index.vue -->
<template>
  <view class="detail-container">
    <view class="chart-container">
      <text>锻炼时长变化趋势图表</text>
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
        <text v-if="trend > 0" class="positive">总体趋势：+{{ trend }}分钟</text>
        <text v-else-if="trend < 0" class="negative">总体趋势：{{ trend }}分钟</text>
        <text v-else>总体趋势：无变化</text>
      </view>
      <view class="chart-x-axis">
        <text v-for="(cat, idx) in chartData.categories" :key="idx" class="x-label">{{ cat }}</text>
      </view>
      <view class="chart-y-axis"><!-- 删除纵坐标标识 --></view>
    </view>
    <view class="record-list">
      <view v-for="(item, index) in detailedRecords" :key="index" class="record-item">
        <text>{{ item.date }} - {{ item.duration }}分钟</text>
        <text class="type-label">{{ typeMap[item.type] || '综合训练' }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import QiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue';
import errorReport from '@/utils/errorReport.js';
export default {
  components: { 'qiun-data-charts': QiunDataCharts },
  data() {
    const sysInfo = uni.getSystemInfoSync();
    const screenWidth = sysInfo.windowWidth || 375;
    return {
      detailedRecords: [],
      screenWidth,
      svgHeight: Math.max(160, Math.floor(screenWidth * 0.45)),
      chartData: { categories: [], series: [] },
    };
  },
  computed: {
    trend() {
      if (this.detailedRecords.length < 2) return 0;
      const first = parseInt(this.detailedRecords[0].duration);
      const last = parseInt(this.detailedRecords[this.detailedRecords.length - 1].duration);
      return last - first;
    },
    typeMap() {
      return {
        aerobic: '有氧',
        anaerobic: '无氧',
        streching: '拉伸',
        other: '其他'
      };
    }
  },
  async created() {
    await this.fetchTrainingRecords();
    await this.$nextTick();
    this.initChart();
  },
  methods: {
    async fetchTrainingRecords() {
      try {
        const res = await uni.request({ url: '/api/training/records', method: 'GET' });
        if (res[1] && res[1].data && Array.isArray(res[1].data.records) && res[1].data.records.length) {
          this.detailedRecords = res[1].data.records;
        } else {
          this.detailedRecords = [];
        }
      } catch (e) {
        errorReport(e, 'fetchTrainingRecords', '/pages/home/training_detail');
        this.detailedRecords = [];
      }
    },
    initChart() {
      const categories = this.detailedRecords.map(item => item.date && item.date.length === 10 ? item.date.slice(5) : item.date || '');
      const data = this.detailedRecords.map(item => parseInt(item.duration) || 0);
      this.chartData = {
        categories,
        series: [{ name: '锻炼时长', data }]
      };
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
  gap: 10rpx;
}
.type-label {
  font-size: 22rpx;
  color: #388e3c;
  background: #e8f5e9;
  border-radius: 8rpx;
  padding: 2rpx 10rpx;
  margin-left: 6rpx;
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
  color: #666;
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
</style>