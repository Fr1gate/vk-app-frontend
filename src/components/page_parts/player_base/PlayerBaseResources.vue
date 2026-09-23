<template>
  <div class="resources-popup">
    <div class="resources-popup__header">Ресурсы базы</div>
    <div class="resources-popup__group">
      <div class="resources-popup__group-header">
        <div class="resources-popup__group-icon"><Box :size="12" color="var(--res-solid)" /></div>
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
        <div class="resources-popup__group-icon"><Droplet :size="12" color="var(--res-liquid)" /></div>
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
        <div class="resources-popup__group-icon"><Wind :size="12" color="var(--res-gas)" /></div>
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
.resources-popup {
  display: flex;
  flex-direction: column;
  padding: 10px 14px;
  background: var(--gradient-background);
  backdrop-filter: blur(12px);
  border: 1px solid var(--theme-stroke);
  border-radius: 12px;

  &__header {
    text-transform: uppercase;
    font-size: 12px;
    color: var(--font-muted);
    font-weight: 600;
    margin-bottom: 8px;
  }

  &__group {
    &:not(:last-child) {
      border-bottom: 1px solid var(--theme-divider);
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
  }

  &__group-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--font-muted);
    font-weight: 600;
    margin-bottom: 6px;
  }

  &__group-icon {
    //
  }

  &__group-name {
    text-transform: uppercase;
  }

  &__bar {
    width: 80px;
    align-self: center;
  }

  &__group-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    row-gap: 6px;
    column-gap: 16px;
  }
  &__group-resource {
    display: flex;
    font-size: 11px;
    justify-content: space-between;
    gap: 12px;
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
