<template>
  <UIDropdown class="resource-inline" trigger="hover" :match-trigger-width="false">
    <template #button>
      <span class="resource-inline__inner" :style="{ color: color ?? undefined }" :aria-label="name">
        <Component v-if="!hideIcon" :is="icon" class="resource-inline__icon" :color="iconColor" />
        <span v-if="!iconOnly" class="resource-inline__label">{{ displayLabel }}</span>
        <span v-if="value" class="resource-inline__value">{{ value }}</span>
      </span>
    </template>
    <template #content>
      <div class="resource-tooltip">
        <div class="resource-tooltip__name">
          <Component :is="icon" class="resource-tooltip__icon" :color="iconColor" />
          <span>{{ name }}</span>
        </div>
        <div v-if="description" class="resource-tooltip__description">{{ description }}</div>
      </div>
    </template>
  </UIDropdown>
</template>

<script lang="ts" setup>
import UIDropdown from "@/components/ui/UIDropdown.vue";
import { getResourceColor, getResourceIconComponent } from "@/constants/ResourceIcon";
import { useGameDictionaryStore } from "@/stores/gameDictionaryStore";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { computed } from "vue";

interface Props {
  resourceId: string;
  label?: string;
  value?: string;
  iconOnly?: boolean;
  hideIcon?: boolean;
  color?: string;
}

const { resourceId, label, value, iconOnly = false, hideIcon = false, color } = defineProps<Props>();

const baseStore = usePlayerBaseStore();
const dictionary = useGameDictionaryStore();

const kind = computed(() => baseStore.getResourceKind(resourceId));
const icon = computed(() => getResourceIconComponent(kind.value));
const iconColor = computed(() => color ?? getResourceColor(kind.value));
const name = computed(() => dictionary.getResourceName(resourceId));
const description = computed(() => dictionary.getResourceDescription(resourceId));
const displayLabel = computed(() => label ?? name.value);
</script>

<style lang="scss" scoped>
.resource-inline {
  position: relative;
  display: inline-flex;
  max-width: 100%;
  top: 0.05em;
  color: inherit;

  &__inner {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
    width: 100%;
    min-width: 0;
  }

  &__icon {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
  }

  &__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__value {
    flex-shrink: 0;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
}

.resource-tooltip {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 14.5rem;
  max-width: calc(100vw - 1rem);
  padding: 0.625rem 0.75rem;
  background: var(--bg-elevated);
  border: 1px solid var(--theme-stroke);
  border-radius: var(--radius-md);
  color: var(--font-primary);
  pointer-events: none;

  &__name {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: var(--font-md);
    font-weight: 600;
  }

  &__icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &__description {
    font-size: var(--font-sm);
    line-height: 130%;
    color: var(--font-secondary);
  }
}
</style>
