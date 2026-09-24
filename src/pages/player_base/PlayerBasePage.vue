<template>
  <div class="player-base">
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

// maybe redundant
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
  background-image: url("@/assets/bg/bases/bg-earth.webp");
  background-size: cover;
  position: relative;

  &__header {
    height: 30px;
  }

  &__body {
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
  }
}
</style>
