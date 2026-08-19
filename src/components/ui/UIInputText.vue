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
/* Input — вертикальная колонка: label / field / helper */
.input {
  display: flex;
  flex-direction: column;
  gap: 6px; /* $--space-3 */
}

.input__label {
  font-family: "Inter";
  font-size: 12px; /* $--font-sm */
  font-weight: 500;
  color: #a0a3ad; /* $--font-secondary */
}

.input__field {
  color: var(--font-primary);
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background:
    linear-gradient(#0b0c12, #0b0c12) padding-box,
    linear-gradient(180deg, #dbdee6 0%, #fafafc 35%, #dbdee6 55%, #4d4f5c 85%, #dbdee6 100%) border-box;

  &:focus {
    outline: none;
  }
  &:active {
    outline: none;
  }
}

.input__helper {
  font-family: "Inter";
  font-size: 10px; /* $--font-xs */
  color: #696c76; /* $--font-muted */
}

/* --- Placeholder (состояние Empty) --- */
.input__field::placeholder {
  color: var(--font-muted);
}

// /* --- Focus (акцентный бордер из дизайна) --- */
// .input__field:focus {
//   background:
//     linear-gradient(var(--bg-deep), var(--bg-deep)) padding-box,
//     linear-gradient(180deg, var(--accent-100) 0%, var(--accent-300) 50%, var(--accent-100) 100%) border-box;
// }
/* --- Focus (акцентный бордер из дизайна) --- */
.input__field:focus {
  background:
    linear-gradient(var(--bg-deep), var(--bg-deep)) padding-box,
    var(--accent-100) border-box;
}

/* --- Disabled --- */
.input__field:disabled {
  color: var(--font-disabled);
  background:
    linear-gradient(var(--bg-base), var(--bg-base)) padding-box,
    var(--silver-800) border-box;
  cursor: not-allowed;
}

.input__field:disabled::placeholder {
  color: var(--font-disabled);
}

/* --- Error (модификаторы: класс на поле/хелпер) --- */
.input__field_error {
  background:
    linear-gradient(var(--bg-deep), var(--bg-deep)) padding-box,
    linear-gradient(180deg, var(--status-error) 0%, var(--status-error) 100%) border-box;
}

.input__helper_error {
  color: var(--status-error);
}
</style>
