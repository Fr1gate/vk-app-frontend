<template>
  <form @submit.prevent="handleSubmit">
    <h2>Registration Page</h2>
    <input v-model="form.name" type="text" required minlength="3" />
    <button type="submit">Register</button>
  </form>
</template>

<script setup lang="ts">
import { api } from "@/api";
import { reactive } from "vue";

const form = reactive({
  name: "",
});

function handleSubmit() {
  api.auth
    .registerCreate(form)
    .then(({ data }) => {
      console.log("success", data);
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>
