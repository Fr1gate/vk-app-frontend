<template>
  <div class="tech-tree" @click="handleSelect(null)">
    <template v-for="tech in Object.values(techs)" :key="tech.id">
      <PlayerBaseResearchTreeNode
        :tech="tech"
        :is-selected="selectedTech === tech.id"
        :is-prev-tech="!!prevTechs[tech.id]"
        :is-next-tech="!!nextTechs[tech.id]"
        :style="{ gridColumn: tech.column, gridRow: tech.row }"
        @select="handleSelect(tech.id)"
        @click.stop
      />
    </template>
    <template v-for="[key] in Object.entries(prevTechs)" :key="key">
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]!.link1"></div>
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]?.link2"></div>
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]?.link3"></div>
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]?.link4"></div>
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]!.link5"></div>
    </template>
    <template v-for="[key] in Object.entries(nextTechs)" :key="key">
      <div class="tech-tree__link tech-tree__link_next" :style="nextLinks[key]!.link1"></div>
      <div class="tech-tree__link tech-tree__link_next" :style="nextLinks[key]?.link2"></div>
      <div class="tech-tree__link tech-tree__link_next" :style="nextLinks[key]?.link3"></div>
      <div class="tech-tree__link tech-tree__link_next" :style="nextLinks[key]?.link4"></div>
      <div class="tech-tree__link tech-tree__link_next" :style="nextLinks[key]!.link5"></div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Technology } from "@/api/generated/types";
import { computed, ref, type CSSProperties } from "vue";
import { flattenDeep } from "lodash-es";
import PlayerBaseResearchTreeNode from "./PlayerBaseResearchTreeNode.vue";

type TechWithPosition = Technology & { row: number; column: number };
type linkStyles = {
  link1: CSSProperties;
  link2?: CSSProperties;
  link3?: CSSProperties;
  link4?: CSSProperties;
  link5?: CSSProperties;
};

const SIZES = {
  techHeight: 40,
  techWidth: 200,
  gapHorizontal: 24,
  gapVertical: 24,
};

const { techs } = defineProps<{
  techs: Record<string, TechWithPosition>;
}>();

const selectedTech = defineModel("selectedTech");

const highlightedTech = ref<string | null>(null);
const prevTechs = ref<Record<string, true>>({});
const nextTechs = ref<Record<string, true>>({});

const prevLinks = computed<Record<string, linkStyles>>(() => {
  if (!highlightedTech.value) return {};

  const rightTech = techs[highlightedTech.value]!;
  const links: Record<string, linkStyles> = {};

  Object.keys(prevTechs.value).forEach((curTechId) => {
    const leftTech = techs[curTechId]!;
    const rowDiff = rightTech.row - leftTech.row;
    const colDiff = rightTech.column - leftTech.column;
    // highway is below the top tech

    links[leftTech.id] = {
      // right tech connector
      link1: {
        left: `${SIZES.techWidth * (rightTech.column - 1) + SIZES.gapHorizontal * (rightTech.column - 1)}px`,
        top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight / 2}px`,
        transform: "translateX(-100%)",
        width: `${SIZES.gapHorizontal / 2}px`,
        height: "2px",
      },
      //left tech connector
      link5: {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1)}px`,
        top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight / 2}px`,
        width: `${SIZES.gapHorizontal / 2}px`,
        height: "2px",
      },
    };

    if (rowDiff > 0) {
      // right is below, highway is just under the left (top) card
      links[leftTech.id]!.link2 = {
        left: `${SIZES.techWidth * (rightTech.column - 1) + SIZES.gapHorizontal * (rightTech.column - 1) - SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight / 2}px`,
        width: "2px",
        height: `${SIZES.techHeight * rowDiff + SIZES.gapVertical * rowDiff - SIZES.techHeight / 2 - SIZES.gapVertical / 2}px`,
        transform: "translateY(-100%)",
      };
      links[leftTech.id]!.link3 = {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight + SIZES.gapVertical / 2}px`,
        width: `${SIZES.gapHorizontal * colDiff + SIZES.techWidth * (colDiff - 1) - SIZES.gapHorizontal}px`,
        height: "2px",
      };
      links[leftTech.id]!.link4 = {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight / 2}px`,
        width: "2px",
        height: `${SIZES.techHeight / 2 + SIZES.gapVertical / 2}px`,
      };
    } else if (rowDiff < 0) {
      // right is above, highway is just under the right (top) card
      links[leftTech.id]!.link2 = {
        left: `${SIZES.techWidth * (rightTech.column - 1) + SIZES.gapHorizontal * (rightTech.column - 1) - SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight / 2}px`,
        width: "2px",
        height: `${SIZES.techHeight / 2 + SIZES.gapVertical / 2 + 2}px`,
      };
      links[leftTech.id]!.link3 = {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight + SIZES.gapVertical / 2}px`,
        width: `${SIZES.gapHorizontal * colDiff + SIZES.techWidth * (colDiff - 1) - SIZES.gapHorizontal}px`,
        height: "2px",
      };
      links[leftTech.id]!.link4 = {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight / 2 + 2}px`,
        width: "2px",
        height: `${SIZES.techHeight * Math.abs(rowDiff) + SIZES.gapVertical * Math.abs(rowDiff) - SIZES.techHeight / 2 - SIZES.gapVertical / 2}px`,
        transform: "translateY(-100%)",
      };
    } else {
      // on the same level, highway is still below the row
      if (colDiff > 1) {
        links[leftTech.id]!.link2 = {
          left: `${SIZES.techWidth * (rightTech.column - 1) + SIZES.gapHorizontal * (rightTech.column - 1) - SIZES.gapHorizontal / 2}px`,
          top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight / 2}px`,
          width: "2px",
          height: `${SIZES.techHeight / 2 + SIZES.gapVertical / 2 + 2}px`,
        };
        links[leftTech.id]!.link3 = {
          left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
          top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight + SIZES.gapVertical / 2}px`,
          width: `${SIZES.gapHorizontal * colDiff + SIZES.techWidth * (colDiff - 1) - SIZES.gapHorizontal}px`,
          height: "2px",
        };
        links[leftTech.id]!.link4 = {
          left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
          top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight / 2}px`,
          width: "2px",
          height: `${SIZES.techHeight / 2 + SIZES.gapVertical / 2}px`,
        };
      }
    }
  });

  return links;
});
const nextLinks = computed<Record<string, linkStyles>>(() => {
  if (!highlightedTech.value) return {};

  const leftTech = techs[highlightedTech.value]!;
  const links: Record<string, linkStyles> = {};

  Object.keys(nextTechs.value).forEach((curTechId) => {
    const rightTech = techs[curTechId]!;
    const rowDiff = rightTech.row - leftTech.row;
    const colDiff = rightTech.column - leftTech.column;
    // highway is below the top tech

    links[rightTech.id] = {
      // right tech connector
      link1: {
        left: `${SIZES.techWidth * (rightTech.column - 1) + SIZES.gapHorizontal * (rightTech.column - 1)}px`,
        top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight / 2}px`,
        transform: "translateX(-100%)",
        width: `${SIZES.gapHorizontal / 2}px`,
        height: "2px",
      },
      //left tech connector
      link5: {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1)}px`,
        top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight / 2}px`,
        width: `${SIZES.gapHorizontal / 2}px`,
        height: "2px",
      },
    };

    if (rowDiff > 0) {
      // right is below, highway is just under the left (top) card
      links[rightTech.id]!.link2 = {
        left: `${SIZES.techWidth * (rightTech.column - 1) + SIZES.gapHorizontal * (rightTech.column - 1) - SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight / 2}px`,
        width: "2px",
        height: `${SIZES.techHeight * rowDiff + SIZES.gapVertical * rowDiff - SIZES.techHeight / 2 - SIZES.gapVertical / 2}px`,
        transform: "translateY(-100%)",
      };
      links[rightTech.id]!.link3 = {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight + SIZES.gapVertical / 2}px`,
        width: `${SIZES.gapHorizontal * colDiff + SIZES.techWidth * (colDiff - 1) - SIZES.gapHorizontal}px`,
        height: "2px",
      };
      links[rightTech.id]!.link4 = {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight / 2}px`,
        width: "2px",
        height: `${SIZES.techHeight / 2 + SIZES.gapVertical / 2}px`,
      };
    } else if (rowDiff < 0) {
      // right is above, highway is just under the right (top) card
      links[rightTech.id]!.link2 = {
        left: `${SIZES.techWidth * (rightTech.column - 1) + SIZES.gapHorizontal * (rightTech.column - 1) - SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight / 2}px`,
        width: "2px",
        height: `${SIZES.techHeight / 2 + SIZES.gapVertical / 2 + 2}px`, // +2 to cover the highway line
      };
      links[rightTech.id]!.link3 = {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight + SIZES.gapVertical / 2}px`,
        width: `${SIZES.gapHorizontal * colDiff + SIZES.techWidth * (colDiff - 1) - SIZES.gapHorizontal}px`,
        height: "2px",
      };
      links[rightTech.id]!.link4 = {
        left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
        top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight / 2 + 2}px`,
        width: "2px",
        height: `${SIZES.techHeight * Math.abs(rowDiff) + SIZES.gapVertical * Math.abs(rowDiff) - SIZES.techHeight / 2 - SIZES.gapVertical / 2}px`,
        transform: "translateY(-100%)",
      };
    } else {
      // on the same level, highway is still below the row
      if (colDiff > 1) {
        links[rightTech.id]!.link2 = {
          left: `${SIZES.techWidth * (rightTech.column - 1) + SIZES.gapHorizontal * (rightTech.column - 1) - SIZES.gapHorizontal / 2}px`,
          top: `${SIZES.techHeight * (rightTech.row - 1) + SIZES.gapVertical * (rightTech.row - 1) + SIZES.techHeight / 2}px`,
          width: "2px",
          height: `${SIZES.techHeight / 2 + SIZES.gapVertical / 2 + 2}px`, // +2 to cover the highway line
        };
        links[rightTech.id]!.link3 = {
          left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
          top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight + SIZES.gapVertical / 2}px`,
          width: `${SIZES.gapHorizontal * colDiff + SIZES.techWidth * (colDiff - 1) - SIZES.gapHorizontal}px`,
          height: "2px",
        };
        links[rightTech.id]!.link4 = {
          left: `${SIZES.techWidth * leftTech.column + SIZES.gapHorizontal * (leftTech.column - 1) + SIZES.gapHorizontal / 2}px`,
          top: `${SIZES.techHeight * (leftTech.row - 1) + SIZES.gapVertical * (leftTech.row - 1) + SIZES.techHeight / 2}px`,
          width: "2px",
          height: `${SIZES.techHeight / 2 + SIZES.gapVertical / 2}px`,
        };
      }
      // соседние колонки: link1 и link5 уже образуют прямую, звенья не нужны
    }
  });

  return links;
});

function handleHighlight(isHighlighted: boolean, techId: string) {
  reset();

  if (isHighlighted) {
    highlightedTech.value = techId;
    const tech = techs[techId]!;
    // prev techs
    const prerequisites = flattenDeep(tech.prerequisites);
    for (const preTech of prerequisites) {
      prevTechs.value[preTech] = true;
    }

    // TODO: next techs
    for (const nextTech of tech.dependents) {
      nextTechs.value[nextTech] = true;
    }
  }
}

function handleSelect(techId: string | null) {
  selectedTech.value = techId;
  if (techId) handleHighlight(true, techId);
  else reset();
}

function reset() {
  prevTechs.value = {};
  nextTechs.value = {};
  highlightedTech.value = null;
}
</script>

<style lang="scss" scoped>
.tech-tree {
  position: relative;
  display: grid;
  grid-auto-columns: auto;
  grid-auto-rows: auto;
  gap: 24px 24px;
  overflow: auto;
  max-height: calc(100vh - 145px);
  // scrollbar-width: none;
  // &::-webkit-scrollbar {
  //   display: none;
  // }

  &__link {
    position: absolute;

    &_prev {
      background-color: var(--tech-prerequisite);
    }
    &_next {
      background-color: var(--tech-descendant);
    }
  }
}
</style>
