<template>
  <div class="tech-code">{{ code }}</div>
</template>

<script lang="ts" setup>
defineProps<{
  code: string;
}>();
</script>

<style lang="scss" scoped>
.tech-code {
  background-color: var(--theme-accent-deep);
  height: 1.5rem;
  width: 1.5rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  color: var(--theme-accent-hi);
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1;
}
</style>
