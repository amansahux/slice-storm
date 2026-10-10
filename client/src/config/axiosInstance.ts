import axios from "axios";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Extend Axios config with retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ---------- API Base URL ----------

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ---------- Axios Instance ----------

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// ---------- Token Refresh Queue ----------

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (reason?: unknown) => void;
}> = [];

// Process requests waiting for token refresh
const processQueue = (error: unknown | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
};

// ---------- Response Interceptor ----------

axiosInstance.interceptors.response.use(
  // Successful response
  (response) => {
    return response;
  },

  // Failed response
  async (error: AxiosError) => {
    const originalRequest =
      error.config as CustomAxiosRequestConfig | undefined;

    // No request config or not a 401 error
    if (
      !originalRequest ||
      error.response?.status !== 401
    ) {
      return Promise.reject(error);
    }

    // Prevent infinite refresh loops
    if (
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/logout") ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // ---------- Refresh already in progress ----------

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then(() => {
        return axiosInstance(originalRequest);
      });
    }

    // ---------- Start Token Refresh ----------

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Use the original axios instance so this request
      // does not trigger our interceptor again.
      await axios.post(
        `${API_BASE_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );

      // Refresh successful
      processQueue(null);

      // Retry original request
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;