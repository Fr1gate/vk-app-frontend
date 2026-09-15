import { useGameDictionaryStore } from "@/stores/gameDictionaryStore";
import { useGameSitesStore } from "@/stores/gameSitesStore";

export const staticDataService = {
  async loadData(): Promise<void> {
    await Promise.all([useGameDictionaryStore().loadData(), useGameSitesStore().loadData()]);
  },
};
