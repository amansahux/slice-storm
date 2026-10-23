import type { AxiosRequestConfig } from "axios";
import axiosInstance from "../../../config/axiosInstance";
import type { ApiResponse } from "../../auth/api/auth.api";

export interface DashboardProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  tokens: number;
  bladeTheme: string;
  bladeSharpness: number;
  rank: number | null;
  gapToNextRank: number;
  nextRivalName: string | null;
}

export interface DashboardStats {
  highestScore: number;
  highestScoreMode: string;
  highestCombo: number;
  totalGames: number;
  totalFruitsSliced: number;
  averageScore: number;
  estimatedPlayTimeHours: number;
  accuracy: number;
}

export interface DashboardRecentRun {
  id: string;
  sessionId: string;
  mode: string;
  score: number;
  fruitsSliced: number;
  fruitsMissed: number;
  bombsHit: number;
  maxCombo: number;
  accuracy: number;
  duration: number;
  status: string;
  createdAt: string;
}

export interface DashboardLeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  score: number;
  mode: string;
  maxCombo: number;
  isCurrentPlayer: boolean;
}

export interface DashboardBounty {
  id: string;
  title: string;
  description: string;
  rewardTokens: number;
  current: number;
  target: number;
  progressPercent: number;
  completed: boolean;
  icon: string;
}

export interface DashboardTrophy {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
  unlockedAt?: string | null;
}

export interface DashboardSummaryData {
  profile: DashboardProfile;
  stats: DashboardStats;
  recentRuns: DashboardRecentRun[];
  leaderboardPreview: DashboardLeaderboardEntry[];
  dailyBounties: DashboardBounty[];
  trophies: DashboardTrophy[];
  resetsInHours: number;
}

/**
 * Fetch authenticated player's full arcade dashboard summary
 * Route: GET /api/dashboard/summary
 */
export const getDashboardSummaryAPI = (config?: AxiosRequestConfig) => {
  return axiosInstance.get<ApiResponse<DashboardSummaryData>>("/dashboard/summary", config);
};
