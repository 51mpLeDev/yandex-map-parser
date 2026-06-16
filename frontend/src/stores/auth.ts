import { defineStore } from "pinia";

import * as authApi from "../api/auth";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as unknown,
        loading: false,
        initialized: false,
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.user),
    },

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

        async init() {
            if (this.initialized) {
                return;
            }

            try {
                const response = await authApi.me();
                this.user = response.data;
            } catch {
                this.user = null;
            } finally {
                this.initialized = true;
            }
        }
    },
});