<!-- announcement_detail.vue -->
<!-- 公告详情页，展示公告的完整 Markdown 内容。 -->
<template>
  <!-- 公告详情主容器 -->
  <view class="container">
    <!-- Markdown 渲染组件，显示公告内容 -->
    <ua-markdown :source="mdContent" :showLine="false" />
  </view>
</template>
<script>
// 页面逻辑：onLoad 解析 query.content，赋值 mdContent 用于渲染
export default {
  data() { return { mdContent: '' } },
  onLoad(query) {
    this.mdContent = decodeURIComponent(query.content || '');
  }
}
</script>
<style scoped>
.container {
  padding: 30rpx;
  background: #fff;
  min-height: 100vh;
  padding-top: env(safe-area-inset-top);
}
</style>
