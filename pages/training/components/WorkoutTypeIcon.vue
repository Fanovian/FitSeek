// WorkoutTypeIcon.vue
// 锻炼类型图标组件，根据类型显示不同图标。
<script setup>
defineProps({
  type: {
    type: String,
    required: true
  }
});

// 组件逻辑：props 传入类型，getIconClass 返回对应图标类名
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
  <!-- 图标展示区域 -->
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
