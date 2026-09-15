import { api, type ApiData } from "@/api";
import type { ResourceKind } from "@/constants/ResourceIcon";
import { defineStore } from "pinia";
import { computed, ref, shallowRef, watch } from "vue";

export type PlayerBase = ApiData<["bases", "basesDetail"]>;

/** Юнион id точек высадки из сгенерированного API (enum в схеме бекенда). */
export type SiteId = Parameters<typeof api.bases.basesDetail>[0];

export const HOME_SITE_ID: SiteId = "site_earth";

export const usePlayerBaseStore = defineStore("playerBase", () => {
  const bases = shallowRef<Record<string, PlayerBase>>({});
  const activeSiteId = ref<SiteId>(HOME_SITE_ID);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const inflight = new Map<string, Promise<PlayerBase | null>>();

  const base = computed(() => bases.value[activeSiteId.value] ?? null);

  async function loadBase(siteId: SiteId = activeSiteId.value, force = false): Promise<PlayerBase | null> {
    if (!force && bases.value[siteId]) return bases.value[siteId];
    const pending = inflight.get(siteId);
    if (pending) return pending;

    isLoading.value = true;
    error.value = null;
    const request = api.bases
      .basesDetail(siteId)
      .then(({ data }) => {
        bases.value = { ...bases.value, [siteId]: data };
        return data;
      })
      .catch(() => {
        error.value = "Не удалось загрузить базу";
        return null;
      })
      .finally(() => {
        isLoading.value = false;
        inflight.delete(siteId);
      });

    inflight.set(siteId, request);
    return request;
  }

  const refresh = (siteId: SiteId = activeSiteId.value) => loadBase(siteId, true);

  const isInitialLoading = computed(() => isLoading.value && !base.value);

  //  Ресурсы
  const resources = computed(() => base.value?.resources ?? {});
  const fuel = computed(() => base.value?.fuel ?? {});
  const money = computed(() => resources.value["res_money"] ?? 0);
  const fuelTotal = computed(() => Object.values(fuel.value).reduce((sum, amount) => sum + amount, 0));
  const powerBalance = computed(() => {
    const power = base.value?.production.power;
    return power ? power.generation_per_hour - power.demand_per_hour : 0;
  });

  const getResourceAmount = (resourceId: string) => resources.value[resourceId] ?? fuel.value[resourceId] ?? 0;

  /** Оптимистичное списание/начисление — после действий, до ответа refresh. */
  function applyResourceDelta(delta: Record<string, number>, siteId: string = activeSiteId.value) {
    const current = bases.value[siteId];
    if (!current) return;
    const next = { ...current.resources };
    for (const [resourceId, amount] of Object.entries(delta)) {
      next[resourceId] = (next[resourceId] ?? 0) + amount;
    }
    bases.value = { ...bases.value, [siteId]: { ...current, resources: next } };
  }

  // --- Тип ресурса (для иконок и группировки) ---
  const getResourceKind = (resourceId: string): ResourceKind => {
    if (resourceId === "res_money") return "abstract";
    return (base.value?.storage.resource_phase_here[resourceId] ?? "solid") as ResourceKind;
  };

  // --- Здания ---
  const buildings = computed(() => base.value?.buildings ?? []);
  const availableBuildings = computed(() => base.value?.buildings_available ?? []);

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

  return {
    bases,
    activeSiteId,
    base,
    isLoading,
    isInitialLoading,
    error,
    loadBase,
    refresh,
    resources,
    fuel,
    money,
    fuelTotal,
    powerBalance,
    getResourceAmount,
    applyResourceDelta,
    getResourceKind,
    buildings,
    availableBuildings,
  };
});
