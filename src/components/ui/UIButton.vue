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

  @include mixins.gradient-border(var(--bg-surface), var(--gradient-silver), 2px);
  &:hover:not(:disabled) {
    filter: brightness(1.15);
  }

  &:active:not(:disabled) {
    filter: brightness(0.92);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-100);
    outline-offset: 1px;
    border-radius: 6px;
  }

  &:disabled {
    color: var(--font-disabled);
    cursor: not-allowed;
    background:
      var(--bg-surface) padding-box,
      var(--silver-700) border-box;
  }
}
</style>
