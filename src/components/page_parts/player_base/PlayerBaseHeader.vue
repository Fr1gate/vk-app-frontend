<template>
  <div class="player-base-header">
    <div class="player-base-header__left">
      <!--  -->
    </div>
    <div class="player-base-header__center">
      <div class="player-base-header__resource">
        <div class="player-base-header__resource-icon">
          <RussianRuble :size="iconSize" />
        </div>
        <div class="player-base-header__resource-value">12480</div>
      </div>
      <div class="player-base-header__resource">
        <div class="player-base-header__resource-icon">
          <Droplets :size="iconSize" />
        </div>
        <div class="player-base-header__resource-value">940 т</div>
      </div>
      <div class="player-base-header__resource">
        <div class="player-base-header__resource-icon">
          <Zap :size="iconSize" />
        </div>
        <div class="player-base-header__resource-value">+24 МВт</div>
      </div>
    </div>
    <div class="player-base-header__right">
      <!--  -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RussianRuble, Droplets, Zap } from "@lucide/vue";

interface Props {
  money: number;
  fuel: number;
  energy: number;
}

const iconSize = 18;

defineProps<Props>();
</script>

<style lang="scss" scoped>
.player-base-header {
  background-color: var(--bg-deep);
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__center {
    display: flex;
    align-items: center;
    height: 40px;
  }

  &__resource {
    display: flex;
    align-items: center;
    padding-inline: 20px;
    height: 100%;
    font-size: 14px;

    &:not(:last-child) {
      border-right: 1px solid var(--silver-700);
    }

    &-icon {
      margin-right: 4px;
      display: flex;
    }
  }
}
</style>
