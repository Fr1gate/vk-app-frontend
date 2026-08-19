<template>
  <button class="button"><slot /></button>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
/* Кнопка — Button/Primary из дизайна */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px; /* $--space-4 */
  padding: 8px 16px; /* $--space-4 $--space-6 */
  border-radius: var(--radius-md);
  border: 2px solid transparent; /* $--stroke-thick */
  background:
    linear-gradient(var(--bg-surface), var(--bg-surface)) padding-box,
    linear-gradient(
        180deg,
        var(--accent-200) 0%,
        var(--accent-100) 35%,
        var(--accent-200) 55%,
        var(--accent-300) 85%,
        var(--accent-200) 100%
      )
      border-box;
  font-family: var(--font-family);
  font-size: var(--font-md);
  font-weight: 600;
  color: var(--font-primary);
  cursor: pointer;
  user-select: none;
}

/* --- Hover: бордер светлеет --- */
.button:hover:not(:disabled) {
  background:
    linear-gradient(var(--bg-surface), var(--bg-surface)) padding-box,
    linear-gradient(
        180deg,
        var(--accent-100) 0%,
        var(--accent-100) 35%,
        var(--accent-200) 55%,
        var(--accent-200) 85%,
        var(--accent-100) 100%
      )
      border-box;
}

/* --- Active (нажатие): затемнение + лёгкий сдвиг --- */
.button:active:not(:disabled) {
  background:
    linear-gradient(var(--bg-base), var(--bg-base)) padding-box,
    linear-gradient(
        180deg,
        var(--accent-300) 0%,
        var(--accent-200) 35%,
        var(--accent-300) 55%,
        var(--accent-300) 85%,
        var(--accent-200) 100%
      )
      border-box;
  transform: translateY(1px);
}

/* --- Focus (клавиатура): акцентное кольцо --- */
.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-200) 45%, transparent);
}

/* --- Disabled --- */
.button:disabled {
  color: var(--font-disabled);
  cursor: not-allowed;
  background:
    linear-gradient(var(--bg-surface), var(--bg-surface)) padding-box,
    linear-gradient(180deg, var(--silver-700) 0%, var(--silver-700) 100%) border-box;
}
</style>
