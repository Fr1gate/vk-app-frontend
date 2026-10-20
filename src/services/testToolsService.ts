import { api } from "@/api";
import { researchService } from "@/services/researchService";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";

async function refreshAfterAction(): Promise<void> {
  const baseStore = usePlayerBaseStore();
  await Promise.all([baseStore.refresh(), researchService.load()]);
}

export const testToolsService = {
  async isEnabled(): Promise<boolean> {
    try {
      const { data } = await api.test.statusList();
      return data.enabled;
    } catch {
      return false;
    }
  },

  async addResources(resourceId: string, amount: number): Promise<void> {
    const baseStore = usePlayerBaseStore();
    await api.test.resourcesCreate({
      site_id: baseStore.base?.site_id,
      resource_id: resourceId,
      amount,
    });
    await refreshAfterAction();
  },

  async addMoney(amount: number): Promise<void> {
    const baseStore = usePlayerBaseStore();
    await api.test.moneyCreate({ amount, site_id: baseStore.base?.site_id });
    await refreshAfterAction();
  },

  async finishTimers(): Promise<void> {
    const baseStore = usePlayerBaseStore();
    await api.test.finishTimersCreate({ site_id: baseStore.base?.site_id });
    await refreshAfterAction();
  },

  async resetProgress(): Promise<void> {
    const baseStore = usePlayerBaseStore();
    await api.test.resetCreate({ site_id: baseStore.base?.site_id });
    await refreshAfterAction();
  },
};
