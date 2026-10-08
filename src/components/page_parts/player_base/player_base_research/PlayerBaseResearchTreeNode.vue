<template>
  <div
    ref="tech"
    class="tech-node"
    :class="{
      'tech-node_highlighted': !isOutside,
      'tech-node_prev': isPrevTech,
      'tech-node_next': isNextTech,
    }"
  >
    {{ tech.name }}
  </div>
</template>

<script lang="ts" setup>
import type { Technology } from "@/api/generated/types";
import { useMouseInElement } from "@vueuse/core";
import { useTemplateRef, watch } from "vue";

interface Props {
  tech: Technology;
  isPrevTech: boolean;
  isNextTech: boolean;
}

const { tech, isPrevTech, isNextTech } = defineProps<Props>();
const techRef = useTemplateRef("tech");

const emit = defineEmits<{
  highlight: [boolean];
}>();

const { isOutside } = useMouseInElement(techRef);

watch(isOutside, (newValue) => {
  emit("highlight", !newValue);
});
</script>

<style lang="scss" scoped>
.tech-node {
  display: flex;
  align-items: center;
  justify-content: center;
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

  &_highlighted {
    border-color: var(--theme-accent);
  }

  &_prev {
    border-color: var(--tech-prerequisite);
  }

  &_next {
    border-color: var(--tech-descendant);
  }
}
</style>
