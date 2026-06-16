<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("admin@example.com");
const password = ref("password");
const error = ref("");

async function submit() {
  error.value = "";

  try {
    await auth.login(email.value, password.value);
    router.push("/");
  } catch {
    error.value = "Неверный логин или пароль.";
  }
}
</script>

<template>
  <div class="login-page">
    <div class="card">
      <h1>Вход</h1>

      <input
          v-model="email"
          type="email"
          placeholder="Email"
      />

      <input
          v-model="password"
          type="password"
          placeholder="Password"
      />

      <button @click="submit" :disabled="auth.loading">
        {{ auth.loading ? "Вход..." : "Войти" }}
      </button>

      <p v-if="error">
        {{ error }}
      </p>
    </div>
  </div>
</template>