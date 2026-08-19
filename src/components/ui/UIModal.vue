<template>
  <Teleport to="body">
    <div v-show="isOpened" class="modal__overlay">
      <div class="modal">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Props {
  showOnStart?: boolean;
}

const { showOnStart = false } = defineProps<Props>();

const isOpened = ref(showOnStart);

function open() {
  isOpened.value = true;
}

defineExpose({
  open,
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
