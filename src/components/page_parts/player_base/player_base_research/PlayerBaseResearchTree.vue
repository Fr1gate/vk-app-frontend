<template>
  <div class="tech-tree" ref="tree" @click="handleSelect(null)">
    <template v-for="tech in Object.values(techs)" :key="tech.id">
      <PlayerBaseResearchTreeNode
        :tech="tech"
        :is-selected="selectedTech === tech.id"
        :is-prev-tech="!!prevTechs[tech.id]"
        :is-next-tech="!!nextTechs[tech.id]"
        :is-researching="tech.status === 'in_progress'"
        :research-progress="researchProgress"
        :style="{ gridColumn: tech.column, gridRow: tech.row }"
        @select="handleSelect(tech.id)"
        @click.stop
      />
    </template>
    <template v-for="[key] in Object.entries(prevLinks)" :key="key">
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]!.link1"></div>
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]?.link2"></div>
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]?.link3"></div>
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]?.link4"></div>
      <div class="tech-tree__link tech-tree__link_prev" :style="prevLinks[key]!.link5"></div>
    </template>
    <template v-for="[key] in Object.entries(nextLinks)" :key="key">
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
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch, type CSSProperties } from "vue";
import { flattenDeep } from "lodash-es";
import { useResearchStore } from "@/stores/researchStore";
import PlayerBaseResearchTreeNode from "./PlayerBaseResearchTreeNode.vue";

const TIMER_UPDATE_INTERVAL = 200;
const NODE_GAP = 6;
const LINK_THICKNESS = 2;

type TechWithPosition = Technology & { row: number; column: number };
type linkStyles = {
  link1: CSSProperties;
  link2?: CSSProperties;
  link3?: CSSProperties;
  link4?: CSSProperties;
  link5?: CSSProperties;
};
type NodeBox = { x: number; y: number; w: number; h: number };

const { techs } = defineProps<{
  techs: Record<string, TechWithPosition>;
}>();

const selectedTech = defineModel("selectedTech");

const researchStore = useResearchStore();

const highlightedTech = ref<string | null>(null);
const prevTechs = ref<Record<string, true>>({});
const nextTechs = ref<Record<string, true>>({});

const treeRef = useTemplateRef<HTMLElement>("tree");
const nodeRects = ref<Record<string, NodeBox>>({});

const now = ref(Date.now());
const timer = ref<ReturnType<typeof setInterval>>();

const researchingTech = computed(() => Object.values(techs).find((tech) => tech.status === "in_progress") ?? null);

watch(
  () => researchingTech.value?.id,
  (techId) => {
    clearInterval(timer.value);
    timer.value = techId ? setInterval(() => (now.value = Date.now()), TIMER_UPDATE_INTERVAL) : undefined;
  },
  { immediate: true },
);

onUnmounted(() => clearInterval(timer.value));

const researchProgress = computed(() => {
  if (!researchingTech.value) return 0;
  const active = researchStore.activeResearch.find((item) => item.tech_id === researchingTech.value!.id);
  if (!active) return 0;
  const started = new Date(active.started_at).getTime();
  const completes = new Date(active.completes_at).getTime();
  if (completes <= started) return 100;
  return Math.min(100, Math.max(0, ((now.value - started) / (completes - started)) * 100));
});

function measureNodes() {
  const tree = treeRef.value;
  if (!tree) return;

  const rects: Record<string, NodeBox> = {};
  for (const node of tree.querySelectorAll<HTMLElement>("[data-tech-id]")) {
    rects[node.dataset.techId!] = {
      x: node.offsetLeft,
      y: node.offsetTop,
      w: node.offsetWidth,
      h: node.offsetHeight,
    };
  }
  nodeRects.value = rects;
}

watch(
  () => techs,
  () => nextTick(measureNodes),
);
onMounted(() => nextTick(measureNodes));

const toPx = (value: number) => `${value}px`;

function verticalSegment(x: number, fromY: number, toY: number): CSSProperties {
  return {
    left: toPx(x),
    top: toPx(Math.min(fromY, toY)),
    width: toPx(LINK_THICKNESS),
    height: toPx(Math.abs(toY - fromY) + LINK_THICKNESS),
  };
}

function buildLink(left: NodeBox, right: NodeBox): linkStyles {
  const half = NODE_GAP / 2;
  const leftCenterY = left.y + left.h / 2;
  const rightCenterY = right.y + right.h / 2;
  const leftStubX = left.x + left.w;
  const rightStubX = right.x - half;

  const links: linkStyles = {
    link1: { left: toPx(rightStubX), top: toPx(rightCenterY), width: toPx(half), height: toPx(LINK_THICKNESS) },
    link5: { left: toPx(leftStubX), top: toPx(leftCenterY), width: toPx(half), height: toPx(LINK_THICKNESS) },
  };

  const sameRow = left.y === right.y;
  const adjacent = right.x - leftStubX <= NODE_GAP;
  if (sameRow && adjacent) return links;

  const leftVertX = leftStubX + half;
  const highwayY = (left.y < right.y ? left.y + left.h : right.y + right.h) + half;

  links.link2 = verticalSegment(rightStubX, rightCenterY, highwayY);
  links.link3 = { left: toPx(leftVertX), top: toPx(highwayY), width: toPx(rightStubX - leftVertX), height: toPx(LINK_THICKNESS) };
  links.link4 = verticalSegment(leftVertX, leftCenterY, highwayY);
  return links;
}

const prevLinks = computed<Record<string, linkStyles>>(() => {
  if (!highlightedTech.value) return {};
  const right = nodeRects.value[highlightedTech.value];
  if (!right) return {};

  const links: Record<string, linkStyles> = {};
  for (const techId of Object.keys(prevTechs.value)) {
    const left = nodeRects.value[techId];
    if (left) links[techId] = buildLink(left, right);
  }
  return links;
});

const nextLinks = computed<Record<string, linkStyles>>(() => {
  if (!highlightedTech.value) return {};
  const left = nodeRects.value[highlightedTech.value];
  if (!left) return {};

  const links: Record<string, linkStyles> = {};
  for (const techId of Object.keys(nextTechs.value)) {
    const right = nodeRects.value[techId];
    if (right) links[techId] = buildLink(left, right);
  }
  return links;
});

function handleHighlight(isHighlighted: boolean, techId: string) {
  reset();

  if (isHighlighted) {
    highlightedTech.value = techId;
    const tech = techs[techId]!;
    const prerequisites = flattenDeep(tech.prerequisites);
    for (const preTech of prerequisites) {
      prevTechs.value[preTech] = true;
    }

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
  align-content: start;
  gap: 6px 6px;
  overflow: auto;
  flex-grow: 1;
  min-height: 0;

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
