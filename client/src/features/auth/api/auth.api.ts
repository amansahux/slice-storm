import type { AxiosRequestConfig } from "axios";
import axiosInstance from "../../../config/axiosInstance";

// ---------- Payload & Entity Types ----------
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string | null;
  highestScore: number;
  totalGames: number;
  totalFruitsSliced: number;
  highestCombo: number;
  averageScore: number;
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// ---------- API Response Shapes ----------
export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  data: T;
  message?: string;
}

export interface LoginResponseData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

// ---------- API Functions ----------
export const loginApi = (
  payload: LoginPayload,
  config?: AxiosRequestConfig
) => {
  return axiosInstance.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    payload,
    config
  );
};

export const registerApi = (
  payload: RegisterPayload,
  config?: AxiosRequestConfig
) => {
  return axiosInstance.post<ApiResponse<AuthUser>>(
    "/auth/register",
    payload,
    config
  );
};

export const logoutApi = (config?: AxiosRequestConfig) => {
  return axiosInstance.post<ApiResponse<{ message: string }>>(
    "/auth/logout",
    {},
    config
  );
};

export const getProfileApi = (config?: AxiosRequestConfig) => {
  return axiosInstance.get<ApiResponse<AuthUser>>("/auth/profile", config);
};

export const refreshTokenApi = (config?: AxiosRequestConfig) => {
  return axiosInstance.post<ApiResponse<RefreshTokenResponseData>>(
    "/auth/refresh-token",
    {},
    config
  );
};
