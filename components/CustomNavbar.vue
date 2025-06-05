<template>
  <view class="custom-navbar" :style="navbarStyle">
    <view class="navbar-left" @click="handleBack" v-if="showBack">
      <text class="iconfont">&#xe600;</text>
    </view>
    <view class="navbar-title">{{ title }}</view>
    <view class="navbar-right"><slot name="right"></slot></view>
  </view>
  <slot></slot>
</template>

<script>
export default {
  name: 'CustomNavbar',
  props: {
    title: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    navbarStyle() {
      return {
        background: '#3CB371',
        color: '#fff',
        paddingTop: `calc(env(safe-area-inset-top, 0px) + 0px)`
      };
    }
  },
  methods: {
    handleBack() {
      uni.navigateBack({ delta: 1 });
    }
  }
};
</script>

<style scoped>
.custom-navbar {
  width: 100vw;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 999;
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top);
  background: #3CB371;
  color: #fff;
  font-weight: bold;
  font-size: 34rpx;
  box-shadow: 0 2rpx 8rpx rgba(60,179,113,0.08);
}
.navbar-left {
  position: absolute;
  left: 32rpx;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 40rpx;
  color: #fff;
}
.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  color: #fff;
  font-weight: bold;
  letter-spacing: 2rpx;
}
.navbar-right {
  position: absolute;
  right: 32rpx;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}
.iconfont {
  font-family: 'iconfont', Arial, sans-serif;
}
</style>
