<script setup lang="ts">
import { ref, watch } from "vue";

import CompanyCard from "../components/CompanyCard.vue";
import ReviewsTable from "../components/ReviewsTable.vue";

import { useCompanyStore } from "../stores/company";
import { useReviewsStore } from "../stores/reviews";

const url = ref("");

const companyStore = useCompanyStore();
const reviewsStore = useReviewsStore();

async function submit() {
  await companyStore.create(url.value);
}

watch(
    () => companyStore.company,
    async (company) => {
      if (!company) return;

      await reviewsStore.load(company.id);
    },
    {
      deep: true,
    },
);
</script>

<template>
  <div class="dashboard">
    <h1>Yandex Maps Parser</h1>

    <input
        v-model="url"
        placeholder="https://yandex.ru/maps/org/..."
    />

    <button
        @click="submit"
        :disabled="companyStore.loading"
    >
      Получить данные
    </button>

    <button
        v-if="companyStore.company"
        @click="companyStore.refresh()"
    >
      Обновить
    </button>

    <CompanyCard
        v-if="companyStore.company"
        :company="companyStore.company"
    />

    <ReviewsTable
        v-if="reviewsStore.reviews.length"
        :reviews="reviewsStore.reviews"
    />
  </div>
</template>