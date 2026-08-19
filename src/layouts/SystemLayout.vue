<template>
  <div class="system-layout">
    <div class="system-layout__bg">
      <div class="system-layout__content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "@/styles/variables";

.system-layout {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/bg/system/bg-system.webp");
  background-size: cover;

  &__bg {
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, #06060aff 0%, #0a0c12cc 50%, #0a0c12ff 100%);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    // background-color: var(--bg-elevated);
    background: radial-gradient(circle, #323743 0%, #1e2129 100%);
    border-radius: var(--radius-lg);
    padding: 32px 64px;
  }
}
</style>
