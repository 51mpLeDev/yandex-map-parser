## LoginPage.vue

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");

async function submit() {
  error.value = "";

  try {
    await auth.login(email.value, password.value);
    router.push("/");
  } catch {
    error.value = "Неверный логин или пароль";
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 p-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-slate-900">
          Yandex Maps Parser
        </h1>

        <p class="mt-2 text-sm text-slate-500">
          Войдите в панель управления
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
              v-model="email"
              type="email"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="admin@example.com"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-slate-700">
            Пароль
          </label>

          <input
              v-model="password"
              type="password"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              placeholder="••••••••"
          />
        </div>

        <p
            v-if="error"
            class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"
        >
          {{ error }}
        </p>

        <button
            type="submit"
            :disabled="auth.loading"
            class="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {{ auth.loading ? "Вход..." : "Войти" }}
        </button>
      </form>
    </div>
  </div>
</template>
```
