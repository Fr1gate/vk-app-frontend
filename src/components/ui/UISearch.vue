<template>
  <div ref="root" class="ui-search">
    <div class="ui-search__field">
      <Search class="ui-search__icon" />
      <input v-model="query" class="ui-search__input" :placeholder="placeholder" @focus="isOpen = true" />
    </div>
    <div v-if="isOpen" class="ui-search__results">
      <button
        v-for="item in filteredItems"
        :key="item.id"
        type="button"
        class="ui-search__result"
        @mousedown.prevent="select(item.id)"
      >
        <slot name="option" :item="item">{{ item.label }}</slot>
      </button>
      <div v-if="filteredItems.length === 0" class="ui-search__empty">{{ emptyText }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { Search } from "@lucide/vue";
import { computed, ref, useTemplateRef } from "vue";

export interface UISearchItem {
  id: string;
  label: string;
}

interface Props {
  items: UISearchItem[];
  placeholder?: string;
  emptyText?: string;
}

const { items, placeholder = "Поиск", emptyText = "Ничего не найдено" } = defineProps<Props>();
const emit = defineEmits<{ select: [id: string] }>();

const root = useTemplateRef("root");
const query = ref("");
const isOpen = ref(false);

const filteredItems = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  if (!normalizedQuery) return items;
  return items.filter((item) => item.label.toLowerCase().includes(normalizedQuery));
});

onClickOutside(root, () => {
  isOpen.value = false;
  query.value = "";
});

function select(id: string) {
  emit("select", id);
  isOpen.value = false;
  query.value = "";
}
</script>

<style lang="scss" scoped>
.ui-search {
  position: relative;
  width: 15rem;
  max-width: calc(100vw - 2rem);

  &__field {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    height: 2rem;
    padding: 0 0.5rem;
    background: var(--theme-surface);
    border: 1px solid var(--theme-stroke);
    border-radius: var(--radius-md);
    backdrop-filter: blur(0.75rem);
  }

  &__icon {
    width: 0.875rem;
    height: 0.875rem;
    flex-shrink: 0;
    color: var(--font-secondary);
  }

  &__input {
    width: 100%;
    min-width: 0;
    border: none;
    outline: none;
    background: none;
    color: var(--font-primary);
    font-family: var(--font-family);
    font-size: var(--font-md);
    font-weight: 500;

    &::placeholder {
      color: var(--font-muted);
    }
  }

  &__results {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    max-height: 14rem;
    padding: 0.25rem;
    overflow-y: auto;
    background: var(--bg-elevated);
    border: 1px solid var(--theme-stroke);
    border-radius: var(--radius-md);
    box-shadow: 0 0.25rem 0.75rem #00000080;
  }

  &__result {
    padding: 0.375rem 0.5rem;
    border: none;
    border-radius: var(--radius-sm);
    background: none;
    color: var(--font-primary);
    font-family: var(--font-family);
    font-size: var(--font-md);
    font-weight: 500;
    text-align: left;
    cursor: pointer;

    &:hover {
      background: var(--theme-active);
      color: var(--theme-accent-hi);
    }
  }

  &__empty {
    padding: 0.375rem 0.5rem;
    color: var(--font-muted);
    font-size: var(--font-md);
  }
}
</style>
