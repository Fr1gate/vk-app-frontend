<template>
  <div class="player-base-research">
    <div class="player-base-research__left">
      <div class="tech-tree">
        <div
          v-for="tech in techs"
          :key="tech.id"
          class="tech-tree__tech"
          :class="{
            'tech-tree__tech_prev': false,
            'tech-tree__tech_next': false,
          }"
          :style="{ gridColumn: tech.column, gridRow: tech.row }"
        >
          {{ tech.name }}
          <div v-for="d in tech.prerequisites" :key="d.id" class="tech-tree__arrow_a">
            <div class="tech-tree__arrow_b"></div>
          </div>
        </div>
      </div>
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
import { computed, ref } from "vue";

const techTree = ref<ReturnType<typeof researchStore.formTree> | null>(null);

// is already loaded
const researchStore = useResearchStore();
researchStore.loadData().then(() => {
  techTree.value = researchStore.formTree();
  console.log("formed a tree");
});

const techs = computed(() => {
  console.log("computing");
  const res: (Technology & { row: number; column: number })[] = [];

  if (!techTree.value) return res;

  let curRow = 0;
  for (const [branchId, branchTechs] of Object.entries(techTree.value)) {
    curRow++;
    for (const [pointer, tech] of Object.entries(branchTechs)) {
      res.push({
        ...tech,
        row: curRow,
        column: +pointer,
      });
    }
  }

  return res;
});
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

.tech-tree {
  display: grid;
  grid-auto-columns: auto;
  grid-auto-rows: auto;
  gap: 6px 24px;
  overflow: auto;
  max-width: calc(100vw);
  max-height: calc(100vh - 105px);
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &__tech {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: 1px solid var(--theme-divider);
    padding: 6px;
    font-size: 12px;
    background: var(--gradient-background);
  }
}
</style>
