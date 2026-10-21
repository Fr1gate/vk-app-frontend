<template>
  <div class="space-time">
    <div class="space-time__row">
      <button
        type="button"
        class="space-time__play"
        :aria-label="isPlaying ? 'Пауза' : 'Воспроизвести'"
        @click="time.toggle()"
      >
        <Pause v-if="isPlaying" />
        <Play v-else />
      </button>
      <div class="space-time__date" @click="time.pause()">
        <VueDatePicker
          :model-value="gameTime * 1000"
          model-type="timestamp"
          :formats="{ input: 'dd.MM.yyyy HH:mm' }"
          :locale="ru"
          :clearable="false"
          :enable-time-picker="true"
          :is-24="true"
          :dark="true"
          :year-range="[-1000, 4000]"
          :action-row="{ selectBtnLabel: 'Выбрать', cancelBtnLabel: 'Отмена', showNow: false, showPreview: false }"
          week-start="1"
          @update:model-value="updateDate"
          @open="time.pause()"
        />
      </div>
    </div>
    <div class="space-time__speeds">
      <button
        v-for="preset in SPEED_PRESETS"
        :key="preset"
        type="button"
        class="space-time__speed"
        :class="{ 'space-time__speed_active': multiplier === preset }"
        @click="time.setMultiplier(preset)"
      >
        ×{{ String(preset).replace(".", ",") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSpaceTime, SPEED_PRESETS } from "./spaceTime";
import { Pause, Play } from "@lucide/vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { ru } from "date-fns/locale";
import { computed } from "vue";

const time = useSpaceTime();

const gameTime = computed(() => time.gameTime.value);
const isPlaying = computed(() => time.isPlaying.value);
const multiplier = computed(() => time.multiplier.value);

function updateDate(value: Date | number | null) {
  if (value === null) return;
  time.setGameTime(Number(value) / 1000);
}
</script>

<style lang="scss" scoped>
.space-time {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.5rem;
  background: var(--theme-surface);
  border: 1px solid var(--theme-stroke);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(0.75rem);

  &__row {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__play {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--theme-stroke);
    border-radius: var(--radius-md);
    background: var(--theme-active);
    color: var(--theme-accent);
    cursor: pointer;

    svg {
      width: 1rem;
      height: 1rem;
    }

    &:hover {
      color: var(--theme-accent-hi);
    }
  }

  &__date {
    width: 12.5rem;
  }

  &__speeds {
    display: flex;
    gap: 0.25rem;
  }

  &__speed {
    flex: 1 1 auto;
    padding: 0.25rem 0.375rem;
    border: 1px solid var(--theme-stroke);
    border-radius: var(--radius-sm);
    background: var(--theme-active);
    color: var(--font-secondary);
    font-family: var(--font-family);
    font-size: var(--font-sm);
    font-weight: 500;
    cursor: pointer;
    transition:
      color 0.15s,
      border-color 0.15s;

    &:hover {
      color: var(--font-primary);
    }

    &_active {
      border-color: var(--theme-accent);
      color: var(--theme-accent);
    }
  }
}

:deep(.dp--theme-dark) {
  --dp-background-color: var(--bg-elevated);
  --dp-text-color: var(--font-primary);
  --dp-hover-color: var(--theme-active);
  --dp-hover-text-color: var(--font-primary);
  --dp-hover-icon-color: var(--font-primary);
  --dp-primary-color: var(--theme-accent);
  --dp-primary-text-color: var(--font-inverse);
  --dp-secondary-color: var(--font-secondary);
  --dp-border-color: var(--theme-stroke);
  --dp-menu-border-color: var(--theme-stroke);
  --dp-border-color-hover: var(--theme-accent);
  --dp-border-color-focus: var(--theme-accent);
  --dp-icon-color: var(--font-secondary);
  --dp-danger-color: var(--status-error);
  --dp-marker-color: var(--status-error);
  --dp-highlight-color: color-mix(in srgb, var(--theme-accent) 15%, transparent);
  --dp-range-between-dates-background-color: var(--theme-active);
  --dp-range-between-dates-text-color: var(--font-primary);
  --dp-range-between-border-color: var(--theme-active);
}

:deep(.dp--input) {
  height: 2rem;
  padding: 0 0.5rem 0 1.75rem;
  border: 1px solid var(--theme-stroke);
  border-radius: var(--radius-md);
  background: var(--theme-active);
  color: var(--font-primary);
  font-family: var(--font-family);
  font-size: var(--font-md);
  font-weight: 500;
}

:deep(.dp--input:hover) {
  border-color: var(--theme-accent);
}

:deep(.dp--menu) {
  font-family: var(--font-family);
}

:deep(.dp--clear-btn) {
  display: none;
}

:deep(.dp--action-select),
:deep(.dp--action-cancel) {
  font-family: var(--font-family);
  font-size: var(--font-md);
  font-weight: 500;
}

:deep(.dp--action-select) {
  color: var(--font-inverse);
  background: var(--theme-accent);
}
</style>
