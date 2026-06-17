```vue
<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

import CompanyCard from "../components/CompanyCard.vue";
import ReviewsTable from "../components/ReviewsTable.vue";

import { useCompanyStore } from "../stores/company";
import { useReviewsStore } from "../stores/reviews";

const url = ref("");

const companyStore = useCompanyStore();
const reviewsStore = useReviewsStore();

onUnmounted(() => {
  companyStore.stopPolling();
});

async function submit() {
  if (!url.value.trim()) return;

  reviewsStore.reviews = [];
  await companyStore.create(url.value);
}

watch(
    () => companyStore.company?.status,
    async (status) => {
      if (
          status === "completed" &&
          companyStore.company
      ) {
        await reviewsStore.load(companyStore.company.id);
      }
    }
);
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <!-- Header -->
    <header class="border-b border-slate-200 bg-white shadow-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">
            🗺️ Yandex Maps Parser
          </h1>
          <p class="mt-1 text-sm text-slate-500">
            Парсинг информации и отзывов организаций
          </p>
        </div>

        <button
            v-if="companyStore.company"
            @click="companyStore.refresh()"
            class="rounded-xl border border-slate-300 bg-white px-5 py-2 font-medium transition hover:bg-slate-100"
        >
          🔄 Обновить
        </button>
      </div>
    </header>

    <!-- Content -->
    <main class="mx-auto max-w-7xl p-6 space-y-6">
      <!-- Search -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-semibold text-slate-900">
          Получить информацию об организации
        </h2>

        <div class="flex flex-col gap-3 md:flex-row">
          <input
              v-model="url"
              type="text"
              placeholder="https://yandex.ru/maps/org/..."
              class="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <button
              @click="submit"
              :disabled="companyStore.loading"
              class="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{
              companyStore.loading
                  ? "⏳ Обработка..."
                  : "🚀 Начать парсинг"
            }}
          </button>
        </div>
      </div>

      <!-- Company -->
      <CompanyCard
          v-if="companyStore.company"
          :company="companyStore.company"
      />

      <!-- Reviews -->
      <ReviewsTable
          v-if="reviewsStore.reviews.length"
          :reviews="reviewsStore.reviews"
      />
    </main>
  </div>
</template>
```
