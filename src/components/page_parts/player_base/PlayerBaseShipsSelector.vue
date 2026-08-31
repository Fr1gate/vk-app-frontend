<template>
  <UIDropdown>
    <template #button>
      <div class="ship-selector">
        <Rocket :size="16" color="var(--theme-accent)" />
        Корабли
        <div class="ship-selector__number">150</div>
      </div>
    </template>
    <template #content>
      <div class="ship-selector__content">
        <div class="ship-selector__item" :class="{ 'ship-selector__item_active': true }">
          <div class="ship-selector__item-icon">
            <Ship :size="16" />
          </div>
          <div class="ship-selector__item-text">Titanic</div>
        </div>
        <div class="ship-selector__item" :class="{ 'ship-selector__item': false }">
          <div class="ship-selector__item-icon">
            <Ship :size="16" />
          </div>
          <div class="ship-selector__item-text">Titanic</div>
        </div>
      </div>
    </template>
  </UIDropdown>
</template>

<script lang="ts" setup>
import UIDropdown from "@/components/ui/UIDropdown.vue";
import { Rocket, Ship } from "@lucide/vue";

//
</script>

<style lang="scss" scoped>
@use "@/styles/mixins";

.ship-selector {
  @include mixins.gradient-border(var(--theme-active), var(--gradient-accent));
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 12px;
  box-shadow: 0 0 10px var(--theme-accent-glow);
  border-radius: 8px;
  gap: 8px;

  &__number {
    border-radius: 999px;
    padding: 2px 6px;
    background-color: var(--theme-accent);
    color: var(--font-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
  }

  &__content {
    background-color: var(--bg-overlay);
    border: var(--theme-stroke);
    padding: 6px;
    border-radius: 12px;
    border: 1px solid var(--theme-stroke);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 4px;
    border-radius: 8px;
    padding: 6px 10px;

    &_active,
    &:hover {
      background-color: var(--theme-active);
    }
  }
}
</style>
