<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from "@/constants/RoutesNames";
import router from "@/router";
import { vkInit } from "@/services/vk/vkInit";
import { ref } from "vue";
import { useErrorStore } from "./stores/errorStore";

const { handleError } = useErrorStore();

const loading = ref(true);
vkInit().then(({ isError, loggedIn }) => {
  if (isError) {
    handleError(`Auth Error`);
  } else {
    loading.value = false;
    if (loggedIn) {
      router.push({
        name: ROUTES_NAMES.PLAYER_BASE.HOME,
      });
    } else {
      router.push({
        name: ROUTES_NAMES.SYSTEM.REGISTER,
      });
    }
  }
});
</script>

<style lang="scss">
@use "@/styles/style.scss";

.app {
  height: 100vh;
  width: 100vw;
}
</style>
