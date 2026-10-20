import { defineStore } from "pinia";
import { ref } from "vue";

export interface Toast {
  id: number;
  message: string;
}

const DEFAULT_DURATION = 4_000;

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([]);
  let nextId = 1;

  function show(message: string, duration = DEFAULT_DURATION) {
    const id = nextId++;
    toasts.value.push({ id, message });
    setTimeout(() => hide(id), duration);
  }

  function hide(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  return {
    toasts,
    show,
    hide,
  };
});
