<template>
  <view class="splash-container">
    <image class="splash-logo" src="/static/logo.png" mode="widthFix" />
  </view>
</template>

<script>
export default {
  name: 'Splash',
  mounted() {
    setTimeout(() => {
      // 跳转到登录页
      uni.reLaunch({ url: '/pages/login/index' });
    }, 3000);
  }
}
</script>

<style scoped>
.splash-container {
  width: 100vw;
  height: 100vh;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.splash-logo {
  width: 220rpx;
  max-width: 60vw;
  display: block;
}
</style>
