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
import { staticDataService } from "./services/staticDataService";

onMounted(() => {
  vkInit()
    .then(async ({ loggedIn }) => {
      if (loggedIn) {
        await staticDataService.loadData();
        router.push({
          name: ROUTES_NAMES.PLAYER_BASE.HOME,
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
</style>
