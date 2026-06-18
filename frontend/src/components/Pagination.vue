<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  page: number;
  lastPage: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "change", page: number): void;
}>();

const visiblePages = computed(() => {
  const start = Math.max(1, props.page - 2);
  const end = Math.min(props.lastPage, props.page + 2);

  return Array.from(
      {length: end - start + 1},
      (_, i) => start + i,
  );
});

function go(page: number) {
  if (
      page < 1 ||
      page > props.lastPage ||
      page === props.page ||
      props.loading
  ) {
    return;
  }

  emit("change", page);
}
</script>

<template>
  <div
      v-if="lastPage > 1"
      class="mt-8 flex items-center justify-center gap-2"
  >
    <button
        :disabled="loading || page === 1"
        @click="go(page - 1)"
        class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      ← Назад
    </button>

    <button
        v-for="p in visiblePages"
        :key="p"
        @click="go(p)"
        :class="[
      'rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200',
      p === page
        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
        : 'border-slate-300 bg-white text-slate-700 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'
    ]"
    >
      {{ p }}
    </button>

    <button
        :disabled="loading || page === lastPage"
        @click="go(page + 1)"
        class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Вперёд →
    </button>
  </div>
</template>

<style scoped>

</style>