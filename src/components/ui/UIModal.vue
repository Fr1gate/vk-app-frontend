<template>
  <div v-bind="$attrs" @click="open">
    <slot name="button"> </slot>
  </div>
  <Teleport to="body">
    <div v-show="isOpened" class="modal__overlay">
      <div ref="modal" class="modal" :class="{ modal_unstyled: unstyled }">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref, useTemplateRef } from "vue";

interface Props {
  showOnStart?: boolean;
  preventClose?: boolean;
  unstyled?: boolean;
}

const { showOnStart = false, preventClose = false, unstyled = false } = defineProps<Props>();

const isOpened = ref(showOnStart);
const modalRef = useTemplateRef("modal");

onClickOutside(modalRef, handleClickOutside, { ignore: [".dropdown__content"] });

function open() {
  isOpened.value = true;
}
function handleClickOutside() {
  if (preventClose) return;
  close();
}
function close() {
  isOpened.value = false;
}

defineExpose({
  open,
  close,
  isOpened,
});
</script>

<style lang="scss" scoped>
.modal__overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  background: #00000088;

  z-index: 10;
}

.modal {
  padding: 1.25rem;
  background: var(--gradient-background);
  border: 1px solid var(--theme-stroke);
  border-radius: var(--radius-lg);

  z-index: 11;

  &_unstyled {
    padding: 0;
    background: none;
    border: none;
    border-radius: 0;
  }
}
</style>
