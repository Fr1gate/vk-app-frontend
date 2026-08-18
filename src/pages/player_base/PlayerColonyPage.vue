<template>
  <div>
    <h2>Colony Page</h2>
    <router-link
      :to="{
        name: ROUTES_NAMES.PLAYER_BASE.HOME,
        params: {
          colonyId: 1,
        },
      }"
      >Go to Home Base</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { ROUTES_NAMES } from "@/constants/RoutesNames";
</script>
