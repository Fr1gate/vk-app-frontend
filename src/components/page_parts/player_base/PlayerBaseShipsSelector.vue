<template>
  <UIDropdown>
    <template #button>
      <div class="ship-selector">
        <Rocket color="var(--theme-accent)" />
        Корабли
        <div class="ship-selector__number">150</div>
      </div>
    </template>
    <template #content>
      <div class="ship-selector__content">
        <div class="ship-selector__item" :class="{ 'ship-selector__item_active': true }">
          <div class="ship-selector__item-icon">
            <Ship />
          </div>
          <div class="ship-selector__item-text">Titanic</div>
        </div>
        <div class="ship-selector__item" :class="{ 'ship-selector__item': false }">
          <div class="ship-selector__item-icon">
            <Ship />
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
  @include mixins.gradient-border(var(--theme-fill), var(--theme-stroke));
  display: flex;
  align-items: center;
  font-size: var(--font-md);
  font-weight: 500;
  padding: var(--space-2) var(--space-5);
  border-radius: 0.5rem;
  gap: var(--space-4);

  @include mixins.button-states;

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &__number {
    border-radius: var(--radius-pill);
    padding: 0.125rem 0.375rem;
    background-color: var(--theme-accent);
    color: var(--font-inverse);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: var(--font-sm);
  }

  &__content {
    background-color: var(--bg-overlay);
    padding: var(--space-3);
    border-radius: 0.75rem;
    border: 1px solid var(--theme-stroke);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  &__item {
    display: flex;
    align-items: center;
    font-size: var(--font-md);
    gap: var(--space-2);
    border-radius: 0.5rem;
    padding: var(--space-3) 0.625rem;

    &_active,
    &:hover {
      background-color: var(--theme-active);
    }
  }
}
</style>
