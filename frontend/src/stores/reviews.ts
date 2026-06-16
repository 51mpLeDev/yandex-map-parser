import { defineStore } from "pinia";
import { ref } from "vue";

import * as api from "../api/reviews";
import type { Review } from "../types/review";

export const useReviewsStore = defineStore("reviews", () => {
    const reviews = ref<Review[]>([]);
    const page = ref(1);
    const total = ref(0);
    const lastPage = ref(0);
    const perPage = ref(0);
    const loading = ref(false);

    async function load(companyId: number, currentPage = 1) {
        loading.value = true;

        try {
            const { data } = await api.getReviews(companyId, currentPage);

            reviews.value = data.data;
            total.value = data.total;
            page.value = data.current_page;
            lastPage.value = data.last_page;
            perPage.value = data.per_page;
        } finally {
            loading.value = false;
        }
    }

    return {
        reviews,
        page,
        total,
        load,
        lastPage,
        perPage,
        loading,
    };
});