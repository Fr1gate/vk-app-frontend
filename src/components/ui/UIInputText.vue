<template>
  <div class="input">
    <div v-if="label" class="input__label">{{ label }}</div>
    <input
      v-bind="$attrs"
      type="text"
      class="input__field"
      :class="{
        input__field_error: validation,
      }"
    />
    <div v-if="validation" class="input__helper">{{ validation }}</div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  label?: string;
  validation?: string[];
}

const { label, validation } = defineProps<Props>();
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-size: 12px;
    font-weight: 500;
    color: #a0a3ad;
  }

  &__field {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 8px 12px;
    border: 1px solid var(--theme-stroke);
    border-radius: var(--radius-md);
    background: var(--bg-deep);
    color: var(--font-primary);

    &_error {
      border-radius: var(--status-error);
      color: var(--status-error);
    }

    &::placeholder {
      color: var(--font-muted);
    }

    &:focus {
      border: 1px solid var(--theme-accent-hi);
    }
    &:disabled {
      color: var(--font-disabled);
      cursor: not-allowed;
      border-color: var(--silver-800);

      &::placeholder {
        color: var(--font-disabled);
      }
    }
  }

  &__helper {
    font-family: "Inter";
    font-size: 10px;
    color: #696c76;
  }
}
</style>
