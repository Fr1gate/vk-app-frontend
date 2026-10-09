<template>
  <div class="tech-details">
    <div v-if="selectedTech" class="tech-details__tech-container">
      <div class="tech-details__name">{{ selectedTech.name }}</div>
      <div class="tech-details__info-row">
        <div class="tech-details__code">{{ selectedTech.code }}</div>
        <div class="tech-details__branch">{{ researchStore.getBranchName(selectedTech.branch_id) }}</div>
        <div class="tech-details__time-cost">{{ selectedTech.cost.hours }} ч</div>
      </div>
      <div class="tech-details__description">{{ selectedTech.description }}</div>
      <div class="tech-details__cost">
        <div class="tech-details__cost-label">Стоимость</div>
        <div class="tech-details__cost-row"><RussianRuble :size="16" />{{ formatAmount(selectedTech.cost.money) }}</div>
        <template v-if="selectedTech.cost.materials">
          <div v-for="[material, cost] in Object.entries(selectedTech.cost.materials)" :key="material" class="tech-details__cost-row">
            <div class="tech-details__cost-name">{{ getMaterialName(material) }}</div>
            <div class="tech-details__cost-value">{{ formatAmount(cost) }}</div>
          </div>
        </template>
      </div>
    </div>
    <div v-else class="tech-details__placeholder">
      <div class="tech-details__placeholder-icon">
        <FlaskConical :size="34" color="var(--theme-accent)" />
      </div>
      <div class="tech-details__placeholder-advice">Выберите технологию</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Technology } from "@/api/generated/types";
import { useGameDictionaryStore } from "@/stores/gameDictionaryStore";
import { useResearchStore } from "@/stores/researchStore";
import { formatAmount } from "@/utils/formatAmount";
import { FlaskConical, RussianRuble } from "@lucide/vue";

type TechWithPosition = Technology & { row: number; column: number };

interface Props {
  selectedTech: TechWithPosition | null;
}

const { selectedTech } = defineProps<Props>();

const dictionary = useGameDictionaryStore();
const researchStore = useResearchStore();

function getMaterialName(key: string) {
  return dictionary.getResourceName(key);
}
</script>

<style lang="scss" scoped>
.tech-details {
  width: 270px;
  border: 1px solid var(--theme-stroke);
  border-radius: 12px;
  background-color: var(--theme-surface);
  height: 100%;
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding: 12px;

  &__tech-container {
    display: flex;
    flex-direction: column;
  }

  &__name {
    color: var(--font-primary);
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  &__code {
    background-color: var(--theme-accent-deep);
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    color: var(--theme-accent-hi);
    font-size: 10px;
    font-weight: 700;
  }

  &__branch {
    color: var(--font-secondary);
    font-size: 11px;
    font-weight: 500;
  }

  &__time-cost {
    color: var(--font-primary);
    font-size: 11px;
    font-weight: 600;
  }

  &__description {
    border-bottom: 1px solid var(--theme-stroke);
    padding-bottom: 4px;
    margin-bottom: 4px;
    font-size: 11px;
    font-weight: 500;
    color: var(--font-secondary);
  }

  &__cost {
    //
  }

  &__cost-label {
    color: var(--font-muted);
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__cost-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
  }

  &__cost-name {
    //
  }

  &__cost-value {
    //
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  &__placeholder-icon {
    display: flex;
    margin-bottom: 24px;
  }

  &__placeholder-advice {
    color: var(--font-primary);
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
