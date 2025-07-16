import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  let base = "/";
  if (mode === "production") {
    base = "/malan-timer/";
  }

  return {
    plugins: [vue()],
    base,
    server: {
      proxy: {
        "/extract": {
          target: "http://39.115.66.158:38000",
          changeOrigin: true,
        },
        "/timer/image": {
          target: "http://localhost:8000",
          changeOrigin: true,
        },
        "/user": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  };
});
