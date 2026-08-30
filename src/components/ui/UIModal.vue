<template>
  <div v-bind="$attrs" @click="open">
    <slot name="button"> </slot>
  </div>
  <Teleport to="body">
    <div v-show="isOpened" class="modal__overlay">
      <div ref="modal" class="modal">
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
}

const { showOnStart = false } = defineProps<Props>();

const isOpened = ref(showOnStart);
const modalRef = useTemplateRef("modal");

onClickOutside(modalRef, close);

function open() {
  isOpened.value = true;
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

  background: linear-gradient(to bottom, #06060aff 0%, #0a0c12cc 50%, #0a0c12ff 100%);
}

.modal {
  padding: 20px;
  background-color: var(--bg-elevated);
}
</style>
