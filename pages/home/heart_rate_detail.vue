<template>
  <view class="detail-container">
    <view class="chart-container">
      <text>心率变化趋势图表</text>
      <scroll-view scroll-x class="simple-line-chart-scroll">
        <view
          class="simple-line-chart"
          :style="{ width: svgScrollWidth + 'px', height: svgHeight + 'px' }"
        >
          <svg
            v-if="chartPoints.length > 1"
            :width="svgScrollWidth"
            :height="svgHeight"
          >
            <polyline
              :points="chartPointsStr"
              fill="none"
              stroke="#e53935"
              stroke-width="3"
            />
            <circle
              v-for="(pt, idx) in chartPoints"
              :key="idx"
              :cx="pt[0]"
              :cy="pt[1]"
              r="5"
              fill="#e53935"
            />
          </svg>
          <view v-else style="color: #aaa; text-align: center; padding: 30rpx;">暂无足够数据</view>
          <view class="chart-x-labels" v-if="chartPoints.length > 1" :style="{ width: svgScrollWidth + 'px' }">
            <view
              v-for="(item, idx) in detailedRecords"
              :key="idx"
              class="chart-x-label"
              :style="{ left: (chartPoints[idx]?.[0] || 0) + 'px', width: labelWidth + 'px' }"
            >
              {{ item.time.slice(5, 16) }}
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="trend">
        <text v-if="trend > 0" class="positive">总体趋势：+{{ trend }}bpm</text>
        <text v-else-if="trend < 0" class="negative">总体趋势：{{ trend }}bpm</text>
        <text v-else>总体趋势：无变化</text>
      </view>
    </view>
    <view class="record-list">
      <view v-for="(item, index) in detailedRecords" :key="index" class="record-item">
        <text>{{ item.time }} - {{ item.value }}bpm</text>
        <text :class="{ positive: item.change.startsWith('+'), negative: item.change.startsWith('-') }">
          {{ item.change }}
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    const sysInfo = uni.getSystemInfoSync();
    const screenWidth = sysInfo.windowWidth || 375;
    const basePadding = 16;
    return {
      detailedRecords: [],
      screenWidth,
      svgWidth: 0,
      svgHeight: Math.max(160, Math.floor(screenWidth * 0.45)),
      svgScrollWidth: 0,
      labelWidth: 80,
      basePadding,
    };
  },
  computed: {
    trend() {
      if (this.detailedRecords.length < 2) return 0;
      const first = parseInt(this.detailedRecords[0].value);
      const last = parseInt(this.detailedRecords[this.detailedRecords.length - 1].value);
      return last - first;
    },
    chartPoints() {
      if (!this.detailedRecords.length) return [];
      const n = this.detailedRecords.length;
      const minGap = this.labelWidth + 8;
      const maxGap = (this.screenWidth - this.basePadding * 2) / Math.max(n - 1, 1);
      const gap = Math.max(minGap, Math.min(maxGap, 80));
      this.svgWidth = gap;
      const w = gap * (n - 1) || gap;
      const h = this.svgHeight;
      const yArr = this.detailedRecords.map(item => parseInt(item.value));
      const minY = Math.min(...yArr), maxY = Math.max(...yArr);
      const rangeY = maxY - minY || 1;
      const paddingTop = 24;
      const paddingBottom = 28;
      const chartHeight = h - paddingTop - paddingBottom;
      this.$data.svgScrollWidth = Math.max(w + this.basePadding * 2, this.screenWidth);
      return yArr.map((y, i) => [
        gap * i + this.basePadding,
        paddingTop + ((maxY - y) / rangeY) * chartHeight
      ]);
    },
    chartPointsStr() {
      return this.chartPoints.map(pt => pt.join(',')).join(' ');
    }
  },
  created() {
    if (this.data) {
      this.detailedRecords = JSON.parse(decodeURIComponent(this.data));
    } else {
      // 示例数据，精确到小时
      this.detailedRecords = [
        { time: '2025-06-04 09:00', value: '72', change: '+2bpm' },
        { time: '2025-06-04 08:00', value: '70', change: '+1bpm' },
        { time: '2025-06-04 07:00', value: '69', change: '-1bpm' },
        { time: '2025-06-04 06:00', value: '70', change: '+2bpm' },
        { time: '2025-06-04 05:00', value: '68', change: '-2bpm' },
        { time: '2025-06-04 04:00', value: '70', change: '+1bpm' },
        { time: '2025-06-04 03:00', value: '69', change: '-1bpm' },
        { time: '2025-06-04 02:00', value: '70', change: '+1bpm' },
        { time: '2025-06-04 01:00', value: '69', change: '-1bpm' },
      ];
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
.simple-line-chart-scroll {
  width: 100vw;
  overflow-x: auto;
}
.simple-line-chart {
  position: relative;
  height: 220px;
  min-width: 100vw;
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
.chart-x-labels {
  position: absolute;
  left: 0;
  top: 200px;
  width: 100%;
  height: 20px;
  pointer-events: none;
}
.chart-x-label {
  position: absolute;
  top: 0;
  text-align: center;
  font-size: 18rpx;
  color: #888;
  transform: translateX(-50%);
  min-width: 60px;
  max-width: 100px;
  white-space: nowrap;
}
</style>
