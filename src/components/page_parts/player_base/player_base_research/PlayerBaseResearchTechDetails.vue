<template>
  <div class="tech-details">
    <template v-if="selectedTech">
      <div class="tech-details__tech-container">
        <div class="tech-details__head">
          <div class="tech-details__name">{{ selectedTech.name }}</div>
          <div class="tech-details__info-row">
            <div class="tech-details__code">{{ selectedTech.code }}</div>
            <div class="tech-details__branch">{{ researchStore.getBranchName(selectedTech.branch_id) }}</div>
            <div class="tech-details__time-cost">{{ selectedTech.cost.hours }} ч</div>
          </div>
        </div>
        <div class="tech-details__cost">
          <div class="tech-details__cost-label">Стоимость</div>
          <div class="tech-details__cost-row">
            <div class="tech-details__cost-money">
              <RussianRuble :size="16" />
              <span
                class="tech-details__cost-value"
                :class="{ 'tech-details__cost-value_not-enough': baseStore.money < selectedTech.cost.money }"
                >{{ formatAmount(selectedTech.cost.money) }}</span
              >
            </div>
          </div>
          <template v-if="selectedTech.cost.materials">
            <div v-for="[material, cost] in Object.entries(selectedTech.cost.materials)" :key="material" class="tech-details__cost-row">
              <div class="tech-details__cost-name">{{ getMaterialName(material) }}</div>
              <div
                class="tech-details__cost-value"
                :class="{ 'tech-details__cost-value_not-enough': baseStore.getResourceAmount(material) < cost }"
              >
                {{ formatAmount(cost) }}
              </div>
            </div>
          </template>
        </div>
        <div class="tech-details__description">{{ selectedTech.description }}</div>
      </div>
      <UIButton
        v-show="selectedTech.status === 'available'"
        class="tech-details__research-button"
        :disabled="!canAfford || isStarting || researchInProgress"
        @click="handleResearch"
        >Исследовать</UIButton
      >
    </template>
    <div v-else class="tech-details__placeholder">
      <div class="tech-details__placeholder-icon">
        <FlaskConical color="var(--theme-accent)" />
      </div>
      <div class="tech-details__placeholder-advice">Выберите технологию</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Technology } from "@/api/generated/types";
import UIButton from "@/components/ui/UIButton.vue";
import { researchService } from "@/services/researchService";
import { useGameDictionaryStore } from "@/stores/gameDictionaryStore";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { useResearchStore } from "@/stores/researchStore";
import { formatAmount } from "@/utils/formatAmount";
import { FlaskConical, RussianRuble } from "@lucide/vue";
import { computed, ref } from "vue";

type TechWithPosition = Technology & { row: number; column: number };

interface Props {
  selectedTech: TechWithPosition | null;
}

const { selectedTech } = defineProps<Props>();

const dictionary = useGameDictionaryStore();
const baseStore = usePlayerBaseStore();
const researchStore = useResearchStore();

const isStarting = ref(false);

const researchInProgress = computed(() => researchStore.activeResearch.length > 0);

const canAfford = computed(() => {
  if (!selectedTech) return false;
  const moneyEnough = baseStore.money >= selectedTech.cost.money;
  const materialsEnough = Object.entries(selectedTech.cost.materials ?? {}).every(
    ([material, cost]) => baseStore.getResourceAmount(material) >= cost,
  );
  return moneyEnough && materialsEnough;
});

async function handleResearch() {
  if (!selectedTech || !canAfford.value || isStarting.value) return;

  isStarting.value = true;
  try {
    await researchService.start(selectedTech.id, baseStore.base?.site_id);
  } finally {
    isStarting.value = false;
  }
}

function getMaterialName(key: string) {
  return dictionary.getResourceName(key);
}
</script>

<style lang="scss" scoped>
.tech-details {
  width: 15rem;
  border: 1px solid var(--theme-stroke);
  border-radius: 0.75rem;
  background-color: var(--theme-surface);
  height: 100%;
  min-height: 0;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__tech-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-grow: 1;
    min-height: 0;
    overflow-y: auto;
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__name {
    color: var(--font-primary);
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2;
    hyphens: auto;
    overflow-wrap: anywhere;
  }

  &__info-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__code {
    background-color: var(--theme-accent-deep);
    height: 1.5rem;
    width: 1.5rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    color: var(--theme-accent-hi);
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
  }

  &__branch {
    color: var(--font-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__time-cost {
    color: var(--font-primary);
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__description {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.3;
    color: var(--font-secondary);
  }

  &__cost {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__cost-label {
    color: var(--font-muted);
    text-transform: uppercase;
    font-size: 0.875rem;
    font-weight: 600;
  }

  &__cost-row {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__cost-money {
    display: flex;
    align-items: center;
    gap: 0.25rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }

  &__cost-value {
    &_not-enough {
      color: var(--status-error);
    }
  }

  &__research-button {
    width: 100%;
    flex-shrink: 0;
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    flex-grow: 1;
  }

  &__placeholder-icon {
    display: flex;

    svg {
      width: 2rem;
      height: 2rem;
    }
  }

  &__placeholder-advice {
    color: var(--font-primary);
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
  }
}
</style>
