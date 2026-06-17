```vue
<script setup lang="ts">
import type { Company } from "../types/company";

defineProps<{
  company: Company;
}>();

const statusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const statusText = (status: string) => {
  switch (status) {
    case "completed":
      return "✅ Завершено";
    case "processing":
      return "⏳ Обработка";
    case "failed":
      return "❌ Ошибка";
    default:
      return status;
  }
};
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div
        class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
    >
      <div>
        <h2 class="text-2xl font-bold text-slate-900">
          {{ company.title || "Без названия" }}
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Информация об организации
        </p>
      </div>

      <span
          class="rounded-full px-4 py-2 text-sm font-semibold"
          :class="statusColor(company.status)"
      >
        {{ statusText(company.status) }}
      </span>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-xl bg-amber-50 p-5">
        <div class="text-sm text-slate-500">
          ⭐ Рейтинг
        </div>

        <div class="mt-2 text-3xl font-bold text-amber-600">
          {{ company.rating ?? "-" }}
        </div>
      </div>

      <div class="rounded-xl bg-blue-50 p-5">
        <div class="text-sm text-slate-500">
          📝 Оценок
        </div>

        <div class="mt-2 text-3xl font-bold text-blue-600">
          {{ company.ratings_count ?? 0 }}
        </div>
      </div>

      <div class="rounded-xl bg-green-50 p-5">
        <div class="text-sm text-slate-500">
          💬 Отзывов
        </div>

        <div class="mt-2 text-3xl font-bold text-green-600">
          {{ company.reviews_count ?? 0 }}
        </div>
      </div>
    </div>

    <div
        v-if="company.last_error"
        class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
    >
      <div class="font-semibold">
        Произошла ошибка
      </div>

      <div class="mt-1 text-sm">
        {{ company.last_error }}
      </div>
    </div>
  </div>
</template>
```
