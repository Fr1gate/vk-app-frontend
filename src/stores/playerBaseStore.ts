import { defineStore } from "pinia";
import { ref } from "vue";

export type Themes = "earth" | "mars" | "moon";

export const usePlayerBaseStore = defineStore("playerBaseStore", () => {
  const currentTheme = ref<Themes>("earth");

  /*
    Teleported components
  */
  function setTheme(theme: Themes) {
    document.body.setAttribute("data-theme", theme);
  }

  return {
    currentTheme,
    setTheme,
  };
});
