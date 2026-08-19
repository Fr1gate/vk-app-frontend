<template>
  <div>
    <h2>Home Base Page</h2>
    <h3 v-if="loading">LOADING</h3>
    <pre>{{ JSON.stringify(base, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { api, type ApiData } from "@/api";
import { usePlayerStore } from "@/stores/player";
import { ref } from "vue";

const playerStore = usePlayerStore();

const base = ref<ApiData<["bases", "basesDetail"]> | null>(null);

const loading = ref(true);

api.bases.basesDetail("site_earth").then(({ data }) => {
  base.value = data;
  loading.value = false;
});
</script>

<style scoped lang="scss">
//
</style>
