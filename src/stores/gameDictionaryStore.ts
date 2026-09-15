import { api, type ApiData } from "@/api";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useStaticDataLoader } from "./store_composables/useStaticDataLoader";

export type Dictionary = ApiData<["dictionary", "dictionaryList"]>;

export const useGameDictionaryStore = defineStore("gameDictionary", () => {
  const {
    data: dictionary,
    isLoading,
    loadData,
  } = useStaticDataLoader<Dictionary>(() => api.dictionary.dictionaryList().then(({ data }) => data));

  const resources = computed(() => dictionary.value?.resources);
  function getResourceName(id: string) {
    return resources.value?.[id]?.name ?? id;
  }

  return {
    isLoading,
    dictionary,
    getResourceName,
    loadData,
  };
});
