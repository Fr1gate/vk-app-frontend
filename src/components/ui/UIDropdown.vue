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
import { onMounted, reactive, ref, useTemplateRef } from "vue";

const isShowed = ref(false);
const refButton = useTemplateRef("button");
const refBody = useTemplateRef("body");
const contentStyles = reactive({
  top: "0px",
  left: "0px",
  ["min-width"]: "0px",
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

function calculatePosition() {
  const rect = refButton.value?.getBoundingClientRect();

  contentStyles.top = `${rect!.bottom + 2}px`;
  contentStyles.left = `${rect!.left}px`;
  contentStyles["min-width"] = `${rect!.width}px`;
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
