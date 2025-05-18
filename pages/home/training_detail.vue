<!-- pages/training-detail/index.vue -->
<template>
    <view class="detail-container">
      <view class="chart-container">
        <text>锻炼时长变化趋势图表</text>
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
                stroke="#4CAF50"
                stroke-width="3"
              />
              <circle
                v-for="(pt, idx) in chartPoints"
                :key="idx"
                :cx="pt[0]"
                :cy="pt[1]"
                r="5"
                fill="#4CAF50"
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
                {{ item.date.slice(5) }}
              </view>
            </view>
          </view>
        </scroll-view>
        <view class="trend">
          <text v-if="trend > 0" class="positive">总体趋势：+{{ trend }}分钟</text>
          <text v-else-if="trend < 0" class="negative">总体趋势：{{ trend }}分钟</text>
          <text v-else>总体趋势：无变化</text>
        </view>
      </view>
      <view class="record-list">
        <view v-for="(item, index) in detailedRecords" :key="index" class="record-item">
          <text>{{ item.date }} - {{ item.duration }}</text>
          <text>{{ item.type || '综合训练' }}</text>
        </view>
      </view>
    </view>
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: '{}'
    }
  },
  data() {
    const sysInfo = uni.getSystemInfoSync();
    const screenWidth = sysInfo.windowWidth || 375;
    const basePadding = 40;
    return {
      detailedRecords: [],
      screenWidth,
      svgWidth: 0, // 动态计算
      svgHeight: Math.max(180, Math.floor(screenWidth * 0.5)), // 高度自适应
      svgScrollWidth: 0, // 动态计算
      labelWidth: 40,
      basePadding,
    };
  },
  computed: {
    trend() {
      if (this.detailedRecords.length < 2) return 0;
      const first = parseInt(this.detailedRecords[0].duration);
      const last = parseInt(this.detailedRecords[this.detailedRecords.length - 1].duration);
      return last - first;
    },
    chartPoints() {
      if (!this.detailedRecords.length) return [];
      const n = this.detailedRecords.length;
      // 计算点间距，最小为labelWidth，最大为(屏幕宽度-basePadding*2)/(n-1)
      const minGap = this.labelWidth;
      const maxGap = (this.screenWidth - this.basePadding * 2) / Math.max(n - 1, 1);
      const gap = Math.max(minGap, maxGap);
      this.svgWidth = gap;
      const w = gap * (n - 1) || gap;
      const h = this.svgHeight;
      const yArr = this.detailedRecords.map(item => parseInt(item.duration));
      const minY = Math.min(...yArr), maxY = Math.max(...yArr);
      const rangeY = maxY - minY || 1;
      const paddingTop = 20;
      const paddingBottom = 20;
      const chartHeight = h - paddingTop - paddingBottom;
      this.$data.svgScrollWidth = w + this.basePadding * 2;
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
    this.detailedRecords = JSON.parse(decodeURIComponent(this.data));
  }
};
</script>

<style scoped>
.detail-container {
  padding: 20rpx;
}
.chart-container {
  height: 400rpx;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 20rpx;
}
.simple-line-chart-scroll {
  width: 100%;
  overflow-x: auto;
}
.simple-line-chart {
  position: relative;
  height: 220px;
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
  color: #4CAF50;
}
.negative {
  color: #F44336;
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
}
</style>