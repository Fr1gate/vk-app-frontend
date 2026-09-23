<template>
  <div class="progress-bar">
    <div :style="fillStyle" class="progress-bar__fill"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  percent: number;
  color: string;
}

const { percent, color } = defineProps<Props>();

const fillStyle = computed(() => {
  return {
    width: `${percent}%`,
    background: `${color}`,
  };
});
</script>

<style lang="scss" scoped>
.progress-bar {
  position: relative;
  height: 4px;
  border-radius: 4px;
  background: #ffffff24;

  &__fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 4px;
    border-radius: 4px;
  }
}
</style>
