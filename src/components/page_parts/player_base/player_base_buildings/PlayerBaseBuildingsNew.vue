<template>
  <UIModal ref="modalRef">
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
          <div class="new-building-modal__close" @click="handleClose"><X :size="18" /></div>
        </div>
        <div class="new-building-modal__body">
          <div class="new-building-modal__list">
            <div
              v-for="building in availableBuildings"
              :key="building.name"
              class="new-building-modal__item"
              :class="{ 'new-building-modal__item_active': selectedBuilding === building }"
              @click="handleSelectBuilding(building)"
            >
              <span class="new-building-modal__item-icon"></span>
              <span class="new-building-modal__item-name">{{ building.name }}</span>
              <span class="new-building-modal__item-cost"></span>
            </div>
          </div>
          <div v-if="selectedBuilding" class="new-building-modal__details">
            <img class="new-building-modal__details-image" src="../../../../assets/buildings/bld_admin.webp" :alt="selectedBuilding.name" />
            <h3 class="new-building-modal__details-header">{{ selectedBuilding.name }}</h3>
            <div class="new-building-modal__details-description">
              <p v-for="k in 100" :key="k">{{ selectedBuilding.name }}</p>
            </div>
            <div class="new-building-modal__details-costs">
              <div
                v-for="[key, value] in Object.entries(selectedBuilding.next_level_cost)"
                :key="key"
                class="new-building-modal__details-cost"
              >
                {{ value }}
              </div>
            </div>
            <div class="new-building-modal__details-controls">
              <UIButton @click="handleBuild">Построить</UIButton>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UIModal>
</template>

<script lang="ts" setup>
import type { BuildingAvailable } from "@/api/generated/types";
import UIButton from "@/components/ui/UIButton.vue";
import UIModal from "@/components/ui/UIModal.vue";
import { Plus, X } from "@lucide/vue";
import { onMounted, ref, useTemplateRef } from "vue";

interface Props {
  availableBuildings: BuildingAvailable[];
}

const { availableBuildings } = defineProps<Props>();
const modalRef = useTemplateRef("modalRef");
const selectedBuilding = ref<null | BuildingAvailable>(null);

onMounted(() => {
  if (availableBuildings[0]) {
    selectedBuilding.value = availableBuildings[0];
  }
});

function handleSelectBuilding(building: BuildingAvailable) {
  selectedBuilding.value = building;
}

function handleClose() {
  modalRef.value!.close();
}

function handleBuild() {
  //
  handleClose();
}
</script>

<style lang="scss" scoped>
@use "@/styles/mixins";

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

  &:hover {
    box-shadow: 0 0 10px var(--theme-accent-glow);
    @include mixins.gradient-border(var(--theme-fill), var(--gradient-accent));
  }
  &:active {
    @include mixins.gradient-border(var(--theme-accent-deep), var(--gradient-accent));
  }
}

.new-building-modal {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--silver-800);
    margin-bottom: 10px;
  }

  &__name {
    font-size: 18px;
    font-weight: 700;
  }

  &__close {
    cursor: pointer;

    svg {
      stroke: var(--font-muted);
    }

    &:hover {
      svg {
        stroke: var(--font-primary);
      }
    }
  }

  &__body {
    display: flex;
    gap: 16px;
    max-height: calc(100vh - 120px);
  }

  &__list {
    width: 292px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 4px;
  }

  &__item {
    background: var(--theme-active);
    border: 1px solid var(--theme-stroke);
    padding: 14px 10px;
    border-radius: 8px;
    cursor: pointer;

    &_active {
      border: 1px solid var(--theme-accent);
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  &__details-image {
    border: 1px solid var(--theme-stroke);
    border-radius: 6px;
    width: 500px;
    height: 150px;
    object-fit: cover;
    margin-bottom: 10px;
  }

  &__details-header {
    font-size: 16px;
    color: var(--font-primary);
    font-weight: 700;
    margin-bottom: 10px;
  }

  &__details-description {
    color: var(--font-secondary);
    margin-bottom: 10px;
    flex-shrink: 1;
    min-height: 0;
    overflow: auto;
  }

  &__details-costs {
    display: flex;
  }

  &__details-controls {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
