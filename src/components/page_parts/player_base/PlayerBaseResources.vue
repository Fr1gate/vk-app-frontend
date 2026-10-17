<template>
  <div class="resources-popup">
    <div class="resources-popup__header">Ресурсы базы</div>
    <div class="resources-popup__group">
      <div class="resources-popup__group-header">
        <div class="resources-popup__group-icon"><Box color="var(--res-solid)" /></div>
        <div class="resources-popup__group-name">Твёрдые</div>
        <div class="resources-popup__group-bar">
          <UIProgressBar :percent="storagePercents.solid" color="var(--res-solid)" class="resources-popup__bar" />
        </div>
        <div class="resources-popup__group-number">
          {{ formatAmount(playerBaseStore.storage.solid.used) }} / {{ formatAmount(playerBaseStore.storage.solid.capacity) }}
        </div>
      </div>
      <div class="resources-popup__group-grid">
        <div v-for="resItem in playerBaseStore.resourcesByPhase.solid" :key="resItem.id" class="resources-popup__group-resource">
          <div class="resources-popup__group-resource-name">{{ resItem.name }}</div>
          <div class="resources-popup__group-resource-value">{{ formatAmount(resItem.amount) }}</div>
        </div>
      </div>
    </div>
    <div class="resources-popup__group">
      <div class="resources-popup__group-header">
        <div class="resources-popup__group-icon"><Droplet color="var(--res-liquid)" /></div>
        <div class="resources-popup__group-name">Жидкости</div>
        <div class="resources-popup__group-bar">
          <UIProgressBar :percent="storagePercents.liquid" color="var(--res-liquid)" class="resources-popup__bar" />
        </div>
        <div class="resources-popup__group-number">
          {{ formatAmount(playerBaseStore.storage.liquid.used) }} / {{ formatAmount(playerBaseStore.storage.liquid.capacity) }}
        </div>
      </div>
      <div class="resources-popup__group-grid">
        <div v-for="resItem in playerBaseStore.resourcesByPhase.liquid" :key="resItem.id" class="resources-popup__group-resource">
          <div class="resources-popup__group-resource-name">{{ resItem.name }}</div>
          <div class="resources-popup__group-resource-value">{{ formatAmount(resItem.amount) }}</div>
        </div>
      </div>
    </div>
    <div class="resources-popup__group">
      <div class="resources-popup__group-header">
        <div class="resources-popup__group-icon"><Wind color="var(--res-gas)" /></div>
        <div class="resources-popup__group-name">Газы</div>
        <div class="resources-popup__group-bar">
          <UIProgressBar :percent="storagePercents.gas" color="var(--res-gas)" class="resources-popup__bar" />
        </div>
        <div class="resources-popup__group-number">
          {{ formatAmount(playerBaseStore.storage.gas.used) }} / {{ formatAmount(playerBaseStore.storage.gas.capacity) }}
        </div>
      </div>
      <div class="resources-popup__group-grid">
        <div v-for="resItem in playerBaseStore.resourcesByPhase.gas" :key="resItem.id" class="resources-popup__group-resource">
          <div class="resources-popup__group-resource-name">{{ resItem.name }}</div>
          <div class="resources-popup__group-resource-value">{{ formatAmount(resItem.amount) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UIProgressBar from "@/components/ui/UIProgressBar.vue";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { Box, Droplet, Wind } from "@lucide/vue";
import { computed } from "vue";
import { formatAmount } from "@/utils/formatAmount";

const playerBaseStore = usePlayerBaseStore();
const storagePercents = computed(() => {
  return {
    solid: (playerBaseStore.storage.solid.used / playerBaseStore.storage.solid.capacity) * 100,
    liquid: (playerBaseStore.storage.liquid.used / playerBaseStore.storage.liquid.capacity) * 100,
    gas: (playerBaseStore.storage.gas.used / playerBaseStore.storage.gas.capacity) * 100,
  };
});
</script>

<style lang="scss" scoped>
$popup-width: 45rem;
$popup-edge-gap: 1rem;
$popup-top-offset: 3rem;
$popup-bottom-gap: 1rem;

.resources-popup {
  display: flex;
  flex-direction: column;
  width: $popup-width;
  max-width: calc(100vw - #{$popup-edge-gap * 2});
  padding: 1rem;
  max-height: calc(100vh - #{$popup-top-offset + $popup-bottom-gap});
  overflow-y: auto;
  background: var(--gradient-background);
  backdrop-filter: blur(0.75rem);
  border: 1px solid var(--theme-stroke);
  border-radius: 0.75rem;

  &__header {
    text-transform: uppercase;
    font-size: var(--font-md);
    color: var(--font-muted);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &__group {
    &:not(:last-child) {
      border-bottom: 1px solid var(--theme-divider);
      padding-bottom: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }

  &__group-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: var(--font-md);
    color: var(--font-muted);
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &__group-icon {
    display: flex;

    svg {
      width: 0.875rem;
      height: 0.875rem;
    }
  }

  &__group-name {
    text-transform: uppercase;
  }

  &__bar {
    width: 5rem;
    align-self: center;
  }

  &__group-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    row-gap: 0.5rem;
    column-gap: 1.5rem;
  }
  &__group-resource {
    display: flex;
    font-size: var(--font-md);
    justify-content: space-between;
    gap: 0.5rem;
    white-space: nowrap;
  }
  &__group-resource-name {
    color: var(--font-secondary);
    font-weight: 500;
  }
  &__group-resource-value {
    font-weight: 600;
    color: var(--font-primary);
  }
}
</style>
