<template>
  <UIModal>
    <template #button>
      <div v-bind="$attrs" class="new-building" @click="handleClick">
        <div class="new-building__icon"><Plus color="var(--theme-accent)" :size="24" /></div>
        <div class="new-building__text">Построить</div>
      </div>
    </template>
    <template #default>
      <div>
        <div v-for="building in availableBuildings" :key="building.name">
          {{ building.name }}
        </div>
      </div>
    </template>
  </UIModal>
</template>

<script lang="ts" setup>
import type { BuildingAvailable } from "@/api/generated/types";
import UIModal from "@/components/ui/UIModal.vue";
import { Plus } from "@lucide/vue";

interface Props {
  availableBuildings: BuildingAvailable[];
}

const { availableBuildings } = defineProps<Props>();

function handleClick() {}
</script>

<style lang="scss" scoped>
.new-building {
  width: 140px;
  height: 112px;
  border-radius: 18px;
  background-color: var(--theme-fill);
  border: 1px solid var(--theme-stroke);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  user-select: none;
  cursor: pointer;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 50px;
    width: 50px;
    background: radial-gradient(var(--theme-grad-a), var(--theme-grad-b));
    border: 1px solid var(--theme-stroke);
    border-radius: 100%;
  }

  &__text {
    font-size: 11px;
    font-weight: 500;
    line-height: 120%;
    height: 28px;
    display: flex;
    align-items: center;
  }
}
</style>
