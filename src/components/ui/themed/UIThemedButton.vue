<template>
  <button class="themed-button">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
//
</script>

<style lang="scss" scoped>
@use "@/styles/mixins";

.themed-button {
  @include mixins.gradient-border(var(--theme-active), var(--gradient-accent));
  padding: 10px 40px;
  box-shadow: 0 0 10px var(--theme-accent-glow);
}
</style>
