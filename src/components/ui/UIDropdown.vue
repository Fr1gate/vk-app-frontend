<template>
  <div ref="button" class="dropdown__button" @click="handleClick" @pointerenter="handlePointerEnter" @pointerleave="handlePointerLeave">
    <slot name="button"></slot>
    <Teleport to="body">
      <div ref="body" v-show="isShowed" class="dropdown__content" :style="contentStyles">
        <slot name="content" :close="close"></slot>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from "vue";

interface Props {
  align?: "left" | "center" | "right";
  trigger?: "click" | "hover";
  // should body width match trigger's width
  matchTriggerWidth?: boolean;
}

const { align = "left", trigger = "click", matchTriggerWidth = true } = defineProps<Props>();

const OFFSET = 2;
const VIEWPORT_MARGIN = 8;

const isShowed = ref(false);
// click on trigger pins body
const isPinned = ref(false);
const refButton = useTemplateRef("button");
const refBody = useTemplateRef("body");
const contentStyles = reactive({
  top: "0px",
  bottom: "unset",
  left: "0px",
  right: "unset",
  ["min-width"]: "0px",
  ["max-height"]: "none",
  transform: "unset",
});

onMounted(() => {
  calculatePosition();
});

watch(isShowed, (opened) => {
  if (opened) window.addEventListener("resize", calculatePosition);
  else window.removeEventListener("resize", calculatePosition);
});

onUnmounted(() => window.removeEventListener("resize", calculatePosition));

function open() {
  calculatePosition();
  isShowed.value = true;
}

function close() {
  isShowed.value = false;
}

function toggle() {
  if (isShowed.value) close();
  else open();
}

function handleClick() {
  if (trigger === "hover") {
    isPinned.value = !isPinned.value;
    if (isPinned.value) open();
    else close();
    return;
  }
  toggle();
}

function handlePointerEnter(event: PointerEvent) {
  if (trigger !== "hover" || event.pointerType !== "mouse") return;
  open();
}

function handlePointerLeave(event: PointerEvent) {
  if (trigger !== "hover" || event.pointerType !== "mouse" || isPinned.value) return;
  close();
}

onClickOutside(
  refBody,
  () => {
    isPinned.value = false;
    close();
  },
  {
    ignore: [refButton],
  },
);

defineExpose({ open, close, toggle });

watch(() => align, resetStyles);

function resetStyles() {
  Object.assign(contentStyles, {
    top: "0px",
    bottom: "unset",
    left: "0px",
    right: "unset",
    ["min-width"]: "0px",
    ["max-height"]: "none",
    transform: "unset",
  });
}

function calculatePosition() {
  const rect = refButton.value?.getBoundingClientRect();
  if (!rect) return;

  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
  const spaceAbove = rect.top - VIEWPORT_MARGIN;
  const openAbove = spaceBelow < spaceAbove;

  contentStyles.top = openAbove ? "unset" : `${rect.bottom + OFFSET}px`;
  contentStyles.bottom = openAbove ? `${window.innerHeight - rect.top + OFFSET}px` : "unset";
  contentStyles["max-height"] = `${Math.max(0, openAbove ? spaceAbove : spaceBelow)}px`;
  contentStyles["min-width"] = matchTriggerWidth ? `${rect.width}px` : "0px";

  switch (align) {
    case "left": {
      contentStyles.left = `${rect.left}px`;
      break;
    }
    case "center": {
      contentStyles.left = `${rect.left + (rect.right - rect.left) / 2}px`;
      contentStyles.transform = `translateX(-50%)`;
      break;
    }
    case "right": {
      contentStyles.right = `${rect.right}px`;
      break;
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown {
  &__button {
    user-select: none;
    cursor: pointer;
  }

  &__content {
    position: absolute;

    max-width: calc(100vw - 1rem);
    overflow-y: auto;
    overscroll-behavior: contain;

    z-index: 20;
  }
}
</style>
