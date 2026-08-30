<template>
  <div v-bind="$attrs" class="building-card">
    <div class="building-card__icon"><Building color="var(--font-primary)" :size="24" /></div>
    <div class="building-card__text">{{ building.name }}</div>
    <div class="building-card__lvl">Ур. {{ building.level }}</div>
  </div>
</template>

<script lang="ts" setup>
import type { BaseBuilding } from "@/api/generated/types";
import { Building } from "@lucide/vue";

interface Props {
  building: BaseBuilding;
}

const { building } = defineProps<Props>();
</script>

<style lang="scss" scoped>
.building-card {
  width: 140px;
  height: 112px;
  border-radius: 18px;
  background-color: var(--theme-fill);
  border: 1px solid var(--theme-stroke);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    border-radius: 14px;
  }

  &__text {
    font-size: 11px;
    font-weight: 500;
    line-height: 120%;
    height: 28px;
    display: flex;
    align-items: center;
  }

  &__lvl {
    font-size: 10px;
    color: var(--font-secondary);
  }
}
</style>
