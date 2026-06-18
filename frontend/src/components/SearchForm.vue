<script setup lang="ts">
const url = defineModel<string>({
  required: true,
});

defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 class="mb-4 text-xl font-semibold text-slate-900">
      Получить информацию об организации
    </h2>

    <div class="flex flex-col gap-3 md:flex-row">
      <input
          v-model="url"
          type="text"
          placeholder="https://yandex.ru/maps/~/ABC..."
          class="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      <button
          @click="emit('submit')"
          :disabled="loading"
          class="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? "⏳ Обработка..." : "🚀 Начать парсинг" }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>