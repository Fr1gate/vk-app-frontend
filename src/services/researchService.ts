import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { useResearchStore } from "@/stores/researchStore";

const COMPLETION_REFRESH_DELAY_MS = 1_000;

let completionTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleCompletionRefresh(): void {
  const researchStore = useResearchStore();
  const baseStore = usePlayerBaseStore();

  clearTimeout(completionTimer);

  const completes = researchStore.activeResearch
    .map((item) => new Date(item.completes_at).getTime())
    .filter((time) => time > Date.now());
  if (!completes.length) return;

  const delay = Math.min(...completes) - Date.now() + COMPLETION_REFRESH_DELAY_MS;
  completionTimer = setTimeout(async () => {
    await researchStore.loadData();
    scheduleCompletionRefresh();
    await baseStore.refresh();
  }, Math.min(delay, 2_147_483_647));
}

export const researchService = {
  async load(): Promise<void> {
    await useResearchStore().loadData();
    scheduleCompletionRefresh();
  },

  async start(techId: string, siteId?: string): Promise<void> {
    await useResearchStore().startResearch(techId, siteId);
    await useResearchStore().loadData();
    scheduleCompletionRefresh();
    await usePlayerBaseStore().refresh();
  },
};
