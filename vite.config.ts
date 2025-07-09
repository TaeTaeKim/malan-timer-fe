import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/extract": {
        target: "http://39.115.66.158:38000", // AI 서버 주소로 변경 가능
        changeOrigin: true,
      },
    },
  },
});
