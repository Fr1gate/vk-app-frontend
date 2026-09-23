<template>
  <div ref="button" class="dropdown__button" @click="toggle">
    <slot name="button"></slot>
  </div>
  <Teleport to="body">
    <div ref="body" v-show="isShowed" class="dropdown__content" :style="contentStyles">
      <slot name="content"></slot>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { onMounted, reactive, ref, useTemplateRef, watch } from "vue";

interface Props {
  align?: "left" | "center" | "right";
}

const { align = "left" } = defineProps<Props>();

const isShowed = ref(false);
const refButton = useTemplateRef("button");
const refBody = useTemplateRef("body");
const contentStyles = reactive({
  top: "0px",
  left: "0px",
  right: "unset",
  ["min-width"]: "0px",
  transform: "unset",
});

onMounted(() => {
  calculatePosition();
});

function toggle() {
  calculatePosition();
  isShowed.value = !isShowed.value;
  console.log("toggle", isShowed.value);
}

function close() {
  isShowed.value = false;
}

onClickOutside(
  refBody,
  () => {
    close();
  },
  {
    ignore: [refButton],
  },
);

watch(() => align, resetStyles);

function resetStyles() {
  Object.assign(contentStyles, {
    top: "0px",
    left: "0px",
    right: "unset",
    ["min-width"]: "0px",
    transform: "unset",
  });
}

function calculatePosition() {
  const rect = refButton.value?.getBoundingClientRect();

  contentStyles.top = `${rect!.bottom + 2}px`;
  contentStyles["min-width"] = `${rect!.width}px`;

  switch (align) {
    case "left": {
      contentStyles.left = `${rect!.left}px`;
      break;
    }
    case "center": {
      contentStyles.left = `${rect!.left + (rect!.right - rect!.left) / 2}px`;
      contentStyles.transform = `translateX(-50%)`;
      break;
    }
    case "right": {
      contentStyles.right = `${rect!.right}px`;
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
  }
}
</style>
