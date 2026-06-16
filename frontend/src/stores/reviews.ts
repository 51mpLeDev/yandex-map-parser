import { defineStore } from "pinia";
import { ref } from "vue";

import * as api from "../api/reviews";
import type { Review } from "../types/review";

export const useReviewsStore = defineStore("reviews", () => {
    const reviews = ref<Review[]>([]);
    const page = ref(1);
    const total = ref(0);

    async function load(companyId: number, currentPage = 1) {
        const { data } = await api.getReviews(companyId, currentPage);

        reviews.value = data.data;
        total.value = data.total;
        page.value = data.current_page;
    }

    return {
        reviews,
        page,
        total,
        load,
    };
});