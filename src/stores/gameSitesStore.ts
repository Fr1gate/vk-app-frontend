import { api, type ApiData } from "@/api";
import { defineStore } from "pinia";
import { computed } from "vue";
import { useStaticDataLoader } from "./store_composables/useStaticDataLoader";

export type Site = ApiData<["sites", "sitesList"]>[number];

/** Справочник точек высадки: имена, тела, факторы — грузится один раз. */
export const useGameSitesStore = defineStore("gameSites", () => {
  const {
    data: sites,
    isLoading,
    loadData,
  } = useStaticDataLoader<Site[]>(() => api.sites.sitesList().then(({ data }) => data));

  const siteById = computed(() => {
    const map: Record<string, Site> = {};
    for (const site of sites.value ?? []) {
      if (site.id) map[site.id] = site;
    }
    return map;
  });

  function getSiteName(id: string) {
    return siteById.value[id]?.name ?? id;
  }

  return { sites, isLoading, loadData, siteById, getSiteName };
});
