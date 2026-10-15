<template>
  <UISelect v-model="selectedTheme" :options="themeOptions" />
</template>

<script lang="ts" setup>
import UISelect from "@/components/ui/UISelect.vue";
import earthIcon from "@/assets/planets/earth.png";
import marsIcon from "@/assets/planets/mars.png";
import moonIcon from "@/assets/planets/mercury.png";
import { useThemeStore, type Themes } from "@/stores/themeStore";
import { computed } from "vue";

const themeStore = useThemeStore();

const themeOptions: { id: Themes; label: string; image: string }[] = [
  { id: "earth", label: "Земля", image: earthIcon },
  { id: "moon", label: "Луна", image: moonIcon },
  { id: "mars", label: "Марс", image: marsIcon },
];

const selectedTheme = computed({
  get: () => themeStore.currentTheme,
  set: (theme: Themes) => themeStore.setTheme(theme),
});
</script>
