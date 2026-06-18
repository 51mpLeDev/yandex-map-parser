<script setup lang="ts">
import {ref, watch, onUnmounted} from "vue";

import CompanyCard from "../components/CompanyCard.vue";
import ReviewsTable from "../components/ReviewsTable.vue";

import {useCompanyStore} from "../stores/company";
import {useReviewsStore} from "../stores/reviews";

import Pagination from "../components/Pagination.vue";
import SearchForm from "../components/SearchForm.vue";
const url = ref("");

const companyStore = useCompanyStore();
const reviewsStore = useReviewsStore();

onUnmounted(() => {
  companyStore.stopPolling();
});

async function submit() {
  if (!url.value.trim()) return;

  reviewsStore.reviews = [];
  reviewsStore.page = 1;

  await companyStore.create(url.value);
}

async function changePage(page: number) {
  if (!companyStore.company) return;

  await reviewsStore.load(companyStore.company.id, page);
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
  <div class="min-h-screen bg-slate-50">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 class="text-4xl font-bold tracking-tight text-slate-900">
            🗺️ Yandex Maps Parser
          </h1>
          <p class="mt-2 text-base text-slate-500">
            Получение информации об организациях и парсинг отзывов из Яндекс Карт
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
    <main class="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <!-- Search -->
      <SearchForm
          v-model="url"
          :loading="companyStore.loading"
          @submit="submit"
      />
      <section class="space-y-6">
        <!-- Company -->
        <CompanyCard
            v-if="companyStore.company"
            :company="companyStore.company"
        />

        <!-- Reviews -->
        <ReviewsTable
            v-if="reviewsStore.reviews.length"
            :reviews="reviewsStore.reviews"
            :total="reviewsStore.total"
            :page="reviewsStore.page"
            :per-page="reviewsStore.perPage"
        />

        <Pagination
            v-if="reviewsStore.lastPage > 1 && reviewsStore.reviews.length"
            :page="reviewsStore.page"
            :last-page="reviewsStore.lastPage"
            :loading="reviewsStore.loading"
            @change="changePage"
        />
      </section>
    </main>
  </div>
</template>
