import type { ApiData } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

type Player = ApiData<["auth", "loginCreate"]>["user"];

export const usePlayerStore = defineStore("player", () => {
  const player = ref<null | Player>(null);

  return { player };
});
