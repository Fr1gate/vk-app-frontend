<template>
  <div class="registration">
    <div class="registration__logo">
      <UILogo :size="48" />
    </div>
    <form class="registration__form" @submit.prevent="handleSubmit">
      <h2 class="registration__header">Добро пожаловать!</h2>
      <UISeparator class="registration__separator" />
      <UIInputText v-model="form.name" label="Имя пользователя" placeholder="Введите имя пользователя" required minlength="3" />
      <UIButton class="registration__button" type="submit">Старт!</UIButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { api } from "@/api";
import { ROUTES_NAMES } from "@/constants/RoutesNames";
import router from "@/router";
import { usePlayerStore } from "@/stores/player";
import { reactive } from "vue";
import UILogo from "@/components/ui/UILogo.vue";
import UIInputText from "@/components/ui/UIInputText.vue";
import UISeparator from "@/components/ui/UISeparator.vue";
import UIButton from "@/components/ui/UIButton.vue";

const form = reactive({
  name: "",
});

const playerStore = usePlayerStore();

function handleSubmit() {
  api.auth
    .registerCreate(form)
    .then(({ data }) => {
      playerStore.player = data.user;
      router.push({
        name: ROUTES_NAMES.PLAYER_BASE.HOME,
      });
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<style lang="scss" scoped>
@use "@/styles/variables";

.registration {
  &__form {
    display: flex;
    flex-direction: column;
  }

  &__logo {
    margin-bottom: 16px;
  }

  &__header {
    color: var(--font-secondary);
    font-size: 18px;
  }

  &__separator {
    margin-block: 18px;
  }

  &__button {
    margin-top: 16px;
  }
}
</style>
