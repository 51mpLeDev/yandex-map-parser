import { defineStore } from "pinia";

import * as authApi from "../api/auth";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as unknown,
        loading: false,
    }),

    actions: {
        async login(email: string, password: string) {
            this.loading = true;

            try {
                await authApi.login(email, password);
                const response = await authApi.me();
                this.user = response.data;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            await authApi.logout();
            this.user = null;
        },
    },
});