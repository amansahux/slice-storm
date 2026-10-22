import type { AxiosRequestConfig } from "axios";
import axiosInstance from "../../../config/axiosInstance";
import type { ApiResponse } from "../../auth/api/auth.api";
import type { GameMode, GameStatus } from "../../games/apis/game.api";

export interface GameRunRecord {
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
  status: GameStatus;
  createdAt: string;
}

export interface GameHistoryPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GameHistoryResponseData {
  games: GameRunRecord[];
  pagination: GameHistoryPagination;
}

export interface GetGameHistoryParams {
  page?: number;
  limit?: number;
}

/**
 * Fetch authenticated user's game run history
 * Route: GET /api/games/history
 */
export const getGameHistoryAPI = (
  params?: GetGameHistoryParams,
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
