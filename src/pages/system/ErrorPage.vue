<template>
  <div class="error-page">
    <div class="error-page__header"><UILogo :size="36" /></div>
    <div class="error-page__content">
      <h2 class="error-page__message-to-user">Произошла ошибка, обновите страницу</h2>
      <div class="error-page__error-text-wrapper">
        <div click.stop.prevent class="error-page__error-copy-button">
          <IconButton :icon-component="Copy" @click="handleCopyError" />
        </div>
        <div class="error-page__error-text">
          <pre>{{ storedError }}</pre>
        </div>
      </div>
    </div>
    <div class="error-page__controls">
      <UIButton @click="handleReload">Обновить страницу</UIButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconButton from "@/components/page_parts/system/IconButton.vue";
import UIButton from "@/components/ui/UIButton.vue";
import UILogo from "@/components/ui/UILogo.vue";
import { useErrorStore } from "@/stores/errorStore";
import { Copy } from "@lucide/vue";

const { storedError } = useErrorStore();

if (!storedError) {
  // no error - user somehow navigated to this page himself. Push him to the Root
  handleReload();
}

function handleReload() {
  // not using router, because I need the window to reload
  location.href = "/";
}

function handleCopyError() {
  navigator.clipboard.writeText(String(storedError));
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &__header {
    display: flex;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__message-to-user {
    font-size: 14px;
    font-weight: 800;
    margin-bottom: 12px;
    color: var(--status-error);
  }

  &__error-text-wrapper {
    position: relative;
    display: flex;
  }

  &__error-text {
    background: var(--bg-deep);
    border-radius: var(--radius-md);
    padding: 40px 14px 14px 14px;
    font-family: monospace;
    color: var(--font-muted);
    min-width: 100%;
    max-width: 450px;
    min-height: 40px;
    max-height: 100px;
    overflow: auto;
  }

  &__error-copy-button {
    position: absolute;
    right: 16px;
    top: 8px;
    user-select: none;
  }

  &__controls {
    display: flex;
    justify-content: center;
  }
}
</style>
