<template>
  <div class="space-tab">
    <SolarSystemMap />
  </div>
</template>

<script lang="ts" setup>
import SolarSystemMap from "@/components/page_parts/player_base/player_base_space/SolarSystemMap.vue";
import { useSpaceTime } from "@/components/page_parts/player_base/player_base_space/spaceTime";
import { useThemeStore, type Themes } from "@/stores/themeStore";
import { onBeforeUnmount, onMounted } from "vue";

const themeStore = useThemeStore();
const spaceTime = useSpaceTime();

let previousTheme: Themes = themeStore.currentTheme;

onMounted(() => {
  previousTheme = themeStore.currentTheme;
  themeStore.setTheme("moon");
});

onBeforeUnmount(() => {
  spaceTime.pause();
  themeStore.setTheme(previousTheme);
});
</script>

<style lang="scss" scoped>
.space-tab {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
}
</style>
