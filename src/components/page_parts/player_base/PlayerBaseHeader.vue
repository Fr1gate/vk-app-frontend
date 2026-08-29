<template>
  <div class="player-base-header">
    <div class="player-base-header__left">
      <PlayerBaseBasesSelector />
    </div>
    <div class="player-base-header__center">
      <div class="player-base-header__resource">
        <div class="player-base-header__resource-icon">
          <RussianRuble :size="iconSize" color="var(--theme-accent)" />
        </div>
        <div class="player-base-header__resource-value">{{ money }}</div>
      </div>
      <div class="player-base-header__resource">
        <div class="player-base-header__resource-icon">
          <Droplets :size="iconSize" color="var(--theme-accent)" />
        </div>
        <div class="player-base-header__resource-value">{{ fuel }} т</div>
      </div>
      <div class="player-base-header__resource">
        <div class="player-base-header__resource-icon">
          <Zap :size="iconSize" color="var(--theme-accent)" />
        </div>
        <div class="player-base-header__resource-value">{{ energy }} МВт</div>
      </div>
    </div>
    <div class="player-base-header__right">
      <PlayerBaseShipsSelector />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RussianRuble, Droplets, Zap } from "@lucide/vue";
import PlayerBaseShipsSelector from "./PlayerBaseShipsSelector.vue";
import PlayerBaseBasesSelector from "./PlayerBaseBasesSelector.vue";

interface Props {
  money: number;
  fuel: number;
  energy: number;
}

const iconSize = 16;

defineProps<Props>();
</script>

<style lang="scss" scoped>
.player-base-header {
  display: flex;
  background-color: var(--theme-fill);
  box-sizing: content-box;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  padding-inline: 24px;
  border-bottom: 1px solid var(--theme-accent);

  &__center {
    display: flex;
    align-items: center;
    height: 40px;
  }

  &__resource {
    display: flex;
    align-items: center;
    padding-inline: 20px;
    height: 16px;
    font-size: 14px;

    &:not(:last-child) {
      border-right: 1px solid var(--theme-stroke);
    }

    &-icon {
      margin-right: 4px;
      display: flex;
    }
  }
}
</style>
