import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "../pages/LoginPage.vue";
import DashboardPage from "../pages/DashboardPage.vue";

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
        },
    ],
});

export default router;