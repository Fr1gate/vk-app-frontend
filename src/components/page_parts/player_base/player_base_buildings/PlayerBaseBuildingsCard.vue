<template>
  <div v-bind="$attrs" class="building-card">
    <div class="building-card__tile">
      <Component :is="icon" color="var(--font-primary)" />
      <div v-if="!building.will_upgrade_at" class="building-card__pill"><ArrowUp color="#101318" /></div>
    </div>
    <div class="building-card__name">{{ building.name }}</div>
    <div v-if="!building.will_upgrade_at" class="building-card__lvl">Ур. {{ building.level }}</div>
    <div v-else class="building-card__progress">
      <div class="building-card__time">{{ countdownString }}</div>
      <UIProgressBar class="building-card__bar" :percent="remainingPercent" color="var(--theme-accent)" />
      <div class="building-card__lvl">Ур. {{ building.level + 1 }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { BaseBuilding } from "@/api/generated/types";
import UIProgressBar from "@/components/ui/UIProgressBar.vue";
import { getBuildingIconComponent } from "@/constants/BuildingIcon";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { ArrowUp } from "@lucide/vue";
import { computed, onUnmounted, ref, watch } from "vue";

const TIMER_UPDATE_INTERVAL = 200;

interface Props {
  building: BaseBuilding;
}

const { building } = defineProps<Props>();

const baseStore = usePlayerBaseStore();
const icon = computed(() => getBuildingIconComponent(building.kind));

const now = ref(Date.now());
const timer = ref<ReturnType<typeof setInterval>>();

watch(
  () => building.will_upgrade_at,
  (willUpgradeAt) => {
    clearInterval(timer.value);
    timer.value = willUpgradeAt ? setInterval(() => (now.value = Date.now()), TIMER_UPDATE_INTERVAL) : undefined;
  },
  { immediate: true },
);

onUnmounted(() => clearInterval(timer.value));

const remainingMs = computed(() => new Date(building.will_upgrade_at!).getTime() - now.value);

const remainingPercent = computed(() => {
  const ms = baseStore.availableBuildings.find((item) => item.building_id === building.building_id)!.next_level_minutes * 60 * 1000;
  return (1 - remainingMs.value / ms) * 100;
});

const countdownString = computed(() => {
  const totalSeconds = Math.ceil(remainingMs.value / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
});
</script>

<style lang="scss" scoped>
@use "@/styles/mixins";

.building-card {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
  width: 12.25rem;
  padding: 0.375rem;
  justify-content: center;
  border-radius: 1.125rem;
  background: var(--theme-fill);
  border: 1px solid var(--theme-stroke);
  user-select: none;
  cursor: pointer;

  @include mixins.button-states;

  &__name {
    order: -1;
    flex-basis: 100%;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    hyphens: auto;
    overflow-wrap: anywhere;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.2;
  }

  &__tile {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.75rem;
    background: radial-gradient(var(--theme-grad-a), var(--theme-grad-b));
    border: 1px solid var(--theme-stroke);

    > svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  &__pill {
    position: absolute;
    top: -0.375rem;
    right: -0.3125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-pill);
    background: var(--theme-accent);
    box-shadow: 0 0 0.5rem var(--theme-accent-glow);

    svg {
      width: 0.875rem;
      height: 0.875rem;
    }
  }

  &__lvl {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--font-secondary);
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1 1 auto;
    min-width: 0;
  }

  &__time {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--font-secondary);
    font-variant-numeric: tabular-nums;
  }

  &__bar {
    flex: 1 1 auto;
    min-width: 0;
  }
}

@media (min-height: 450px) {
  .building-card {
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    gap: 0.5rem;
    width: 9.5rem;
    min-height: 9.25rem;
    padding: 0.5rem;

    &__name {
      order: 0;
      flex-basis: auto;
      width: 100%;
      height: auto;
      min-height: 2.5rem;
      justify-content: center;
      text-align: center;
    }

    &__tile {
      width: 3.5rem;
      height: 3.5rem;

      > svg {
        width: 2rem;
        height: 2rem;
      }
    }

    &__progress {
      width: 100%;
      flex: 0 0 auto;
    }
  }
}
</style>
