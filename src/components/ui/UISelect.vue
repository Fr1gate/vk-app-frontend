<template>
  <UIDropdown>
    <template #button>
      <div class="select">
        <img v-if="selectedOption?.image" :src="selectedOption.image" alt="" class="select__image" />
        <component
          :is="selectedOption.icon"
          v-else-if="selectedOption?.icon"
          :size="16"
          :color="selectedOption.iconColor ?? 'var(--theme-accent)'"
          :fill="selectedOption.iconColor ?? 'none'"
        />
        <div class="select__value">{{ selectedOption?.label }}</div>
        <ChevronDown :size="14" color="var(--theme-accent)" />
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
            :size="16"
            :color="option.iconColor ?? 'var(--theme-accent)'"
            :fill="option.iconColor ?? 'none'"
          />
          <div class="select__item-label">{{ option.label }}</div>
          <Check v-if="option.id === model" :size="14" color="var(--theme-accent)" />
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
  options: { id: TId; label: string; icon?: Component; iconColor?: string; image?: string }[];
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
  font-size: 14px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 8px;
  gap: 8px;

  @include mixins.button-states;

  &__value {
    min-width: 60px;
  }

  &__image {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: block;
  }

  &__content {
    background-color: var(--bg-overlay);
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

  &__item-label {
    flex-grow: 1;
  }
}
</style>
