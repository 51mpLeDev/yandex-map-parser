import { defineStore } from "pinia";
import { ref } from "vue";

import * as api from "../api/company";
import type { Company } from "../types/company";

export const useCompanyStore = defineStore("company", () => {
    const company = ref<Company | null>(null);
    const loading = ref(false);

    async function create(url: string) {
        loading.value = true;

        try {
            const { data } = await api.createCompany(url);
            company.value = data.data ?? data;
            startPolling();
        } finally {
            loading.value = false;
        }
    }

    async function load(id?: number) {
        const { data } = await api.getCompany(id);
        company.value = data.data ?? data;
    }

    async function refresh() {
        if (!company.value) return;

        await api.refreshCompany(company.value.id);
        await load(company.value.id);

        if (company.value?.status === "pending") {
            startPolling();
        }
    }

    let timer: number | null = null;

    function stopPolling() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    function startPolling() {
        stopPolling();

        timer = window.setInterval(async () => {
            await load();

            if (company.value?.status === "completed") {
                stopPolling();
            }

            if (company.value?.status === "failed") {
                stopPolling();
            }
        }, 3000);
    }

    return {
        company,
        loading,
        create,
        load,
        refresh,
        startPolling,
        stopPolling
    };
});