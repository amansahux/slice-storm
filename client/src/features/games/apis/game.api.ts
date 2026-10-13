import type { AxiosRequestConfig } from "axios";
import axiosInstance from "../../../config/axiosInstance";

export type GameMode = "classic" | "blitz" | "arcade" | "zen";
export type GameStatus = "completed" | "invalid";
export type GameSessionStatus =
  | "active"
  | "completed"
  | "expired"
  | "abandoned";

export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  data: T;
  message?: string;
}

export interface GameSessionData {
  sessionId: string;
  mode: GameMode;
  startedAt: string;
  expiresAt: string;
  status: GameSessionStatus;
}

export interface CreateGamePayload {
  sessionId: string;
  mode: GameMode;
  score: number;
  fruitsSliced?: number;
  fruitsMissed?: number;
  bombsHit?: number;
  maxCombo?: number;
  accuracy?: number;
  duration: number;
  level?: number;
  status?: GameStatus;
}

export interface GameRecord {
  id?: string;
  _id?: string;
  sessionId: string;
  mode: GameMode;
  score: number;
  fruitsSliced: number;
  fruitsMissed: number;
  bombsHit: number;
  maxCombo: number;
  accuracy: number;
  duration: number;
  level: number;
  status: GameStatus;
  createdAt: string;
}

export interface GameHistoryResponseData {
  games: GameRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeaderboardUserEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string | null;
  score: number;
  mode: GameMode;
  fruitsSliced: number;
  maxCombo: number;
  createdAt: string;
}

/**
 * Game Session APIs
 */
export const createSessionAPI = (
  mode: GameMode,
  config?: AxiosRequestConfig
) => {
  return axiosInstance.post<ApiResponse<GameSessionData>>(
    "/sessions",
    { mode },
    config
  );
};

export const updateSessionStatusAPI = (
  sessionId: string,
  status: GameSessionStatus,
  config?: AxiosRequestConfig
) => {
  return axiosInstance.patch<ApiResponse<GameSessionData>>(
    `/sessions/${sessionId}/status`,
    { status },
    config
  );
};

/**
 * Game Run APIs
 */
export const createGameAPI = (
  payload: CreateGamePayload,
  config?: AxiosRequestConfig
) => {
  return axiosInstance.post<ApiResponse<GameRecord>>(
    "/games",
    payload,
    config
  );
};

export const getGameHistoryAPI = (
  params?: { page?: number; limit?: number },
  config?: AxiosRequestConfig
) => {
  return axiosInstance.get<ApiResponse<GameHistoryResponseData>>(
    "/games/history",
    {
      params,
      ...config,
    }
  );
};

/**
 * Leaderboard APIs
 */
export const getGlobalLeaderboardAPI = (config?: AxiosRequestConfig) => {
  return axiosInstance.get<ApiResponse<LeaderboardUserEntry[]>>(
    "/leaderboards/global",
    config
  );
};

export const getModeLeaderboardAPI = (
  mode: GameMode,
  config?: AxiosRequestConfig
) => {
  return axiosInstance.get<ApiResponse<LeaderboardUserEntry[]>>(
    `/leaderboards/${mode}`,
    config
  );
};