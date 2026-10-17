<template>
  <div
    class="player-base"
    :class="{
      'player-base_moon': themeStore.currentTheme === 'moon',
      'player-base_mars': themeStore.currentTheme === 'mars',
    }"
  >
    <UILoaderModal v-if="baseStore.isInitialLoading" />
    <template v-else>
      <PlayerBaseHeader :energy="baseStore.powerBalance" :fuel="baseStore.fuelTotal" :money="baseStore.money" />
      <router-view />
    </template>
  </div>
</template>

<script setup lang="ts">
import PlayerBaseHeader from "@/components/page_parts/player_base/PlayerBaseHeader.vue";
import UILoaderModal from "@/components/ui/UILoaderModal.vue";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { useThemeStore } from "@/stores/themeStore";
import { onMounted, watch } from "vue";

const baseStore = usePlayerBaseStore();
const themeStore = useThemeStore();

onMounted(() => {
  baseStore.loadBase("site_earth");
});

watch(
  () => baseStore.base?.body,
  (body) => {
    themeStore.setTheme(body === "moon" || body === "mars" ? body : "earth");
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.player-base {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/bg/bases/bg-earth-1920.webp");
  background-size: cover;
  position: relative;

  &_moon {
    background-image: url("@/assets/bg/bases/bg-moon-1920.webp");
  }

  &_mars {
    background-image: url("@/assets/bg/bases/bg-mars-1920.webp");
  }

  &__header {
    height: 1.875rem;
  }

  &__body {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
  }
}
</style>
