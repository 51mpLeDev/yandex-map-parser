<script setup lang="ts">
import type { Review } from "../types/review";

defineProps<{
  reviews: Review[];
}>();
</script>

<template>
  <table>
    <thead>
    <tr>
      <th>Автор</th>
      <th>★</th>
      <th>Дата</th>
      <th>Отзыв</th>
    </tr>
    </thead>

    <tbody>
    <tr
        v-for="review in reviews"
        :key="review.external_id"
    >
      <td>{{ review.author }}</td>

      <td>{{ review.rating }}</td>

      <td>{{ review.published_at }}</td>

      <td>{{ review.text }}</td>
    </tr>
    </tbody>
  </table>
</template>