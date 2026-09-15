<template>
  <UIDropdown>
    <template #button>
      <div class="bases-selector">
        <Earth :size="16" color="var(--theme-accent)" />
        Земля
        <ChevronDown :size="14" color="var(--theme-accent)" />
      </div>
    </template>
    <template #content>
      <div class="bases-selector__content">
        <div class="bases-selector__item" :class="{ 'bases-selector__item_active': true }">
          <div class="bases-selector__item-icon">
            <Earth :size="16" color="var(--theme-accent)" />
          </div>
          <div class="bases-selector__item-text">Земля</div>
          <div class="bases-selector__check-icon">
            <Check :size="14" color="var(--theme-accent)" />
          </div>
        </div>
        <div class="bases-selector__item" :class="{ 'bases-selector__item': false }">
          <div class="bases-selector__item-icon">
            <Moon :size="16" color="var(--theme-accent)" />
          </div>
          <div class="bases-selector__item-text">Moon</div>
        </div>
      </div>
    </template>
  </UIDropdown>
</template>

<script lang="ts" setup>
import UIDropdown from "@/components/ui/UIDropdown.vue";
import { Check, ChevronDown, Earth, Moon } from "@lucide/vue";

//
</script>

<style lang="scss" scoped>
@use "@/styles/mixins";

.bases-selector {
  @include mixins.gradient-border(var(--theme-fill), var(--theme-stroke));
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 8px;
  gap: 8px;

  @include mixins.button-states;

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
    min-width: 180px;
  }

  &__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 8px;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;

    &_active,
    &:hover {
      background-color: var(--theme-active);
    }
  }

  &__item-text {
    flex-grow: 1;
  }
}
</style>
