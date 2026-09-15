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
              :key="building.building_id"
              class="new-building-modal__item"
              :class="{ 'new-building-modal__item_active': selectedBuilding === building }"
              @click="handleSelectBuilding(building)"
            >
              <span class="new-building-modal__item-icon"
                ><Component :is="getBuildingIconComponent(building.kind)" color="var(--theme-accent-hi)" :size="16"
              /></span>
              <span class="new-building-modal__item-name">{{ building.name }}</span>
            </div>
          </div>
          <div v-if="selectedBuilding" class="new-building-modal__details">
            <img class="new-building-modal__details-image" :src="portraitUrl" :alt="selectedBuilding.name" />
            <h3 class="new-building-modal__details-header">{{ selectedBuilding.name }}</h3>
            <div class="new-building-modal__details-description">
              <p>{{ selectedBuilding.description }}</p>
            </div>
            <div class="new-building-modal__details-costs">
              <div v-for="cost in costEntries" :key="cost.resourceId" class="new-building-modal__details-cost">
                <div class="new-building-modal__details-cost-left">
                  <Component :is="cost.icon" :size="16" :color="cost.color" class="new-building-modal__details-cost-icon" /><span
                    class="new-building-modal__details-cost-name"
                    >{{ cost.name }}</span
                  >
                </div>
                <div class="new-building-modal__details-cost-right">
                  <span class="new-building-modal__details-cost-value">{{ cost.formatted }}</span>
                </div>
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
import { api } from "@/api";
import type { BuildingAvailable } from "@/api/generated/types";
import UIButton from "@/components/ui/UIButton.vue";
import UIModal from "@/components/ui/UIModal.vue";
import { getBuildingIconComponent } from "@/constants/BuildingIcon";
import { getResourceColor, getResourceIconComponent } from "@/constants/ResourceIcon";
import { useGameDictionaryStore } from "@/stores/gameDictionaryStore";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { formatAmount } from "@/utils/formatAmount";
import { Plus, X } from "@lucide/vue";
import { computed, onMounted, ref, useTemplateRef } from "vue";

interface Props {
  availableBuildings: BuildingAvailable[];
}

const { availableBuildings } = defineProps<Props>();
const modalRef = useTemplateRef("modalRef");
const selectedBuilding = ref<null | BuildingAvailable>(null);
const gameDictionaryStore = useGameDictionaryStore();
const baseStore = usePlayerBaseStore();

const portraitByBuildingId = import.meta.glob("/src/assets/buildings/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const DEFAULT_PORTRAIT = "/src/assets/buildings/bld_default.webp";

const portraitUrl = computed(() => {
  const buildingId = selectedBuilding.value?.building_id;
  return (
    (buildingId ? portraitByBuildingId[`/src/assets/buildings/${buildingId}.webp`] : undefined) ??
    portraitByBuildingId[DEFAULT_PORTRAIT] ??
    ""
  );
});

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

async function handleBuild() {
  const siteId = baseStore.base?.site_id;
  const buildingId = selectedBuilding.value?.building_id;
  if (!siteId || !buildingId) return;

  await api.bases.buildingsUpgradeCreate(siteId, buildingId);
  await baseStore.refresh();
  handleClose();
}

function getResourceData(resourceId: string) {
  const kind = baseStore.getResourceKind(resourceId);
  return {
    icon: getResourceIconComponent(kind),
    color: getResourceColor(kind),
    name: gameDictionaryStore.getResourceName(resourceId),
    kind,
  };
}

const costEntries = computed(() =>
  Object.entries(selectedBuilding.value?.next_level_cost ?? {}).map(([resourceId, amount]) => ({
    resourceId,
    amount,
    formatted: formatAmount(amount),
    ...getResourceData(resourceId),
  })),
);
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
    @include mixins.gradient-border(var(--theme-active), var(--gradient-accent));
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
    display: flex;
    align-items: center;
    gap: 8px;

    @include mixins.button-states;

    &_active {
      @include mixins.gradient-border(var(--theme-active), var(--gradient-accent));
    }
  }

  &__item-icon {
    display: flex;
  }

  &__details {
    display: flex;
    flex-direction: column;
    overflow: auto;
    width: 500px;
  }

  &__details-image {
    border: 1px solid var(--theme-stroke);
    border-radius: 6px;
    width: 500px;
    height: 100px;
    object-fit: cover;
    margin-bottom: 8px;
  }

  &__details-header {
    font-size: 16px;
    color: var(--font-primary);
    font-weight: 700;
    margin-bottom: 8px;
  }

  &__details-description {
    color: var(--font-secondary);
    flex-shrink: 1;
    min-height: 1rem;
    max-height: 44px;
    overflow: auto;
    margin-bottom: 8px;
    font-size: 11px;
    line-height: 130%;
  }

  &__details-costs {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: max-content;
    column-gap: 24px;
    row-gap: 8px;
    margin-bottom: 8px;
  }

  &__details-cost {
    display: flex;
    gap: 4px;
    align-items: baseline;
    justify-content: space-between;
  }

  &__details-cost-left {
    display: flex;
    gap: 8px;
    align-items: baseline;
  }

  &__details-cost-icon {
    align-self: center;
  }

  &__details-cost-right {
    display: flex;
    gap: 8px;
    align-items: baseline;
  }

  &__details-controls {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
