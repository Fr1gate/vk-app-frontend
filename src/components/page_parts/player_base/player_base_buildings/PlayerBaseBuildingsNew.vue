<template>
  <UIModal ref="modalRef">
    <template #button>
      <div v-bind="$attrs" class="new-building">
        <div class="new-building__icon"><Plus color="var(--theme-accent)" /></div>
        <div class="new-building__text">Построить</div>
      </div>
    </template>
    <template #default>
      <div class="new-building-modal">
        <div class="new-building-modal__header">
          <div class="new-building-modal__name">Постройка здания</div>
          <div class="new-building-modal__close" @click="handleClose"><X /></div>
        </div>
        <div class="new-building-modal__body">
          <div class="new-building-modal__list">
            <div
              v-for="building in constructibleBuildings"
              :key="building.building_id"
              class="new-building-modal__item"
              :class="{ 'new-building-modal__item_active': selectedBuilding === building }"
              @click="handleSelectBuilding(building)"
            >
              <span class="new-building-modal__item-icon"
                ><Component :is="getBuildingIconComponent(building.kind)" color="var(--theme-accent-hi)"
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
                  <Component :is="cost.icon" :color="cost.color" class="new-building-modal__details-cost-icon" /><span
                    class="new-building-modal__details-cost-name"
                    >{{ cost.name }}</span
                  >
                </div>
                <div class="new-building-modal__details-cost-right">
                  <span
                    class="new-building-modal__details-cost-value"
                    :class="{
                      'new-building-modal__details-cost-value_not-enough': !cost.isEnough,
                    }"
                    >{{ cost.formatted }}</span
                  >
                </div>
              </div>
            </div>
            <div class="new-building-modal__details-controls">
              <UIButton v-show="constructionAvailable" @click="handleBuild">Построить</UIButton>
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
import { computed, ref, useTemplateRef, watch } from "vue";

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

const constructibleBuildings = computed(() =>
  availableBuildings.filter(
    (building) => !baseStore.buildings.some((built) => built.building_id === building.building_id),
  ),
);

watch(
  constructibleBuildings,
  (list) => {
    if (list.some((building) => building.building_id === selectedBuilding.value?.building_id)) return;
    selectedBuilding.value = list[0] ?? null;
  },
  { immediate: true },
);

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
  Object.entries(selectedBuilding.value!.next_level_cost).map(([resourceId, amount]) => ({
    resourceId,
    amount,
    formatted: formatAmount(amount),
    isEnough: baseStore.getResourceAmount(resourceId) >= amount,
    ...getResourceData(resourceId),
  })),
);

const constructionAvailable = computed(() => {
  if (!selectedBuilding.value) return false;
  return costEntries.value.every((cost) => cost.isEnough);
});
</script>

<style lang="scss" scoped>
@use "@/styles/mixins";

$modal-width: 66rem;
$modal-padding: 1.25rem;
$modal-edge-gap: 1rem;
$modal-max-width: calc(100vw - #{$modal-padding * 2 + $modal-edge-gap * 2});

@media (max-height: 449px) {
  .new-building-modal__details-image {
    display: none;
  }
}

.new-building {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 100%;
  background: radial-gradient(var(--theme-grad-a), var(--theme-grad-b));
  border: 1px solid var(--theme-stroke);
  user-select: none;
  cursor: pointer;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__text {
    display: none;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    box-shadow: 0 0 0.625rem var(--theme-accent-glow);
  }
}

@media (min-height: 450px) {
  .new-building {
    gap: 0.5rem;
    width: 9.5rem;
    height: 9.25rem;
    padding: 0.5rem;
    border-radius: 1.125rem;
    background: var(--theme-fill);

    &__icon {
      box-sizing: border-box;
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 100%;
      background: radial-gradient(var(--theme-grad-a), var(--theme-grad-b));
      border: 1px solid var(--theme-stroke);
    }

    &__text {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.2;
    }

    svg {
      width: 1.75rem;
      height: 1.75rem;
    }

    &:hover {
      box-shadow: 0 0 0.625rem var(--theme-accent-glow);
      @include mixins.gradient-border(var(--theme-fill), var(--gradient-accent));
    }

    &:active {
      @include mixins.gradient-border(var(--theme-active), var(--gradient-accent));
    }
  }
}

.new-building-modal {
  display: flex;
  flex-direction: column;
  width: $modal-width;
  max-width: $modal-max-width;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.625rem;
    border-bottom: 1px solid var(--silver-800);
    margin-bottom: 0.625rem;
  }

  &__name {
    font-size: 1.25rem;
    font-weight: 700;
  }

  &__close {
    display: flex;
    cursor: pointer;

    svg {
      width: 1.125rem;
      height: 1.125rem;
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
    gap: 1rem;
    max-height: calc(100vh - 7.5rem);
  }

  &__list {
    width: 18.25rem;
    flex-shrink: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-right: 0.25rem;
  }

  &__item {
    background: var(--theme-active);
    border: 1px solid var(--theme-stroke);
    padding: 0.875rem 0.625rem;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @include mixins.button-states;

    &_active {
      @include mixins.gradient-border(var(--theme-active), var(--gradient-accent));
    }
  }

  &__item-icon {
    display: flex;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    overflow: auto;
    flex: 1 1 0;
    min-width: 0;
  }

  &__details-image {
    border: 1px solid var(--theme-stroke);
    border-radius: var(--radius-md);
    width: 100%;
    height: 6.25rem;
    object-fit: cover;
    margin-bottom: 0.5rem;
  }

  &__details-header {
    font-size: 1rem;
    color: var(--font-primary);
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  &__details-description {
    color: var(--font-secondary);
    flex-shrink: 1;
    min-height: 1rem;
    max-height: 2.75rem;
    overflow: auto;
    margin-bottom: 0.5rem;
    font-size: var(--font-md);
    line-height: 130%;
  }

  &__details-costs {
    flex-grow: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: max-content;
    column-gap: 1.5rem;
    row-gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  &__details-cost {
    display: flex;
    gap: 0.25rem;
    align-items: baseline;
    justify-content: space-between;
    font-size: var(--font-md);
  }

  &__details-cost-left {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }

  &__details-cost-icon {
    align-self: center;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  &__details-cost-right {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }

  &__details-cost-value {
    &_not-enough {
      color: var(--status-error);
    }
  }

  &__details-controls {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
