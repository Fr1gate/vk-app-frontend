<template>
  <div class="techs-list">
    <div v-if="currentResearch" class="techs-list__group">
      <div class="techs-list__group-label">В работе</div>
      <div class="techs-list__current-tech" @click="selectedTech = currentResearch.id">
        <div class="techs-list__current-tech-head">
          <PlayerBaseResearchTechCode :code="currentResearch.code" />
          <div class="techs-list__current-tech-name">{{ currentResearch.name }}</div>
          <div class="techs-list__current-tech-branch">{{ researchStore.getBranchName(currentResearch.branch_id) }}</div>
        </div>
        <div class="techs-list__current-tech-progress">
          <UIProgressBar :percent="progressPercent" color="var(--theme-accent)" />
        </div>
        <div class="techs-list__current-tech-info">{{ Math.round(progressPercent) }}% · осталось {{ remainingString }}</div>
      </div>
    </div>
    <div class="techs-list__group">
      <div class="techs-list__group-label">Доступно сейчас · {{ unlockedTechs.length }}</div>
      <div class="techs-list__list">
        <div v-for="tech in unlockedTechs" :key="tech.id" class="techs-list__tech" @click="selectedTech = tech.id">
          <div class="techs-list__tech-left">
            <PlayerBaseResearchTechCode :code="tech.code" />
            <div class="techs-list__tech-name">{{ tech.name }}</div>
            <div class="techs-list__tech-branch">{{ researchStore.getBranchName(tech.branch_id) }}</div>
          </div>
          <div class="techs-list__tech-right">
            <div class="techs-list__tech-cost">{{ tech.cost.hours }} ч</div>
            <div class="techs-list__tech-cost">{{ formatAmount(tech.cost.money) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Technology } from "@/api/generated/types";
import UIProgressBar from "@/components/ui/UIProgressBar.vue";
import PlayerBaseResearchTechCode from "./PlayerBaseResearchTechCode.vue";
import { useResearchStore } from "@/stores/researchStore";
import { formatAmount } from "@/utils/formatAmount";
import { computed, onUnmounted, ref, watch } from "vue";

const TIMER_UPDATE_INTERVAL = 200;

const { techs } = defineProps<{
  techs: Record<string, Technology>;
}>();

const selectedTech = defineModel("selectedTech");

const researchStore = useResearchStore();

const currentResearch = computed(() => Object.values(techs).find((tech) => tech.status === "in_progress") ?? null);

const unlockedTechs = computed<Technology[]>(() => {
  return Object.values(techs).filter((curTech) => curTech.status === "available");
});

const now = ref(Date.now());
const timer = ref<ReturnType<typeof setInterval>>();

watch(
  () => currentResearch.value?.id,
  (techId) => {
    clearInterval(timer.value);
    timer.value = techId ? setInterval(() => (now.value = Date.now()), TIMER_UPDATE_INTERVAL) : undefined;
  },
  { immediate: true },
);

onUnmounted(() => clearInterval(timer.value));

const activeResearch = computed(() => researchStore.activeResearch.find((item) => item.tech_id === currentResearch.value?.id) ?? null);

const progressPercent = computed(() => {
  if (!activeResearch.value) return 0;
  const started = new Date(activeResearch.value.started_at).getTime();
  const completes = new Date(activeResearch.value.completes_at).getTime();
  if (completes <= started) return 100;
  return Math.min(100, Math.max(0, ((now.value - started) / (completes - started)) * 100));
});

const remainingString = computed(() => {
  if (!activeResearch.value) return "";
  const remainingMs = Math.max(0, new Date(activeResearch.value.completes_at).getTime() - now.value);
  const totalMinutes = Math.ceil(remainingMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}ч ${minutes}м` : `${minutes}м`;
});
</script>

<style lang="scss" scoped>
.techs-list {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-height: 0;
  padding-right: 0.375rem;

  &__group {
    display: flex;
    flex-direction: column;

    &:not(:last-child) {
      margin-bottom: 0.75rem;
    }
  }

  &__group-label {
    text-transform: uppercase;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: var(--font-muted);
  }

  &__current-tech {
    cursor: pointer;
    border: 1px solid var(--theme-stroke);
    background: var(--theme-surface);
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.75rem;
  }

  &__current-tech-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  &__current-tech-name {
    color: var(--font-primary);
    font-weight: 600;
    font-size: 1rem;
  }

  &__current-tech-branch {
    color: var(--font-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__current-tech-progress {
    margin-bottom: 0.5rem;
  }

  &__current-tech-info {
    color: var(--font-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__list {
    display: flex;
    flex-direction: column;
  }

  &__tech {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding-block: 0.25rem;
    padding-inline: 0.25rem;

    &:hover {
      background-color: var(--theme-accent-glow);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--theme-divider);
    }
  }

  &__tech-left {
    display: flex;
    gap: 0.5rem;
  }

  &__tech-name {
    color: var(--font-primary);
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }

  &__tech-branch {
    color: var(--font-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  &__tech-right {
    display: flex;
    color: var(--font-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__tech-cost {
    display: flex;
    &:not(:last-child) {
      &::after {
        content: "·";
        display: flex;
        margin-inline: 0.25rem;
      }
    }
  }
}
</style>
