import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios, { HttpStatusCode } from "axios";

interface UserInfo {
  name: string;
  avatar: string | null;
}

export const useAuthStore = defineStore("auth", () => {
  // State
  const accessToken = ref<string | null>(localStorage.getItem("accessToken"));
  const isRefreshing = ref(false);
  const currentUser = ref<UserInfo | null>(null);

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
      await axios.post(`api/alerter/auth/logout`);
    } catch (e) {}
    accessToken.value = null;
    localStorage.removeItem("accessToken");
    currentUser.value = null;
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
      const refreshResponse = await axios.post(`api/alerter/auth/refresh`, {
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
      logout();
    } finally {
      isRefreshing.value = false;
    }
  }

  async function getCurrentUserInfo() {
    try {
      // todo : uri 변경
      const res = await axios.get(`user`);
      currentUser.value = {
        name: res.data.name,
        avatar: res.data.avatar,
      };
    } catch (e) {
      currentUser.value = null;
    }
  }

  function isAvartar(): boolean {
    if (currentUser) {
      if (currentUser.value?.avatar) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
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
    currentUser,
    getCurrentUserInfo,
    isAvartar,
  };
});
