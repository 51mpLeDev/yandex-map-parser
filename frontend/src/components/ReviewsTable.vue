<script setup lang="ts">
import { computed, ref } from "vue";
import type { Review } from "../types/review";

const props = defineProps<{
  reviews: Review[];
  total: number;
  page: number;
  perPage: number;
}>();

const from = computed(() => {
  if (props.total === 0) return 0;

  return (props.page - 1) * props.perPage + 1;
});

const to = computed(() => {
  return Math.min(props.page * props.perPage, props.total);
});

const search = ref("");

const filteredReviews = computed(() => {
  const q = search.value.toLowerCase().trim();

  if (!q) return props.reviews;

  return props.reviews.filter((r) =>
      [
        r.author,
        r.text,
        String(r.rating),
        r.published_at,
      ]
          .join(" ")
          .toLowerCase()
          .includes(q),
  );
});

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("ru-RU");
}

function stars(rating: number|null) {
  if (!rating) rating = 0
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-3xl font-bold text-slate-900">
          Отзывы
        </h2>

        <p class="text-slate-500">
          Показано {{ from }}–{{ to }} из {{ total }} отзывов
        </p>
      </div>

      <input
          v-model="search"
          type="text"
          placeholder="Поиск..."
          class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:w-96"
      />
    </div>

    <div class="max-h-[75vh] space-y-4 overflow-y-auto">
      <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
      >
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div class="flex items-center gap-4">
            <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white"
            >
              {{ review.author?.charAt(0)?.toUpperCase() || "?" }}
            </div>

            <div>
              <div class="font-semibold text-slate-900">
                {{ review.author }}
              </div>

              <div class="text-sm text-slate-500">
                {{ formatDate(review.published_at) }}
              </div>
            </div>
          </div>

          <div class="text-lg font-medium text-amber-500">
            {{ stars(review.rating) }}
          </div>
        </div>

        <div
            class="mt-5 rounded-xl bg-slate-50 p-4 text-[15px] leading-7 text-slate-700"
        >
          {{ review.text }}
        </div>
      </div>
    </div>
  </div>
</template>
