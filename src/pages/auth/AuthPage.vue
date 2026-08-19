<template>
  <div>
    <UISpinner />
  </div>
</template>

<script setup lang="ts">
import UISpinner from "@/components/ui/UISpinner.vue";
import { ROUTES_NAMES } from "@/constants/RoutesNames";
import router from "@/router";
import { vkInit } from "@/services/vk/vkInit";

console.log("before vkInit");
vkInit().then((isRegistered) => {
  console.log("vkinit", isRegistered);
  if (isRegistered) {
    router.push({
      name: ROUTES_NAMES.PLAYER_BASE.HOME,
    });
  } else {
    router.push({
      name: ROUTES_NAMES.AUTH.REGISTER,
    });
  }
});
</script>

<style scoped lang="scss">
//
</style>
