<template>
  <div class="player-base-header__wrapper">
    <div class="player-base-header">
      <div class="player-base-header__left">
        <PlayerBaseBasesSelector />
      </div>
      <UIDropdown align="center">
        <template #button>
          <div class="player-base-header__center">
            <div class="player-base-header__resource">
              <div class="player-base-header__resource-icon">
                <RussianRuble color="var(--theme-accent)" />
              </div>
              <div class="player-base-header__resource-value">{{ moneyStr }}</div>
            </div>
            <div class="player-base-header__resource">
              <div class="player-base-header__resource-icon">
                <Droplets color="var(--theme-accent)" />
              </div>
              <div class="player-base-header__resource-value">{{ fuelStr }} т</div>
            </div>
            <div class="player-base-header__resource">
              <div class="player-base-header__resource-icon">
                <Zap color="var(--theme-accent)" />
              </div>
              <div class="player-base-header__resource-value">{{ energyStr }} МВт</div>
            </div>
          </div>
        </template>
        <template #content>
          <PlayerBaseResources />
        </template>
      </UIDropdown>
      <div class="player-base-header__right">
        <button class="player-base-header__fullscreen" @click="handleFullscreen">
          <Minimize2 v-if="isFullscreen" color="var(--theme-accent)" />
          <Maximize2 v-else color="var(--theme-accent)" />
        </button>
        <PlayerBaseShipsSelector />
      </div>
    </div>
    <div class="player-base-header__sub-menu">
      <router-link
        :to="{
          name: ROUTES_NAMES.PLAYER_BASE.HOME.BUILDINGS,
        }"
        class="player-base-header__sub-menu-item"
        >База</router-link
      >
      <router-link
        :to="{
          name: ROUTES_NAMES.PLAYER_BASE.HOME.RESEARCH,
        }"
        class="player-base-header__sub-menu-item"
        >Исследования</router-link
      >
      <div class="player-base-header__sub-menu-item">Рынок</div>
      <div class="player-base-header__sub-menu-item">Контракты</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Maximize2, Minimize2, RussianRuble, Droplets, Zap } from "@lucide/vue";
import PlayerBaseShipsSelector from "./PlayerBaseShipsSelector.vue";
import PlayerBaseBasesSelector from "./PlayerBaseBasesSelector.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import UIDropdown from "@/components/ui/UIDropdown.vue";
import PlayerBaseResources from "./PlayerBaseResources.vue";
import { isFullscreenActive, toggleFullscreen } from "@/services/fullscreen";
import { ROUTES_NAMES } from "@/constants/RoutesNames.ts";

interface Props {
  money: number;
  fuel: number;
  energy: number;
}

const props = defineProps<Props>();

const isFullscreen = ref(isFullscreenActive());

function handleFullscreenChange() {
  isFullscreen.value = isFullscreenActive();
}

function handleFullscreen() {
  void toggleFullscreen();
}

onMounted(() => document.addEventListener("fullscreenchange", handleFullscreenChange));
onUnmounted(() => document.removeEventListener("fullscreenchange", handleFullscreenChange));

const moneyStr = computed(() => {
  return new Intl.NumberFormat("ru-RU", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(props.money);
});
const fuelStr = computed(() => {
  return new Intl.NumberFormat("ru-RU", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(props.fuel);
});
const energyStr = computed(() => {
  return new Intl.NumberFormat("ru-RU", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(props.energy);
});
</script>

<style lang="scss" scoped>
.player-base-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  background-color: var(--theme-fill);
  box-sizing: border-box;
  height: 3.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 3rem;
  border-bottom: 1px solid var(--theme-accent);

  &__wrapper {
    z-index: 2;
  }

  &__center {
    display: flex;
    align-items: center;
    height: 2.5rem;
  }

  &__left,
  &__right {
    display: flex;
  }

  &__right {
    justify-content: end;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__fullscreen {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    border: 1px solid var(--theme-stroke);
    border-radius: 0.75rem;
    background: var(--theme-active);
    cursor: pointer;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &__resource {
    display: flex;
    align-items: center;
    padding-inline: 1.25rem;
    height: 1rem;
    font-size: var(--font-md);

    &:not(:last-child) {
      border-right: 1px solid var(--theme-stroke);
    }

    &-icon {
      margin-right: 0.25rem;
      display: flex;

      svg {
        width: 1rem;
        height: 1rem;
      }
    }
  }

  &__sub-menu {
    background: linear-gradient(#0a0c12d9, #0a0c1200);
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2.25rem;
  }

  &__sub-menu-item {
    font-size: var(--font-md);
    color: var(--font-primary);
    cursor: pointer;
    user-select: none;
    padding: 0.25rem 0.5rem;
    border-bottom: var(--stroke-thick) solid transparent;
    text-decoration: none;

    &.router-link-active {
      color: var(--theme-accent);
    }

    &:hover {
      color: var(--theme-accent);
      border-bottom: var(--stroke-thick) solid var(--theme-accent);
    }
  }
}
</style>
