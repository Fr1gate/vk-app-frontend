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
.player-base__body {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
}
</style>
