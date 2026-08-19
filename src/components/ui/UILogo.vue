<template>
  <div
    class="logo"
    :style="{
      fontSize: `${size}px`,
    }"
  >
    <Rocket :size="size + 4" />Внеземелье
  </div>
</template>

<script lang="ts" setup>
import { Rocket } from "@lucide/vue";

interface Props {
  size?: number;
}

const { size = 32 } = defineProps<Props>();
</script>

<style lang="scss" scoped>
.logo {
  font-family: "Pattaya", sans-serif;
  display: flex;
  font-size: 32px;
  align-items: center;
  gap: 4px;
}
</style>
