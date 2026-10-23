import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../../../app/store";
import {
  getDashboardSummaryAPI,
  type DashboardSummaryData,
  type DashboardRecentRun,
  type DashboardLeaderboardEntry,
} from "../api/dashboard.api";
import { playArcadeSound } from "../../../shared/utils/arcadeAudio";

export const DASHBOARD_QUERY_KEY = ["dashboardSummary"] as const;

export const useDashboard = () => {
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);

  // TanStack Query for caching, fetching, and server-state management
  const {
    data: summaryData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<DashboardSummaryData>({
    queryKey: [...DASHBOARD_QUERY_KEY, authUser?._id],
    queryFn: async ({ signal }) => {
      const res = await getDashboardSummaryAPI({ signal });
      return res.data.data;
    },
    enabled: Boolean(authUser),
    staleTime: 1000 * 60 * 2, // 2 minutes fresh cache
    gcTime: 1000 * 60 * 10,   // 10 minutes cache retention in memory
    refetchOnWindowFocus: false,
  });

  // Derived computations (Rule 02: derive from existing state, Rule 12: memoize only when useful)
  const profile = summaryData?.profile;
  const stats = summaryData?.stats;
  const recentRuns: DashboardRecentRun[] = useMemo(
    () => summaryData?.recentRuns ?? [],
    [summaryData?.recentRuns]
  );
  const leaderboardPreview: DashboardLeaderboardEntry[] = useMemo(
    () => summaryData?.leaderboardPreview ?? [],
    [summaryData?.leaderboardPreview]
  );

  const isEmpty = useMemo(() => {
    return Boolean(
      summaryData &&
      (stats?.totalGames ?? 0) === 0 &&
      recentRuns.length === 0
    );
  }, [summaryData, stats?.totalGames, recentRuns.length]);

  // Actions & Navigation handlers encapsulated in the hook layer
  const handlePlayNow = useCallback(() => {
    playArcadeSound("slash");
    navigate("/arcade");
  }, [navigate]);

  const handleInsertCoinAndPlay = useCallback(() => {
    playArcadeSound("click");
    navigate("/arcade");
  }, [navigate]);

  const handleViewLeaderboard = useCallback(() => {
    playArcadeSound("blip");
    navigate("/leaderboard");
  }, [navigate]);

  const handleViewHistory = useCallback(() => {
    playArcadeSound("blip");
    navigate("/history");
  }, [navigate]);

  const handleReplayTape = useCallback((sessionId: string) => {
    playArcadeSound("slash");
    navigate(`/arcade?replay=${sessionId}`);
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    playArcadeSound("click");
    refetch();
  }, [refetch]);

  return {
    // Data objects
    summary: summaryData,
    profile,
    stats,
    recentRuns,
    leaderboardPreview,

    // Status flags
    isLoading,
    isFetching,
    isError,
    isEmpty,
    errorMessage: error instanceof Error ? error.message : "Failed to load dashboard data",
    isAuthenticated: Boolean(authUser),

    // Business Actions
    handlePlayNow,
    handleInsertCoinAndPlay,
    handleViewLeaderboard,
    handleViewHistory,
    handleReplayTape,
    refetch: handleRefresh,
  };
};
