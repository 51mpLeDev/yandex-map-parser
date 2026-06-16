import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "../pages/LoginPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";
import {useAuthStore} from "../stores/auth.ts";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login",
            component: LoginPage,
        },
        {
            path: "/",
            component: DashboardPage,
            meta: {
                requiresAuth: true,
            },
        },
    ],
});

router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    await authStore.init();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return '/login'
    }

    if (to.path === '/login' && authStore.isAuthenticated) {
        return '/'
    }

    return true
})

export default router;