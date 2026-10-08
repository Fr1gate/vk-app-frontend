<template>
  <div class="player-base-research">
    <div class="player-base-research__left">
      <PlayerBaseResearchTree :techs="techs" />
    </div>
    <div class="player-base-research__right">
      <!-- Active research -->
      <!-- Selected technology details -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Technology } from "@/api/generated/types";
import { useResearchStore } from "@/stores/researchStore";
import { onMounted, ref } from "vue";
import PlayerBaseResearchTree from "@/components/page_parts/player_base/player_base_research/PlayerBaseResearchTree.vue";

type TechWithPosition = Technology & { row: number; column: number };

const researchStore = useResearchStore();
const techsPositions: Record<string, { row: number; column: number }> = {};
const techs = ref<Record<string, TechWithPosition>>({});

onMounted(() => {
  loadData();
});

function loadData() {
  researchStore.loadData().then(() => {
    const tree = researchStore.formTree()!;
    techs.value = {};

    let curRow = 0;
    for (const branchTechs of Object.values(tree)) {
      curRow++;
      for (const [pointer, tech] of Object.entries(branchTechs)) {
        techs.value[tech.id] = {
          ...tech,
          row: curRow,
          column: +pointer,
        };
        techsPositions[tech.id] = {
          row: curRow,
          column: +pointer,
        };
      }
    }
  });
}
</script>

<style lang="scss" scoped>
.player-base-research {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;

  background: #0a0c12e6;
  margin-top: -40px;
  padding-top: calc(40px + 16px);
  z-index: 1;

  &__ {
    //
  }
}
</style>
