import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios, { HttpStatusCode } from "axios";

export const useAuthStore = defineStore("auth", () => {
  // State
  const accessToken = ref<string | null>(localStorage.getItem("accessToken"));
  const isRefreshing = ref(false);

  // Getter
  const isAuthenticated = computed(() => !!accessToken.value);

  // Actions
  function setTokens(newAccessToken: string) {
    accessToken.value = newAccessToken;
    localStorage.setItem("accessToken", newAccessToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
  }

  function initialize() {
    if (accessToken.value) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken.value}`;
    }
  }

  async function logout() {
    try {
      // todo : uri 변경
      await axios.post(`/api/alerter/auth/logout`);
    } catch (e) {}
    accessToken.value = null;
    localStorage.removeItem("accessToken");
  }

  async function renewToken() {
    if (isRefreshing.value) {
      while (isRefreshing.value) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      return;
    }
    isRefreshing.value = true;
    try {
      if (!accessToken.value) throw new Error("No tokens");
      const payload = JSON.parse(atob(accessToken.value.split(".")[1]));
      // todo : uri 변경
      const refreshResponse = await axios.post(`/api/alerter/auth/refresh`, {
        userId: payload.sub,
      });
      if (refreshResponse.status === HttpStatusCode.Ok) {
        const { accessToken: newAccessToken } = refreshResponse.data;
        setTokens(newAccessToken);
      } else {
        console.warn(`API Server Return Status : ${refreshResponse.status}`);
        logout();
      }
    } catch (error) {
      console.error("Error occur in refreshing token");
      //router to root
      logout();
    } finally {
      isRefreshing.value = false;
    }
  }

  return {
    accessToken,
    isRefreshing,
    isAuthenticated,
    setTokens,
    initialize,
    logout,
    renewToken,
  };
});
