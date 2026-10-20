<template>
  <button
    type="button"
    class="switch"
    :class="{ switch_on: model }"
    :disabled="disabled"
    role="switch"
    :aria-checked="model"
    @click="model = !model"
  />
</template>

<script lang="ts" setup>
interface Props {
  disabled?: boolean;
}

const { disabled = false } = defineProps<Props>();

const model = defineModel<boolean>({ default: false });
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  flex-shrink: 0;
  width: 1.875rem;
  height: 1rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-pill);
  background: var(--silver-700);
  cursor: pointer;
  transition: background 0.15s;

  &::after {
    content: "";
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 100%;
    background: var(--font-primary);
    transition: transform 0.15s;
  }

  &_on {
    background: var(--theme-accent);
  }

  &_on::after {
    transform: translateX(0.875rem);
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}
</style>
