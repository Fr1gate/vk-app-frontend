import { ROUTES_NAMES } from "@/constants/RoutesNames";
import router from "@/router";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
  const storedError = ref<null | unknown>(null);

  function handleError(error: unknown) {
    storedError.value = String(error);

    router.push({
      name: ROUTES_NAMES.SYSTEM.ERROR,
    });
  }

  return {
    storedError,
    handleError,
  };
});
