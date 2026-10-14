
import axiosInstance from "../../../config/axiosInstance";
import type { ApiResponse } from "../../auth/api/auth.api";
import type { AxiosRequestConfig } from "axios";


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

export type GameMode = "classic" | "arcade" | "zen";
/**D
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