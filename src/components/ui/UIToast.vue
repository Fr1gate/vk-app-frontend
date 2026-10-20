<template>
  <Teleport to="body">
    <div class="toast-stack">
      <button
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        type="button"
        class="toast"
        @click="toastStore.hide(toast.id)"
      >
        <AlertCircle class="toast__icon" />
        <span class="toast__text">{{ toast.message }}</span>
      </button>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { useToastStore } from "@/stores/toastStore";
import { AlertCircle } from "@lucide/vue";

const toastStore = useToastStore();
</script>

<style lang="scss" scoped>
.toast-stack {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: max-content;
  max-width: calc(100vw - 2rem);
  transform: translateX(-50%);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--theme-stroke);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  color: var(--font-primary);
  font-family: var(--font-family);
  font-size: var(--font-md);
  font-weight: 500;
  text-align: left;
  box-shadow: 0 0.25rem 0.75rem #00000080;
  pointer-events: auto;
  cursor: pointer;

  &__icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    color: var(--status-warn);
  }

  &__text {
    min-width: 0;
  }
}
</style>
