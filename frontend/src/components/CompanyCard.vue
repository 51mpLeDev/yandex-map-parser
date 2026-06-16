<script setup lang="ts">
import type { Company } from "../types/company";

defineProps<{
  company: Company;
}>();
</script>

<template>
  <div class="card">
    <h2>{{ company.title || "Без названия" }}</h2>

    <p>⭐ Рейтинг: {{ company.rating ?? "-" }}</p>

    <p>📝 Оценок: {{ company.ratings_count }}</p>

    <p>💬 Отзывов: {{ company.reviews_count }}</p>

    <p>Статус: {{ company.status }}</p>

    <p v-if="company.last_error">
      Ошибка: {{ company.last_error }}
    </p>
  </div>
</template>