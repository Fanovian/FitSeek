<script setup>
defineProps({
  type: {
    type: String,
    required: true
  }
});

// 获取锻炼类型对应的图标
const getIconClass = (type) => {
  switch (type) {
    case 'cardio':
      return 'cardio-icon';
    case 'strength':
      return 'strength-icon';
    case 'stretch':
      return 'stretch-icon';
    default:
      return 'other-icon';
  }
};
</script>

<template>
  <view :class="['workout-type-icon', getIconClass(type)]"></view>
</template>

<style scoped>
.workout-type-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 10rpx;
  display: inline-block;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.cardio-icon {
  background-image: url('/static/icons/training/cardio.svg');
}

.strength-icon {
  background-image: url('/static/icons/training/strength.svg');
}

.stretch-icon {
  background-image: url('/static/icons/training/stretch.svg');
}

.other-icon {
  background-image: url('/static/icons/training/other.svg');
}
</style>
