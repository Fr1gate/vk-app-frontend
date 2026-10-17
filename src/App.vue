<template>
  <div class="app">
    <router-view />
    <div class="orientation-guard">
      <Smartphone class="orientation-guard__icon" color="var(--theme-accent)" />
      <div class="orientation-guard__text">Поверните устройство горизонтально</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from "@/constants/RoutesNames";
import router from "@/router";
import { vkInit } from "@/services/vk/vkInit";
import { Smartphone } from "@lucide/vue";
import { onMounted } from "vue";
import { staticDataService } from "./services/staticDataService";

onMounted(() => {
  vkInit()
    .then(async ({ loggedIn }) => {
      if (loggedIn) {
        await staticDataService.loadData();
        router.push({
          name: ROUTES_NAMES.PLAYER_BASE.HOME.BUILDINGS,
        });
      } else {
        router.push({
          name: ROUTES_NAMES.SYSTEM.REGISTER,
        });
      }
    })
    .catch((e) => console.log("Caught login", e));
});
</script>

<style lang="scss">
@use "@/styles/style.scss";

.app {
  height: 100vh;
  width: 100vw;
}

.orientation-guard {
  display: none;

  @media (orientation: portrait) {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    background: #0a0c12;

    &__icon {
      width: 64px;
      height: 64px;
      transform: rotate(90deg);
    }

    &__text {
      color: var(--font-primary);
      font-family: Inter, sans-serif;
      font-size: 18px;
      font-weight: 600;
      text-align: center;
    }
  }
}
</style>
