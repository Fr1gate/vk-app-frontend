<template>
  <div class="player-base-header__wrapper">
    <div class="player-base-header" :class="{ 'player-base-header_empty-menu': !testToolsEnabled }">
      <div class="player-base-header__left">
        <UIDropdown align="left" :disabled="!testToolsEnabled">
          <template #button>
            <button class="player-base-header__avatar">
              <img v-if="playerStore.avatarUrl" class="player-base-header__avatar-image" :src="playerStore.avatarUrl" alt="" />
              <span v-else class="player-base-header__avatar-initials">{{ initials }}</span>
            </button>
          </template>
          <template #content="{ close }">
            <div v-if="testToolsEnabled" class="player-base-header__menu-panel">
              <button class="player-base-header__menu-item" @click="handleOpenTestTools(close)">
                <FlaskConical color="var(--theme-accent)" />
                <span>Инструменты тестирования</span>
              </button>
            </div>
          </template>
        </UIDropdown>
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
    <TestToolsModal ref="testToolsRef" />
  </div>
</template>

<script lang="ts" setup>
import { FlaskConical, RussianRuble, Droplets, Zap } from "@lucide/vue";
import PlayerBaseShipsSelector from "./PlayerBaseShipsSelector.vue";
import PlayerBaseBasesSelector from "./PlayerBaseBasesSelector.vue";
import TestToolsModal from "./TestToolsModal.vue";
import { onMounted, ref, useTemplateRef, computed } from "vue";
import UIDropdown from "@/components/ui/UIDropdown.vue";
import PlayerBaseResources from "./PlayerBaseResources.vue";
import { testToolsService } from "@/services/testToolsService";
import { usePlayerStore } from "@/stores/playerStore";
import { ROUTES_NAMES } from "@/constants/RoutesNames.ts";

interface Props {
  money: number;
  fuel: number;
  energy: number;
}

const props = defineProps<Props>();

const playerStore = usePlayerStore();
const testToolsRef = useTemplateRef("testToolsRef");
const testToolsEnabled = ref(false);

const initials = computed(() => {
  const source = playerStore.player?.name || playerStore.vkName || playerStore.player?.vk_id || "";
  return (
    source
      .split(/[\s_-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
});

onMounted(async () => {
  testToolsEnabled.value = await testToolsService.isEnabled();
});

function handleOpenTestTools(close: () => void) {
  close();
  testToolsRef.value?.open();
}

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
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--theme-accent);

  &__wrapper {
    z-index: 2;
  }

  &__center {
    display: flex;
    align-items: center;
    height: 2.5rem;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__right {
    justify-content: end;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    border: 1px solid var(--theme-stroke);
    border-radius: 50%;
    background: var(--theme-active);
    overflow: hidden;
    cursor: pointer;

    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &-initials {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--theme-accent);
    }
  }

  &_empty-menu &__avatar {
    cursor: default;
  }

  &__menu-panel {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    padding: 0.25rem;
    min-width: 14rem;
    background: var(--bg-overlay);
    border: 1px solid var(--theme-stroke);
    border-radius: 0.75rem;
  }

  &__menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 0.375rem;
    background: none;
    font-size: 1rem;
    font-weight: 500;
    color: var(--font-primary);
    text-align: left;
    cursor: pointer;

    svg {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    &:hover {
      background: var(--theme-active);
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
