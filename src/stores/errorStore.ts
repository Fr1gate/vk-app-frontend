import { ROUTES_NAMES } from "@/constants/RoutesNames";
import router from "@/router";
import { isAxiosError, isCancel } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useToastStore } from "./toastStore";

export const useErrorStore = defineStore("error", () => {
  const storedError = ref<null | unknown>(null);

  function handleError(error: unknown) {
    if (isCancel(error)) return;

    if (isAxiosError(error) && !error.response) {
      useToastStore().show("Нет соединения с сервером. Проверьте интернет и попробуйте ещё раз.");
      return;
    }

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
