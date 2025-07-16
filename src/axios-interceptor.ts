import axios from "axios";

export function setupAxiosInterceptor() {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Customize these as needed
      const refreshStatus = 401; // Example: 401 Unauthorized
      const refreshErrorCode = "AUTH_002"; // Example error code in response

      const originalRequest = error.config;
      // Prevent infinite loop
      if (!originalRequest._retry && error.response) {
        const status = error.response.status;
        const errorCode = error.response.data?.code;
        if (status === refreshStatus && errorCode === refreshErrorCode) {
          originalRequest._retry = true;
          // Dynamically import the auth store to avoid circular dependency
          const { useAuthStore } = await import("./stores/auth");
          const authStore = useAuthStore();
          try {
            await authStore.renewToken();
            // Update Authorization header for the retried request
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${authStore.accessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout and reject
            await authStore.logout();
            return Promise.reject(refreshError);
          }
        }
      }
      return Promise.reject(error);
    }
  );
}
