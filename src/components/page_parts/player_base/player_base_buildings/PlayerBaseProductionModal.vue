<template>
  <div class="production-modal">
    <div class="production-modal__portrait">
      <img class="production-modal__portrait-image" :src="portraitUrl" :alt="building.name" />
      <div class="production-modal__portrait-shade" />
      <div class="production-modal__portrait-name">{{ building.name }}</div>
      <div class="production-modal__portrait-level">Ур. {{ building.level }}</div>
    </div>
    <div class="production-modal__content">
      <div class="production-modal__header">
        <div class="production-modal__name">{{ building.name }}</div>
        <div class="production-modal__close" @click="emit('close')"><X /></div>
      </div>
      <div class="production-modal__body">
        <div v-if="showPower" class="production-modal__power" :class="{ 'production-modal__power_positive': power > 0 }">
          <Zap class="production-modal__power-icon" />
          <span>{{ powerText }}</span>
        </div>

        <div v-if="lineViews.length > 0" class="production-modal__group">
          <div class="production-modal__group-label">ПРОИЗВОДСТВО</div>
          <div
            v-for="view in lineViews"
            :key="view.line.line_key"
            class="production-line"
            :class="{ 'production-line_disabled': !view.line.enabled }"
          >
            <div class="production-line__main">
              <div class="production-line__title">
                <span v-if="view.titleFirst">{{ view.titleFirst }}</span>
                <ResourceInline :resource-id="view.outputId" icon-only />
                <span v-if="view.titleLast">{{ view.titleLast }}</span>
              </div>
              <div class="production-line__progress">
                <UIProgressBar
                  class="production-line__bar"
                  :percent="view.percent"
                  :color="view.line.enabled ? 'var(--theme-accent)' : 'var(--silver-500)'"
                />
                <span class="production-line__time">{{ view.timeText }}</span>
              </div>
              <div class="production-line__io" :class="{ 'production-line__io_split': view.inputs.length > 0 }">
                <div v-if="view.inputs.length > 0" class="production-line__io-col">
                  <template v-for="input in view.inputs" :key="input.id">
                    <span
                      v-if="input.id === 'res_money'"
                      class="production-line__input"
                      :class="{ 'production-line__input_missing': input.missing }"
                    >
                      ₽ {{ formatAmount(input.amount) }}
                    </span>
                    <ResourceInline
                      v-else
                      class="production-line__input"
                      :resource-id="input.id"
                      :label="input.label"
                      :value="formatAmount(input.amount)"
                      :color="input.missing ? 'var(--status-error)' : undefined"
                      :class="{ 'production-line__input_missing': input.missing }"
                    />
                  </template>
                </div>
                <span v-if="view.inputs.length > 0" class="production-line__arrow">→</span>
                <div class="production-line__io-col">
                  <template v-for="output in view.outputs" :key="output.id">
                    <span v-if="output.id === 'res_money'" class="production-line__money"> ₽ {{ formatAmount(output.amount) }} </span>
                    <ResourceInline
                      v-else
                      class="production-line__output"
                      :resource-id="output.id"
                      :label="output.label"
                      :value="formatAmount(output.amount)"
                    />
                  </template>
                  <span v-if="view.line.energy_per_cycle > 0" class="production-line__energy">
                    <Zap class="production-line__energy-icon" />
                    <span>{{ formatAmount(view.line.energy_per_cycle) }}</span>
                  </span>
                </div>
              </div>
            </div>
            <UISwitch
              :model-value="view.line.enabled"
              :disabled="togglingLine !== null"
              :aria-label="view.line.enabled ? 'Выключить линию' : 'Включить линию'"
              @update:model-value="handleToggle(view.line)"
            />
          </div>
        </div>

        <div v-if="showUpgrade" class="production-modal__group">
          <div class="production-modal__group-label">УЛУЧШЕНИЕ</div>
          <div class="production-upgrade" :class="{ 'production-upgrade_active': isUpgrading }">
            <div class="production-upgrade__row">
              <span class="production-upgrade__level">Ур. {{ building.level }} → Ур. {{ building.level + 1 }}</span>
              <template v-if="isUpgrading">
                <span class="production-upgrade__status">Улучшается…</span>
              </template>
              <template v-else>
                <span class="production-upgrade__costs">
                  <span
                    v-for="cost in costEntries"
                    :key="cost.id"
                    class="production-upgrade__cost"
                    :class="{ 'production-upgrade__cost_missing': !cost.isEnough }"
                  >
                    <ResourceInline
                      :resource-id="cost.id"
                      :label="gameDictionaryStore.getResourceName(cost.id)"
                      :color="cost.isEnough ? undefined : 'var(--status-error)'"
                    />
                    <span class="production-upgrade__cost-value">{{ formatAmount(cost.amount) }}</span>
                  </span>
                </span>
              </template>
            </div>
            <div v-if="isUpgrading" class="production-upgrade__progress">
              <UIProgressBar class="production-upgrade__bar" :percent="upgradePercent" color="var(--theme-accent)" />
              <span class="production-upgrade__time">осталось {{ upgradeCountdown }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showUpgrade && !isUpgrading" class="production-modal__footer">
        <UIButton class="production-modal__upgrade-button" :disabled="!canUpgrade || pendingUpgrade" @click="handleUpgrade">
          Улучшить
        </UIButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { api } from "@/api";
import type { BaseBuilding, ProductionLine } from "@/api/generated/types";
import ResourceInline from "@/components/ui/ResourceInline.vue";
import UIButton from "@/components/ui/UIButton.vue";
import UIProgressBar from "@/components/ui/UIProgressBar.vue";
import UISwitch from "@/components/ui/UISwitch.vue";
import { useGameDictionaryStore } from "@/stores/gameDictionaryStore";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { getBuildingPortrait } from "@/utils/buildingPortrait";
import { formatAmount } from "@/utils/formatAmount";
import { formatCountdown } from "@/utils/formatCountdown";
import { formatDuration } from "@/utils/formatDuration";
import { X, Zap } from "@lucide/vue";
import { computed, onMounted, onUnmounted, ref } from "vue";

interface Props {
  building: BaseBuilding;
}

const { building } = defineProps<Props>();
const emit = defineEmits<{ close: [] }>();

const TIMER_UPDATE_INTERVAL = 200;

const baseStore = usePlayerBaseStore();
const gameDictionaryStore = useGameDictionaryStore();

const portraitUrl = computed(() => getBuildingPortrait(building.building_id));

const now = ref(Date.now());
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), TIMER_UPDATE_INTERVAL);
});

onUnmounted(() => clearInterval(timer));

const productionLines = computed(() => baseStore.base?.production.lines.filter((line) => line.building_id === building.id) ?? []);

const power = computed(() => {
  const generation = building.next_level_power_generation_per_hour ?? building.power_generation_per_hour;
  return generation > 0 ? generation : -building.power_demand_per_hour;
});
const showPower = computed(() => power.value !== 0);
const powerText = computed(() => `${power.value > 0 ? "+" : "−"}${formatAmount(Math.abs(power.value))} МВт/ч`);

function splitTitle(title: string): [string, string] {
  const index = title.lastIndexOf(" ");
  if (index === -1) return ["", title];
  return [title.slice(0, index), title.slice(index + 1)];
}

function linePercent(line: ProductionLine): number {
  if (!line.enabled || line.status !== "running" || !line.started_at || !line.next_cycle_at) return 0;
  const started = Date.parse(line.started_at);
  const next = Date.parse(line.next_cycle_at);
  if (next <= started) return 0;
  return Math.min(100, Math.max(0, ((now.value - started) / (next - started)) * 100));
}

function lineTimeText(line: ProductionLine): string {
  if (!line.enabled) return `цикл ${formatDuration(line.cycle_seconds)}`;
  if (line.status === "no_power") return "нет энергии";
  if (line.status === "no_input") return "нет сырья";
  if (line.next_cycle_at) return `осталось ${formatCountdown(Date.parse(line.next_cycle_at) - now.value)}`;
  return `цикл ${formatDuration(line.cycle_seconds)}`;
}

function resourceEntries(record: Record<string, number>, missing: string[] = []) {
  return Object.entries(record)
    .filter(([, amount]) => amount > 0)
    .map(([resourceId, amount]) => ({
      id: resourceId,
      amount,
      missing: missing.includes(resourceId),
      label: gameDictionaryStore.getResourceName(resourceId),
    }));
}

const lineViews = computed(() =>
  productionLines.value.map((line) => {
    const [titleFirst, titleLast] = splitTitle(line.name);
    return {
      line,
      titleFirst,
      titleLast,
      outputId: Object.keys(line.outputs)[0] ?? Object.keys(line.inputs)[0] ?? "",
      inputs: resourceEntries(line.inputs, line.missing_inputs),
      outputs: resourceEntries(line.outputs),
      percent: linePercent(line),
      timeText: lineTimeText(line),
    };
  }),
);

const availableBuilding = computed(() => baseStore.availableBuildings.find((item) => item.building_id === building.building_id) ?? null);
const isUpgrading = computed(() => Boolean(building.will_upgrade_at));
const showUpgrade = computed(
  () => Boolean(availableBuilding.value) && (isUpgrading.value || building.level < availableBuilding.value!.max_level),
);

const costEntries = computed(() =>
  Object.entries(availableBuilding.value?.next_level_cost ?? {})
    .sort(([a], [b]) => {
      if (a === "res_money") return -1;
      if (b === "res_money") return 1;
      return gameDictionaryStore.getResourceName(a).localeCompare(gameDictionaryStore.getResourceName(b), "ru");
    })
    .map(([resourceId, amount]) => ({
      id: resourceId,
      amount,
      isEnough: baseStore.getResourceAmount(resourceId) >= amount,
    })),
);

const canUpgrade = computed(() => costEntries.value.length > 0 && costEntries.value.every((cost) => cost.isEnough));

const upgradePercent = computed(() => {
  if (!building.upgrade_started_at || !building.upgrade_time_seconds) return 0;
  const started = Date.parse(building.upgrade_started_at);
  const total = building.upgrade_time_seconds * 1_000;
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, ((now.value - started) / total) * 100));
});

const upgradeCountdown = computed(() => formatCountdown(building.will_upgrade_at ? Date.parse(building.will_upgrade_at) - now.value : 0));

const pendingUpgrade = ref(false);
const togglingLine = ref<string | null>(null);

async function handleUpgrade() {
  const siteId = baseStore.base?.site_id;
  if (!siteId || !canUpgrade.value || pendingUpgrade.value) return;

  pendingUpgrade.value = true;
  try {
    await api.bases.buildingsUpgradeCreate(siteId, building.building_id);
    await baseStore.refresh();
  } finally {
    pendingUpgrade.value = false;
  }
}

async function handleToggle(line: ProductionLine) {
  const siteId = baseStore.base?.site_id;
  if (!siteId || togglingLine.value !== null) return;

  togglingLine.value = line.line_key;
  try {
    await api.bases.buildingsLinesToggleCreate(siteId, building.id, line.line_key, { enabled: !line.enabled });
    await baseStore.refresh();
  } finally {
    togglingLine.value = null;
  }
}
</script>

<style lang="scss" scoped>
.production-modal {
  display: flex;
  width: 40rem;
  min-height: 23rem;
  max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 2rem);
  overflow: hidden;
  background: var(--gradient-background);
  border: 1px solid var(--theme-stroke);
  border-radius: var(--radius-lg);

  &__portrait {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 0.25rem;
    flex-shrink: 0;
    width: 14.5rem;
    padding: 1rem;
    overflow: hidden;
    background: linear-gradient(160deg, var(--bg-deep) 0%, var(--theme-accent-deep) 55%, var(--bg-elevated) 100%);
  }

  &__portrait-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__portrait-shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, var(--theme-scrim) 100%);
  }

  &__portrait-name {
    position: relative;
    font-size: var(--font-lg);
    font-weight: 700;
    line-height: 120%;
  }

  &__portrait-level {
    position: relative;
    align-self: flex-start;
    padding: 0.125rem 0.5rem;
    border-radius: var(--radius-pill);
    background: var(--theme-accent-hi);
    color: var(--font-inverse);
    font-size: var(--font-md);
    font-weight: 600;
  }

  &__content {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    min-width: 0;
    min-height: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem 0.5rem;
    border-bottom: 1px solid var(--silver-800);
  }

  &__name {
    font-size: var(--font-lg);
    font-weight: 700;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__close {
    display: flex;
    flex-shrink: 0;
    cursor: pointer;

    svg {
      width: 1.125rem;
      height: 1.125rem;
      stroke: var(--font-muted);
    }

    &:hover svg {
      stroke: var(--font-primary);
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1 1 auto;
    min-height: 0;
    padding: 0.5rem 1rem;
    overflow-y: auto;
  }

  &__power {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-md);
    background: var(--theme-active);
    color: var(--font-secondary);
    font-size: var(--font-md);
    font-weight: 500;

    &_positive {
      color: var(--theme-accent);
    }
  }

  &__power-icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__group-label {
    font-size: var(--font-sm);
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--font-muted);
  }

  &__footer {
    padding: 0.5rem 1rem 1rem;
  }

  &__upgrade-button {
    width: 100%;
  }
}

.production-line {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--theme-stroke);
  border-radius: var(--radius-md);
  background: var(--theme-active);

  &_disabled {
    .production-line__title,
    .production-line__output {
      color: var(--font-secondary);
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1 1 0;
    min-width: 0;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 0.1875rem;
    font-size: var(--font-md);
    font-weight: 600;
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__bar {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__time {
    flex-shrink: 0;
    font-size: var(--font-sm);
    font-weight: 500;
    color: var(--font-secondary);
    font-variant-numeric: tabular-nums;
  }

  &__io {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 0.375rem;
    row-gap: 0.125rem;
    font-size: var(--font-sm);
    font-weight: 500;
    color: var(--font-secondary);
  }

  &__io_split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    column-gap: 0.5rem;
  }

  &__io-col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.125rem;
    min-width: 0;
  }

  &__input_missing {
    color: var(--status-error);
  }

  &__arrow {
    color: var(--font-muted);
  }

  &__output {
    color: var(--font-primary);
  }

  &__energy {
    display: inline-flex;
    align-items: center;
    gap: 0.125rem;
    color: var(--font-secondary);
  }

  &__energy-icon {
    width: 0.875rem;
    height: 0.875rem;
  }
}

.production-upgrade {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--theme-stroke);
  border-radius: var(--radius-md);
  background: var(--theme-active);

  &__row {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: var(--font-md);
    font-weight: 600;
  }

  &__level {
    flex-shrink: 0;
  }

  &__status {
    margin-left: auto;
    color: var(--theme-accent);
  }

  &__costs {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    margin-left: auto;
    font-weight: 500;
  }

  &__cost {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    white-space: nowrap;
  }

  &__cost-value {
    color: var(--font-primary);
    font-variant-numeric: tabular-nums;
  }

  &__cost_missing {
    color: var(--status-error);

    .production-upgrade__cost-value {
      color: var(--status-error);
    }
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__bar {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__time {
    flex-shrink: 0;
    font-size: var(--font-sm);
    font-weight: 500;
    color: var(--font-secondary);
    font-variant-numeric: tabular-nums;
  }
}

@media (max-height: 449px) {
  .production-modal {
    width: calc(100vw - 2rem);
    min-height: 0;

    &__portrait {
      display: none;
    }

    &__header {
      padding: 0.5rem 0.75rem 0.375rem;
    }

    &__body {
      padding: 0.375rem 0.75rem;
    }

    &__footer {
      padding: 0.375rem 0.75rem 0.75rem;
    }
  }
}
</style>
