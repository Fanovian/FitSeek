<template>
  <view class="detail-container">
    <view class="chart-container">
      <text>血氧变化趋势图表</text>
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
      <view class="chart-x-axis">
        <text v-for="(cat, idx) in chartData.categories" :key="idx" class="x-label">{{ cat }}</text>
      </view>
      <view class="chart-y-axis">
        <text>血氧(%)</text>
      </view>
    </view>
    <view class="record-list">
      <view v-for="(item, index) in detailedRecords" :key="index" class="record-item">
        <text>{{ item.time }} - {{ item.value }}%</text>
        <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
          {{ item.change }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
import QiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue';
export default {
  components: { 'qiun-data-charts': QiunDataCharts },
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    const sysInfo = uni.getSystemInfoSync();
    const screenWidth = sysInfo.windowWidth || 375;
    return {
      detailedRecords: [],
      screenWidth,
      svgHeight: Math.max(160, Math.floor(screenWidth * 0.45)),
      chartData: { categories: [], series: [] },
      chartOpts: {
        color: ['#1976d2'],
        padding: [15, 10, 0, 10],
        enableScroll: true,
        legend: false,
        xAxis: { disableGrid: true },
        yAxis: { min: null, gridType: 'dash', splitNumber: 4 },
        extra: { line: { type: 'curve', width: 3, activeType: 'hollow' } }
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
    if (this.data) {
      this.detailedRecords = JSON.parse(decodeURIComponent(this.data));
    } else {
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
          this.detailedRecords = records.length ? records : [
            { time: '2025-06-04 09:00', value: '98.2', change: '+0.2%' },
            { time: '2025-06-04 08:00', value: '98.0', change: '+0.1%' },
            { time: '2025-06-04 07:00', value: '97.9', change: '-0.1%' },
            { time: '2025-06-04 06:00', value: '98.0', change: '+0.2%' },
            { time: '2025-06-04 05:00', value: '97.8', change: '-0.2%' },
            { time: '2025-06-04 04:00', value: '98.0', change: '+0.1%' },
            { time: '2025-06-04 03:00', value: '97.9', change: '-0.1%' },
            { time: '2025-06-04 02:00', value: '98.0', change: '+0.1%' },
            { time: '2025-06-04 01:00', value: '97.9', change: '-0.1%' },
          ];
        } else {
          this.detailedRecords = [
            { time: '2025-06-04 09:00', value: '98.2', change: '+0.2%' },
            { time: '2025-06-04 08:00', value: '98.0', change: '+0.1%' },
            { time: '2025-06-04 07:00', value: '97.9', change: '-0.1%' },
            { time: '2025-06-04 06:00', value: '98.0', change: '+0.2%' },
            { time: '2025-06-04 05:00', value: '97.8', change: '-0.2%' },
            { time: '2025-06-04 04:00', value: '98.0', change: '+0.1%' },
            { time: '2025-06-04 03:00', value: '97.9', change: '-0.1%' },
            { time: '2025-06-04 02:00', value: '98.0', change: '+0.1%' },
            { time: '2025-06-04 01:00', value: '97.9', change: '-0.1%' },
          ];
        }
      } catch (e) {
        this.detailedRecords = [
          { time: '2025-06-04 09:00', value: '98.2', change: '+0.2%' },
          { time: '2025-06-04 08:00', value: '98.0', change: '+0.1%' },
          { time: '2025-06-04 07:00', value: '97.9', change: '-0.1%' },
          { time: '2025-06-04 06:00', value: '98.0', change: '+0.2%' },
          { time: '2025-06-04 05:00', value: '97.8', change: '-0.2%' },
          { time: '2025-06-04 04:00', value: '98.0', change: '+0.1%' },
          { time: '2025-06-04 03:00', value: '97.9', change: '-0.1%' },
          { time: '2025-06-04 02:00', value: '98.0', change: '+0.1%' },
          { time: '2025-06-04 01:00', value: '97.9', change: '-0.1%' },
        ];
      }
    }
    await this.$nextTick();
    this.initChart();
  },
  methods: {
    initChart() {
      // 横轴仅显示日期，纵轴为血氧
      const categories = this.detailedRecords.map(item => {
        if (item.time) {
          const d = item.time.split(' ')[0];
          return d.length === 10 ? d.slice(5) : item.time;
        }
        return '';
      });
      const data = this.detailedRecords.map(item => parseFloat(item.value) || 0);
      this.chartData = {
        categories,
        series: [{ name: '血氧', data }]
      };
    }
  }
};
</script>

<style scoped>
.detail-container {
  padding: 16rpx;
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
  color: #1976d2;
}
.negative {
  color: #F44336;
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
</style>
