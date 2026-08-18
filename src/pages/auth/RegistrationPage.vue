<template>
  <form @submit.prevent="handleSubmit">
    <h2>Registration Page</h2>
    <input v-model="form.name" type="text" required minlength="3" />
    <button type="submit">Register</button>
  </form>
</template>

<script setup lang="ts">
import { api } from "@/api";
import { ROUTES_NAMES } from "@/constants/RoutesNames";
import router from "@/router";
import { usePlayerStore } from "@/stores/player";
import { reactive } from "vue";

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
