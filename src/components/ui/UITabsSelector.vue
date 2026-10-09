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
  gap: 2px;
  background: var(--theme-fill);
  padding: 3px;
  border: 1px solid var(--theme-stroke);
  border-radius: 8px;

  &__option {
    font-size: 12px;
    color: var(--font-primary);
    padding: 4px 12px;
    border-radius: 6px;
    cursor: pointer;

    &_selected {
      background-color: var(--theme-accent-deep);
      color: var(--theme-accent-hi);
      cursor: default;
    }
  }
}
</style>
