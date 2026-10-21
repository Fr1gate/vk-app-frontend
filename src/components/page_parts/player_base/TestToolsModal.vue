<template>
  <UIModal ref="modalRef">
    <div class="test-tools">
      <div class="test-tools__header">
        <div class="test-tools__title">Инструменты тестирования</div>
        <button class="test-tools__close" @click="handleClose">
          <X color="var(--theme-accent)" />
        </button>
      </div>

      <div class="test-tools__group">
        <div class="test-tools__label">Ресурсы</div>
        <div class="test-tools__select">
          <UISelect v-model="selectedResourceId" :options="resourceOptions" />
        </div>
        <div class="test-tools__row">
          <input
            class="test-tools__input"
            :value="resourcesAmount"
            placeholder="Сколько, кг (+/-)"
            inputmode="numeric"
            @input="onResourcesInput"
          />
          <UIButton :disabled="busy || !resourcesAmountValue" @click="applyResources(resourcesAmountValue)"> Применить </UIButton>
        </div>
      </div>

      <div class="test-tools__group">
        <div class="test-tools__label">Деньги</div>
        <div class="test-tools__row">
          <input
            class="test-tools__input"
            :value="moneyAmount"
            placeholder="Своя сумма, ₽ (+/-)"
            inputmode="numeric"
            @input="onMoneyInput"
          />
          <UIButton :disabled="busy || !moneyAmountValue" @click="handleMoney(moneyAmountValue)">Применить</UIButton>
        </div>
      </div>

      <div class="test-tools__group test-tools__group_actions">
        <UIButton :disabled="busy" @click="handleFinishTimers">Завершить таймеры</UIButton>
        <UIButton :disabled="busy" class="test-tools__danger" @click="handleReset">
          {{ resetArmed ? "Точно сбросить?" : "Сбросить прогресс" }}
        </UIButton>
      </div>
    </div>
  </UIModal>
</template>

<script lang="ts" setup>
import UIButton from "@/components/ui/UIButton.vue";
import UIModal from "@/components/ui/UIModal.vue";
import UISelect from "@/components/ui/UISelect.vue";
import { getResourceColor, getResourceIconComponent } from "@/constants/ResourceIcon";
import { testToolsService } from "@/services/testToolsService";
import { usePlayerBaseStore } from "@/stores/playerBaseStore";
import { X } from "@lucide/vue";
import { computed, onUnmounted, ref, useTemplateRef, watch } from "vue";

const RESET_ARM_TIMEOUT = 3_000;
const STORED_KINDS = ["solid", "liquid", "gas"] as const;

const playerBaseStore = usePlayerBaseStore();
const modalRef = useTemplateRef("modalRef");

const busy = ref(false);
const selectedResourceId = ref("");
const resourcesAmount = ref("");
const moneyAmount = ref("");
const resetArmed = ref(false);
let resetArmTimer: ReturnType<typeof setTimeout> | undefined;

const resourceOptions = computed(() =>
  STORED_KINDS.flatMap((kind) =>
    (playerBaseStore.resourcesByPhase[kind] ?? []).map((resource) => ({
      id: resource.id,
      label: resource.name,
      icon: getResourceIconComponent(kind),
      iconColor: getResourceColor(kind),
      kind,
    })),
  ).sort((a, b) => a.label.localeCompare(b.label, "ru")),
);

const resourcesAmountValue = computed(() => Math.trunc(Number(resourcesAmount.value)) || 0);
const moneyAmountValue = computed(() => Math.trunc(Number(moneyAmount.value)) || 0);

defineExpose({
  open: () => modalRef.value?.open(),
});

onUnmounted(() => clearTimeout(resetArmTimer));

watch(
  resourceOptions,
  (options) => {
    if (!options.some((option) => option.id === selectedResourceId.value)) {
      selectedResourceId.value = options[0]?.id ?? "";
    }
  },
  { immediate: true },
);

function handleClose() {
  modalRef.value?.close();
}

function onResourcesInput(event: Event) {
  resourcesAmount.value = (event.target as HTMLInputElement).value;
}

function onMoneyInput(event: Event) {
  moneyAmount.value = (event.target as HTMLInputElement).value;
}

async function runAction(action: () => Promise<void>) {
  if (busy.value) return;
  busy.value = true;
  try {
    await action();
  } finally {
    busy.value = false;
  }
}

function applyResources(amount: number) {
  if (!selectedResourceId.value || !amount) return;
  void runAction(() => testToolsService.addResources(selectedResourceId.value, amount));
}

function handleMoney(amount: number) {
  void runAction(() => testToolsService.addMoney(amount));
}

function handleFinishTimers() {
  void runAction(() => testToolsService.finishTimers());
}

function handleReset() {
  if (!resetArmed.value) {
    resetArmed.value = true;
    clearTimeout(resetArmTimer);
    resetArmTimer = setTimeout(() => (resetArmed.value = false), RESET_ARM_TIMEOUT);
    return;
  }

  resetArmed.value = false;
  clearTimeout(resetArmTimer);
  void runAction(() => testToolsService.resetProgress());
}
</script>

<style lang="scss" scoped>
.test-tools {
  display: flex;
  flex-direction: column;
  min-width: 26rem;
  max-width: calc(100vw - 1rem);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--font-primary);
  }

  &__close {
    display: flex;
    cursor: pointer;
    background: none;
    border: none;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;

    &_actions {
      flex-direction: row;
      justify-content: center;
      border-top: 1px solid var(--theme-divider);
      padding-top: 0.75rem;
    }
  }

  &__label {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--font-muted);
  }

  &__select {
    :deep(.select) {
      width: 100%;
      height: 2.5rem;
      padding: 0 0.75rem;
      border-radius: 0.5rem;
      font-size: 1rem;
    }
  }

  &__row {
    display: flex;
    gap: 0.5rem;

    :deep(.button) {
      flex: 1;
    }
  }

  &__input {
    flex: 1;
    min-width: 0;
    height: 2.5rem;
    padding: 0 0.75rem;
    border: 1px solid var(--theme-stroke);
    border-radius: 0.5rem;
    background: var(--bg-deep);
    color: var(--font-primary);
    font-size: 1rem;

    &::placeholder {
      color: var(--font-muted);
    }

    &:focus {
      outline: none;
      border-color: var(--theme-accent-hi);
    }
  }

  &__danger {
    color: var(--status-error);
  }
}
</style>
