<template>
  <div class="player-base__body">
    <div class="player-base__buildings-carousel">
      <PlayerBaseBuildings :buildings="baseStore.buildings" :available-buildings="baseStore.availableBuildings" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PlayerBaseBuildings from "@/components/page_parts/player_base/player_base_buildings/PlayerBaseBuildings.vue";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";

// is already loaded
const baseStore = usePlayerBaseStore();
</script>

<style lang="scss" scoped>
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
