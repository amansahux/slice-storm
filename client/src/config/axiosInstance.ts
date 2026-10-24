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
const API_BASE_URL = "/api";

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

// ---------- Centralized Auth Failure Callback & Redirect ----------
type OnAuthFailureCallback = () => void;
let onAuthFailureCallback: OnAuthFailureCallback | null = null;

export const setOnAuthFailureCallback = (callback: OnAuthFailureCallback) => {
  onAuthFailureCallback = callback;
};

export const handleAuthFailure = (requestUrl?: string) => {
  // 1. Reset Redux auth state / Query cache
  if (onAuthFailureCallback) {
    try {
      onAuthFailureCallback();
    } catch (e) {
      console.error("Failed to execute onAuthFailureCallback:", e);
    }
  }

  // 2. Perform safe browser redirect to /login
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;

    // Do not redirect if already on login or register
    if (pathname === "/login" || pathname === "/register") {
      return;
    }

    const isPublicPage = [
      "/",
      "/terms",
      "/privacy",
      "/safety",
      "/support",
    ].includes(pathname);

    const isInitialProfileCheck = requestUrl?.includes("/auth/profile");

    // Guest users peacefully browsing the landing or policy pages should not be kicked to /login
    if (isPublicPage && isInitialProfileCheck) {
      return;
    }

    // Protected page or protected API failure: redirect to /login with target return URL
    const searchParams = new URLSearchParams(window.location.search);
    if (!isPublicPage) {
      searchParams.set("from", pathname);
    }
    const queryString = searchParams.toString();
    const target = queryString ? `/login?${queryString}` : "/login";

    window.location.replace(target);
  }
};

// ---------- Response Interceptor ----------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as CustomAxiosRequestConfig | undefined;

    // Not a 401 error or no config available
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Direct auth form failures (wrong credentials on login or email conflict on register)
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    // Prevent infinite refresh loops and handle unrecoverable 401s
    if (
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/logout") ||
      originalRequest._retry
    ) {
      handleAuthFailure(originalRequest.url);
      return Promise.reject(error);
    }

    // Refresh already in progress: queue request
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

    // Start Token Refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axios.post(
        `${API_BASE_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );

      // Refresh successful: process queued requests and retry original
      processQueue(null);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Refresh failed: reject queue, clear session, and redirect to /login
      processQueue(refreshError);
      handleAuthFailure(originalRequest.url);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;