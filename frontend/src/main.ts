import { createApp } from "vue";
import { createPinia } from "pinia";
import {useAuthStore} from "./stores/auth.ts";

import App from "./App.vue";
import router from "./router/index.ts";

import "./style.css";

const app = createApp(App);

app.use(createPinia());

const authStore = useAuthStore();
await authStore.init();

app.use(router);

app.mount("#app");