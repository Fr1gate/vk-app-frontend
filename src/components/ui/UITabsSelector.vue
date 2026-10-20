<template>
  <div class="tabs-selector">
    <div
      v-for="option in options"
      :key="option.id"
      class="tabs-selector__option"
      :class="{
        'tabs-selector__option_selected': selected === option.id,
      }"
      @click="handleClick(option.id)"
    >
      {{ option.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
type Option = {
  id: string;
  name: string;
};

interface Props {
  options: Option[];
}

const selected = defineModel("selected");
const { options } = defineProps<Props>();

function handleClick(id: string) {
  selected.value = id;
}
</script>

<style lang="scss" scoped>
.tabs-selector {
  display: flex;
  flex-grow: 0;
  gap: 0.125rem;
  background: var(--theme-fill);
  padding: 0.125rem;
  border: 1px solid var(--theme-stroke);
  border-radius: 0.5rem;

  &__option {
    font-size: 0.875rem;
    color: var(--font-primary);
    padding: 0.25rem 0.625rem;
    border-radius: 0.375rem;
    cursor: pointer;

    &_selected {
      background-color: var(--theme-accent-deep);
      color: var(--theme-accent-hi);
      cursor: default;
    }
  }
}
</style>
