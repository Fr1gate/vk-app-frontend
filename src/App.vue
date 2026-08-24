<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from "@/constants/RoutesNames";
import router from "@/router";
import { vkInit } from "@/services/vk/vkInit";
import { onMounted } from "vue";

onMounted(() => {
  vkInit().then(({ loggedIn }) => {
    if (loggedIn) {
      router.push({
        name: ROUTES_NAMES.PLAYER_BASE.HOME,
      });
    } else {
      router.push({
        name: ROUTES_NAMES.SYSTEM.REGISTER,
      });
    }
  });
});
</script>

<style lang="scss">
@use "@/styles/style.scss";

.app {
  height: 100vh;
  width: 100vw;
}
</style>
