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
import { researchService } from "@/services/researchService";
import { onMounted, ref, watch } from "vue";
import PlayerBaseResearchTree from "@/components/page_parts/player_base/player_base_research/PlayerBaseResearchTree.vue";
import PlayerBaseResearchList from "@/components/page_parts/player_base/player_base_research/PlayerBaseResearchList.vue";
import UITabsSelector from "@/components/ui/UITabsSelector.vue";
import PlayerBaseResearchTechDetails from "@/components/page_parts/player_base/player_base_research/PlayerBaseResearchTechDetails.vue";

// DATA

type TechWithPosition = Technology & { row: number; column: number };

const researchStore = useResearchStore();
const techs = ref<Record<string, TechWithPosition>>({});

onMounted(() => {
  researchService.load();
});

watch(
  () => researchStore.researchData,
  () => {
    const tree = researchStore.formTree();
    if (!tree) return;

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
      }
    }
  },
);

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

const selectedTab = ref("list");

// SELECTED TECH
const selectedTech = ref<string | null>(null);
</script>

<style lang="scss" scoped>
$sub-menu-height: 2.5rem;

.player-base-research {
  flex-grow: 1;
  display: flex;
  // align-items: flex-end;

  background: #0a0c12e6;
  margin-top: calc(-1 * $sub-menu-height);
  padding-top: calc($sub-menu-height + 0.5rem);
  z-index: 1;
  min-height: 0;
  overflow: hidden;

  &__left {
    padding-inline: 24px 4px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
  }

  &__switcher {
    display: flex;
    margin-bottom: 0.5rem;
  }

  &__techs {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 0;
    min-width: 0;
  }

  &__right {
    padding-bottom: 10px;
    padding-right: 24px;
    min-height: 0;
  }
}
</style>
