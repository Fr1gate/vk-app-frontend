<template>
  <UIModal>
    <template #button>
      <div v-bind="$attrs" class="new-building">
        <div class="new-building__icon"><Plus color="var(--theme-accent)" :size="24" /></div>
        <div class="new-building__text">Построить</div>
      </div>
    </template>
    <template #default>
      <div class="new-building-modal">
        <div class="new-building-modal__header">
          <div class="new-building-modal__name">Постройка здания</div>
          <div class="new-building-modal__close"><X /></div>
        </div>
        <div class="new-building-modal__body">
          <div class="new-building-modal__list">
            <div
              v-for="(building, index) in availableBuildings"
              :key="building.name"
              class="new-building-modal__item"
              :class="{ 'new-building-modal__item_active': index % 2 }"
              @click="handleSelectBuilding(building)"
            >
              <span class="new-building-modal__item-icon"></span>
              <span class="new-building-modal__item-name">{{ building.name }}</span>
              <span class="new-building-modal__item-cost"></span>
            </div>
          </div>
          <div v-if="selectedBuilding" class="new-building-modal__details">
            <img src="" alt="" />
            <h3 class="new-building-modal__details-header">{{ selectedBuilding.name }}</h3>
            <div class="new-building-modal__details-description">{{ selectedBuilding.name }}</div>
            <div
              v-for="[key, value] in Object.entries(selectedBuilding.next_level_cost)"
              :key="key"
              class="new-building-modal__details-cost"
            >
              {{ value }}
            </div>
            <div class="new-building-modal__details-controls">
              <UIThemedButton>Построить</UIThemedButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UIModal>
</template>

<script lang="ts" setup>
import type { BuildingAvailable } from "@/api/generated/types";
import UIThemedButton from "@/components/ui/themed/UIThemedButton.vue";
import UIModal from "@/components/ui/UIModal.vue";
import { Plus, X } from "@lucide/vue";
import { ref } from "vue";

interface Props {
  availableBuildings: BuildingAvailable[];
}

const { availableBuildings } = defineProps<Props>();

function handleSelectBuilding(building: BuildingAvailable) {
  selectedBuilding.value = building;
}

const selectedBuilding = ref<null | BuildingAvailable>(null);
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

.new-building-modal {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__body {
    display: flex;
  }

  &__list {
    width: 292px;
    max-height: 304px;
    overflow: auto;
  }
}
</style>
