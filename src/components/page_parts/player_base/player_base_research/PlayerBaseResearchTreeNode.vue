<template>
  <div
    ref="tech"
    class="tech-node"
    :data-tech-id="tech.id"
    :class="{
      'tech-node_selected': isSelected,
      'tech-node_highlighted': !isOutside,
      'tech-node_prev': isPrevTech,
      'tech-node_next': isNextTech,
      'tech-node_researching': isResearching,
    }"
    @click="handleClick"
  >
    {{ tech.name }}
    <div v-if="isResearching" class="tech-node__bar">
      <div class="tech-node__bar-fill" :style="{ width: `${researchProgress}%` }"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Technology } from "@/api/generated/types";
import { useMouseInElement } from "@vueuse/core";
import { useTemplateRef, watch } from "vue";

interface Props {
  tech: Technology;
  isSelected: boolean;
  isPrevTech: boolean;
  isNextTech: boolean;
  isResearching: boolean;
  researchProgress: number;
}

const { tech, isPrevTech, isNextTech, isResearching, researchProgress } = defineProps<Props>();
const techRef = useTemplateRef("tech");

const emit = defineEmits<{
  highlight: [boolean];
  select: [boolean];
}>();

const { isOutside } = useMouseInElement(techRef);

watch(isOutside, (newValue) => {
  emit("highlight", !newValue);
});

function handleClick() {
  emit("select", true);
}
</script>

<style lang="scss" scoped>
.tech-node {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  border: 2px solid var(--theme-divider);
  padding: 6px;
  font-size: 12px;
  font-weight: 500;
  width: 200px;
  height: 40px;
  overflow: hidden;
  background: var(--gradient-background);
  border-radius: 6px;
  cursor: pointer;
  user-select: none;

  &_highlighted,
  &_selected {
    border-color: var(--theme-accent);
  }

  &_prev {
    border-color: var(--tech-prerequisite);
  }

  &_next {
    border-color: var(--tech-descendant);
  }

  &_researching {
    border-color: var(--theme-accent);
    background: var(--theme-accent-deep);
  }

  &__bar {
    position: absolute;
    left: 0.25rem;
    right: 0.25rem;
    bottom: 0.25rem;
    height: 0.125rem;
    border-radius: 999px;
    background: #ffffff24;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    background: var(--theme-accent);
  }
}
</style>
