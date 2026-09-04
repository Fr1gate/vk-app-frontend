<template>
  <button class="button"><slot /></button>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@use "@/styles/mixins";

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-family);
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--font-primary);
  cursor: pointer;
  user-select: none;
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
