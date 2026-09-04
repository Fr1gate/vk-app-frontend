<template>
  <div class="icon-button">
    <Component :is="iconComponent" :size="14" color="var(--silver-200)" />
  </div>
</template>

<script lang="ts" setup>
import type { Component } from "vue";

interface Props {
  iconComponent: Component;
}

const { iconComponent } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@use "@/styles/mixins";

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition:
    color 0.15s ease,
    filter 0.15s ease;
  background: var(--theme-active);
  border: 1px solid var(--theme-stroke);

  &:hover {
    border: 1px solid var(--theme-accent);
  }

  &:active {
    border: 1px solid var(--theme-accent);
    background: var(--theme-accent-deep);
  }

  &:disabled {
    cursor: not-allowed;
    background: transparent;
    border: 1px solid var(--silver-700);
    color: var(--font-disabled);
  }
}
</style>
