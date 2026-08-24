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
  @include mixins.gradient-border(var(--bg-surface), var(--gradient-silver), 1px);

  &:hover {
    filter: brightness(1.15); // фон чуть подсвечивается
  }

  &:active {
    filter: brightness(0.92);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-100);
    outline-offset: 1px;
    border-radius: 6px;
  }
}
</style>
