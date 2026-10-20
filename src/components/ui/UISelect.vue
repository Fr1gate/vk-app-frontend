<template>
  <UIDropdown>
    <template #button>
      <div class="select">
        <img v-if="selectedOption?.image" :src="selectedOption.image" alt="" class="select__image" />
        <component
          :is="selectedOption.icon"
          v-else-if="selectedOption?.icon"
          :color="selectedOption.iconColor ?? 'var(--theme-accent)'"
          :fill="selectedOption.iconFill ?? 'none'"
        />
        <div class="select__value">{{ selectedOption?.label }}</div>
        <ChevronDown color="var(--theme-accent)" />
      </div>
    </template>
    <template #content="{ close }">
      <div class="select__content">
        <div
          v-for="option in options"
          :key="option.id"
          class="select__item"
          :class="{ 'select__item_active': option.id === model }"
          @click="select(option.id, close)"
        >
          <img v-if="option.image" :src="option.image" alt="" class="select__image" />
          <component
            :is="option.icon"
            v-else-if="option.icon"
            :color="option.iconColor ?? 'var(--theme-accent)'"
            :fill="option.iconFill ?? 'none'"
          />
          <div class="select__item-label">{{ option.label }}</div>
          <Check v-if="option.id === model" color="var(--theme-accent)" />
        </div>
      </div>
    </template>
  </UIDropdown>
</template>

<script lang="ts" setup generic="TId extends string">
import UIDropdown from "@/components/ui/UIDropdown.vue";
import { Check, ChevronDown } from "@lucide/vue";
import { computed, type Component } from "vue";

const { options } = defineProps<{
  options: { id: TId; label: string; icon?: Component; iconColor?: string; iconFill?: string; image?: string }[];
}>();

const model = defineModel<TId>();

const selectedOption = computed(() => options.find((option) => option.id === model.value));

function select(id: TId, close: () => void) {
  model.value = id;
  close();
}
</script>

<style lang="scss" scoped>
@use "@/styles/mixins";

.select {
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

  &__value {
    min-width: 3.75rem;
  }

  &__image {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    display: block;
  }

  &__content {
    background-color: var(--bg-overlay);
    padding: var(--space-3);
    border-radius: 0.75rem;
    border: 1px solid var(--theme-stroke);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    min-width: 11.25rem;
  }

  &__item {
    display: flex;
    align-items: center;
    font-size: var(--font-md);
    gap: var(--space-4);
    border-radius: 0.5rem;
    padding: var(--space-3) 0.625rem;
    cursor: pointer;

    &_active,
    &:hover {
      background-color: var(--theme-active);
    }
  }

  &__item-label {
    flex-grow: 1;
  }
}
</style>
