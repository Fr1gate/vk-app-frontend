<template>
  <div class="player-base" data-theme="earth">
    <UILoaderModal v-if="loading" />
    <template v-else>
      <PlayerBaseHeader :energy="energy" :fuel="fuel" :money="money" />
      <div class="player-base__body">
        <div class="player-base__buildings-carousel">
          <PlayerBaseBuildings :buildings="base!.buildings" :available-buildings="base!.buildings_available" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { api, type ApiData } from "@/api";
import PlayerBaseBuildings from "@/components/page_parts/player_base/player_base_buildings/PlayerBaseBuildings.vue";
import PlayerBaseHeader from "@/components/page_parts/player_base/PlayerBaseHeader.vue";
import UILoaderModal from "@/components/ui/UILoaderModal.vue";
import { computed, ref } from "vue";

const base = ref<ApiData<["bases", "basesDetail"]> | null>(null);

const loading = ref(true);

api.bases.basesDetail("site_earth").then(({ data }) => {
  base.value = data;
  loading.value = false;
  console.log("BASE:", base.value);
});

const money = computed(() => {
  if (!base.value) return 0;
  return base.value.resources.res_money!;
});
const fuel = computed(() => {
  if (!base.value) return 0;
  return Object.values(base.value.fuel).reduce((acc, value) => {
    return acc + value;
  }, 0);
});
const energy = computed(() => {
  if (!base.value) return 0;
  return base.value.production?.power?.generation_per_hour! - base.value.production?.power?.demand_per_hour!;
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
    display: flex;
    align-items: flex-end;
  }
}
</style>
