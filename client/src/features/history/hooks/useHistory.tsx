import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  getGameHistoryAPI,
  type GameRunRecord,
} from "../api/history.api";
import type { GameMode } from "../../games/apis/game.api";

export type HistoryFilterMode = "all" | GameMode;
export type HistorySortOption = "newest" | "highest_score" | "max_combo" | "duration";
export type HistoryTimeframe = "all" | "today" | "week" | "month";

export const HISTORY_QUERY_KEY = ["gameHistory"] as const;
export const HISTORY_PAGE_QUERY_KEY = ["gameHistoryPage"] as const;

export const useHistory = () => {
  const [filterMode, setFilterMode] = useState<HistoryFilterMode>("all");
  const [sortOption, setSortOption] = useState<HistorySortOption>("newest");
  const [timeframe, setTimeframe] = useState<HistoryTimeframe>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRun, setSelectedRun] = useState<GameRunRecord | null>(null);

  const authUser = useSelector((state: RootState) => state.auth.user);
  const pageSize = 10;

  // 1. Overall Profile / Telemetry Query (fetches top 50 recent games to derive metrics, personal best & telemetry chart)
  const {
    data: allRunsData,
  } = useQuery({
    queryKey: [...HISTORY_QUERY_KEY, authUser?._id],
    queryFn: async ({ signal }) => {
      const res = await getGameHistoryAPI({ page: 1, limit: 50 }, { signal });
      return res.data.data;
    },
    enabled: Boolean(authUser),
    staleTime: 1000 * 60 * 2, // 2 minutes cache validity
    gcTime: 1000 * 60 * 10,   // 10 minutes memory retention
    refetchOnWindowFocus: false,
  });

  // 2. Dedicated Backend Paginated Query (Requirement 3: Backend-based pagination)
  const {
    data: paginatedData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [...HISTORY_PAGE_QUERY_KEY, authUser?._id, currentPage, pageSize],
    queryFn: async ({ signal }) => {
      const res = await getGameHistoryAPI({ page: currentPage, limit: pageSize }, { signal });
      return res.data.data;
    },
    enabled: Boolean(authUser),
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const allRuns: GameRunRecord[] = useMemo(() => {
    return allRunsData?.games || [];
  }, [allRunsData]);

  // Overall Performance Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (!allRuns.length) {
      return {
        bestScore: authUser?.highestScore || 0,
        bestCombo: authUser?.highestCombo || 0,
        totalRuns: authUser?.totalGames || 0,
        totalFruitsSliced: authUser?.totalFruitsSliced || 0,
        avgScore: authUser?.averageScore || 0,
        avgAccuracy: 0,
        classicRuns: 0,
        blitzRuns: 0,
        zenRuns: 0,
        bestRunDate: "N/A",
      };
    }

    let maxScore = 0;
    let maxCombo = 0;
    let totalScore = 0;
    let totalFruits = 0;
    let totalAccuracy = 0;
    let classicCount = 0;
    let blitzCount = 0;
    let zenCount = 0;
    let bestDate = "";

    for (let i = 0; i < allRuns.length; i++) {
      const r = allRuns[i];
      if (r.score > maxScore) {
        maxScore = r.score;
        bestDate = r.createdAt;
      }
      if (r.maxCombo > maxCombo) {
        maxCombo = r.maxCombo;
      }
      totalScore += r.score || 0;
      totalFruits += r.fruitsSliced || 0;
      totalAccuracy += r.accuracy || 0;

      if (r.mode === "classic") classicCount++;
      else if (r.mode === "arcade") blitzCount++;
      else if (r.mode === "zen") zenCount++;
    }

    const runsCount = allRuns.length;
    return {
      bestScore: Math.max(maxScore, authUser?.highestScore || 0),
      bestCombo: Math.max(maxCombo, authUser?.highestCombo || 0),
      totalRuns: paginatedData?.pagination?.total || authUser?.totalGames || runsCount,
      totalFruitsSliced: Math.max(totalFruits, authUser?.totalFruitsSliced || 0),
      avgScore: authUser?.averageScore || (runsCount > 0 ? Math.round(totalScore / runsCount) : 0),
      avgAccuracy: runsCount > 0 ? Math.round(totalAccuracy / runsCount) : 0,
      classicRuns: classicCount,
      blitzRuns: blitzCount,
      zenRuns: zenCount,
      bestRunDate: bestDate ? new Date(bestDate).toLocaleDateString() : "RECENT",
    };
  }, [allRuns, authUser, paginatedData]);

  // Golden Run Ticket (Personal All-Time High)
  const goldenRun: GameRunRecord | null = useMemo(() => {
    if (!allRuns.length) return null;
    return allRuns.reduce((prev, current) =>
      current.score > prev.score ? current : prev
    );
  }, [allRuns]);

  // Top 5 Runs Mini Leaderboard
  const topFiveRuns = useMemo(() => {
    if (!allRuns.length) return [];
    return [...allRuns]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [allRuns]);

  // Telemetry Progression Data (Chronological order)
  const telemetryData = useMemo(() => {
    if (!allRuns.length) return [];
    return [...allRuns]
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .slice(-10); // Last 10 matches trend curve
  }, [allRuns]);

  // Backend Paginated Runs with active filters/sorting
  const rawPageRuns = useMemo(() => {
    return paginatedData?.games || [];
  }, [paginatedData]);

  const paginatedRuns = useMemo(() => {
    let result = [...rawPageRuns];

    // 1. Mode filter
    if (filterMode !== "all") {
      result = result.filter((r) => r.mode === filterMode);
    }

    // 2. Timeframe filter
    if (timeframe !== "all") {
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      result = result.filter((r) => {
        const itemTime = new Date(r.createdAt).getTime();
        const diff = now - itemTime;
        if (timeframe === "today") return diff <= oneDay;
        if (timeframe === "week") return diff <= oneDay * 7;
        if (timeframe === "month") return diff <= oneDay * 30;
        return true;
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortOption === "highest_score") return b.score - a.score;
      if (sortOption === "max_combo") return b.maxCombo - a.maxCombo;
      if (sortOption === "duration") return b.duration - a.duration;
      // Default: newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [rawPageRuns, filterMode, timeframe, sortOption]);

  const totalPages = Math.max(1, paginatedData?.pagination?.totalPages || 1);
  const totalCount = paginatedData?.pagination?.total || 0;

  // Stable handlers (Rule 01)
  const handleFilterModeChange = useCallback((mode: HistoryFilterMode) => {
    setFilterMode(mode);
  }, []);

  const handleSortChange = useCallback((sort: HistorySortOption) => {
    setSortOption(sort);
  }, []);

  const handleTimeframeChange = useCallback((time: HistoryTimeframe) => {
    setTimeframe(time);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const openRunModal = useCallback((run: GameRunRecord) => {
    setSelectedRun(run);
  }, []);

  const closeRunModal = useCallback(() => {
    setSelectedRun(null);
  }, []);

  return {
    filterMode,
    sortOption,
    timeframe,
    currentPage,
    totalPages,
    totalCount,
    allRunsCount: allRuns.length,
    paginatedRuns,
    summaryMetrics,
    goldenRun,
    topFiveRuns,
    telemetryData,
    selectedRun,
    authUser,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    handleFilterModeChange,
    handleSortChange,
    handleTimeframeChange,
    handlePageChange,
    openRunModal,
    closeRunModal,
  };
};
