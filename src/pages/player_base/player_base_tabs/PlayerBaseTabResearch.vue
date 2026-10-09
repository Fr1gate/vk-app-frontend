<template>
  <div class="player-base-research">
    <div class="player-base-research__left">
      <div class="player-base-research__switcher">
        <UITabsSelector v-model:selected="selectedTab" :options="TABS" />
      </div>
      <div class="player-base-research__techs">
        <PlayerBaseResearchTree v-if="selectedTab === 'tree'" :techs="techs" v-model:selected-tech="selectedTech" />
        <PlayerBaseResearchList v-else-if="selectedTab === 'list'" :techs="techs" v-model:selected-tech="selectedTech" />
      </div>
    </div>
    <div class="player-base-research__right">
      <PlayerBaseResearchTechDetails :selectedTech="selectedTech ? techs[selectedTech]! : null" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Technology } from "@/api/generated/types";
import { useResearchStore } from "@/stores/researchStore";
import { onMounted, ref } from "vue";
import PlayerBaseResearchTree from "@/components/page_parts/player_base/player_base_research/PlayerBaseResearchTree.vue";
import UITabsSelector from "@/components/ui/UITabsSelector.vue";
import PlayerBaseResearchTechDetails from "@/components/page_parts/player_base/player_base_research/PlayerBaseResearchTechDetails.vue";

// DATA

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

// TABS
const TABS = [
  {
    id: "list",
    name: "Список",
  },
  {
    id: "tree",
    name: "Дерево",
  },
];

const selectedTab = ref("tree");

// SELECTED TECH
const selectedTech = ref<string | null>(null);
</script>

<style lang="scss" scoped>
.player-base-research {
  flex-grow: 1;
  display: flex;
  // align-items: flex-end;

  background: #0a0c12e6;
  margin-top: -40px;
  padding-top: calc(40px + 16px);
  z-index: 1;

  &__left {
    padding-inline: 24px 4px;
    overflow: auto;
  }

  &__switcher {
    display: flex;
    margin-bottom: 8px;
  }

  &__right {
    padding-bottom: 10px;
    padding-right: 24px;
  }
}
</style>
