import { api, type ApiData } from "@/api";
import type { ResourceKind } from "@/constants/ResourceIcon";
import { defineStore } from "pinia";
import { computed, ref, shallowRef, watch } from "vue";
import { useGameDictionaryStore } from "./gameDictionaryStore";

export type PlayerBase = ApiData<["bases", "basesDetail"]>;

/** Юнион id точек высадки из сгенерированного API (enum в схеме бекенда). */
export type SiteId = Parameters<typeof api.bases.basesDetail>[0];

export const HOME_SITE_ID: SiteId = "site_earth";

export interface ResourceItem {
  id: string;
  name: string;
  amount: number;
}

const EMPTY_STORAGE = {
  solid: { used: 0, capacity: 0 },
  liquid: { used: 0, capacity: 0 },
  gas: { used: 0, capacity: 0 },
};

export const usePlayerBaseStore = defineStore("playerBase", () => {
  const dictionary = useGameDictionaryStore();

  const bases = shallowRef<Record<string, PlayerBase>>({});
  const activeSiteId = ref<SiteId>(HOME_SITE_ID);
  const isLoading = ref(false);
  const inflight = new Map<string, Promise<PlayerBase | null>>();

  const base = computed(() => bases.value[activeSiteId.value] ?? null);

  async function loadBase(siteId: SiteId = activeSiteId.value, force = false): Promise<PlayerBase | null> {
    if (!force && bases.value[siteId]) return bases.value[siteId];
    const pending = inflight.get(siteId);
    if (pending) return pending;

    isLoading.value = true;
    const request = api.bases
      .basesDetail(siteId)
      .then(({ data }) => {
        bases.value = { ...bases.value, [siteId]: data };
        return data;
      })
      .catch(() => null)
      .finally(() => {
        isLoading.value = false;
        inflight.delete(siteId);
      });

    inflight.set(siteId, request);
    return request;
  }

  const refresh = (siteId: SiteId = activeSiteId.value) => loadBase(siteId, true);

  const isInitialLoading = computed(() => isLoading.value && !base.value);

  // --- Ресурсы ---
  // Бекенд отдаёт все ресурсы баланса (отсутствующие — нулями), поэтому
  // словари всегда полные; Record-тип здесь — чтобы не зависеть от перечисления
  // ключей в сгенерированных типах.
  const resources = computed<Record<string, number>>(() => base.value?.resources ?? {});
  const fuel = computed<Record<string, number>>(() => base.value?.fuel ?? {});
  const resourcesById = computed<Record<string, number>>(() => ({
    ...resources.value,
    ...fuel.value,
  }));

  const money = computed(() => resourcesById.value["res_money"] ?? 0);
  const fuelTotal = computed(() => Object.values(fuel.value).reduce((sum, amount) => sum + amount, 0));
  const powerBalance = computed(() => {
    const power = base.value?.production.power;
    return power ? power.generation_per_hour - power.demand_per_hour : 0;
  });

  const getResourceAmount = (resourceId: string) => resourcesById.value[resourceId] ?? 0;

  // --- Вместимость складов по фазам ---
  const storage = computed(() => base.value?.storage.phases ?? EMPTY_STORAGE);

  // --- Тип ресурса (для иконок и группировки) ---
  const getResourceKind = (resourceId: string): ResourceKind => {
    if (resourceId === "res_money") return "abstract";
    return (base.value?.storage.resource_phase_here[resourceId] ?? "solid") as ResourceKind;
  };

  // --- Ресурсы по фазам (для панели ресурсов) ---
  const resourcesByPhase = computed<Record<ResourceKind, ResourceItem[]>>(() => {
    const groups: Record<ResourceKind, ResourceItem[]> = {
      solid: [],
      liquid: [],
      gas: [],
      abstract: [],
    };
    for (const [id, amount] of Object.entries(resourcesById.value)) {
      groups[getResourceKind(id)].push({
        id,
        name: dictionary.getResourceName(id),
        amount,
      });
    }
    // Крупные запасы — сверху
    for (const list of Object.values(groups)) list.sort((a, b) => b.amount - a.amount);
    return groups;
  });

  // --- Здания ---
  const buildings = computed(() => base.value?.buildings ?? []);
  const availableBuildings = computed(() => base.value?.buildings_available ?? []);
  const buildingsInConstruction = computed(() => buildings.value.filter((b) => b.will_upgrade_at));

  // --- Авто-обновление по производственным циклам ---
  let cycleTimer: ReturnType<typeof setTimeout> | undefined;
  watch(base, (current) => {
    clearTimeout(cycleTimer);
    const nextAt = current?.production.next_cycle_at;
    if (!current || !nextAt) return;
    const delay = new Date(nextAt).getTime() - Date.now() + 1_000;
    if (delay <= 0) return;
    cycleTimer = setTimeout(() => void refresh(current.site_id as SiteId), Math.min(delay, 2_147_483_647));
  });

  let upgradeTimer: ReturnType<typeof setTimeout> | undefined;
  watch(buildings, (list) => {
    clearTimeout(upgradeTimer);
    const times = list
      .filter((b) => b.will_upgrade_at)
      .map((b) => new Date(b.will_upgrade_at!).getTime())
      .filter((time) => time > Date.now());
    if (!times.length) return;
    const delay = Math.min(...times) - Date.now() + 1_000;
    upgradeTimer = setTimeout(() => void refresh(), Math.min(delay, 2_147_483_647));
  });

  return {
    base,
    isInitialLoading,
    loadBase,
    refresh,
    money,
    fuelTotal,
    powerBalance,
    storage,
    getResourceAmount,
    getResourceKind,
    resourcesByPhase,
    buildings,
    availableBuildings,
    buildingsInConstruction,
  };
});
