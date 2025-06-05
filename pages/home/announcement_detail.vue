<template>
  <view class="container">
    <ua-markdown :source="mdContent" :showLine="false" />
  </view>
</template>
<script>
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
