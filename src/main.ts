import { createApp } from "vue";
import "./style.css";
import App from "./views/App.vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import AuthCallback from "./views/AuthCallback.vue";
import { setupAxiosInterceptor } from "./axios-interceptor";

const routes = [
  { path: "/", component: Home },
  { path: "/auth/callback", component: AuthCallback },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.PROD ? "/malan-timer/" : "/"),
  routes,
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
setupAxiosInterceptor();
app.mount("#app");
