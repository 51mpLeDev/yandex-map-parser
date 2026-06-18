import { defineStore } from "pinia";
import { ref } from "vue";

import * as api from "../api/reviews";
import type { Review } from "../types/review";
import type { Pagination } from "../types/pagination";

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

            const pagination: Pagination<Review> = data;

            reviews.value = pagination.data;
            page.value = pagination.meta.current_page;
            total.value = pagination.meta.total;
            lastPage.value = pagination.meta.last_page;
            perPage.value = pagination.meta.per_page;
        } finally {
            loading.value = false;
        }
    }

    return {
        reviews,
        page,
        total,
        lastPage,
        perPage,
        loading,
        load,
    };
});