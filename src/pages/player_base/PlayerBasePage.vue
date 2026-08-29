<template>
  <div class="player-base" data-theme="earth">
    <UILoaderModal v-if="loading" />
    <PlayerBaseHeader :energy="1" :fuel="1" :money="1" />
    <div class="player-base__body">
      <div class="player-base__buildings-carousel"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { api, type ApiData } from "@/api";
import PlayerBaseHeader from "@/components/page_parts/player_base/PlayerBaseHeader.vue";
import UILoaderModal from "@/components/ui/UILoaderModal.vue";
import { ref } from "vue";

const base = ref<ApiData<["bases", "basesDetail"]> | null>(null);

const loading = ref(true);

api.bases.basesDetail("site_earth").then(({ data }) => {
  base.value = data;
  loading.value = false;
});
</script>

<style scoped lang="scss">
.player-base {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/bg/bases/bg-earth.webp");
  background-size: cover;

  &__header {
    height: 30px;
  }

  &__body {
    flex-grow: 1;
  }
}
</style>
