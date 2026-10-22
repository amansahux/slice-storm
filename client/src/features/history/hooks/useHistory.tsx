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

export const useHistory = () => {
  const [filterMode, setFilterMode] = useState<HistoryFilterMode>("all");
  const [sortOption, setSortOption] = useState<HistorySortOption>("newest");
  const [timeframe, setTimeframe] = useState<HistoryTimeframe>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRun, setSelectedRun] = useState<GameRunRecord | null>(null);

  const authUser = useSelector((state: RootState) => state.auth.user);
  const pageSize = 10;

  // TanStack Query for remote server state (Rule 06: Data Fetching)
  const {
    data: historyData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [...HISTORY_QUERY_KEY, authUser?._id],
    queryFn: async ({ signal }) => {
      // Fetch up to 100 runs for rich analytics, telemetry chart, and client filtering
      const res = await getGameHistoryAPI({ page: 1, limit: 100 }, { signal });
      return res.data.data;
    },
    enabled: Boolean(authUser),
    staleTime: 1000 * 60 * 2, // 2 minutes cache validity
    gcTime: 1000 * 60 * 10,   // 10 minutes memory retention
    refetchOnWindowFocus: false,
  });

  const allRuns: GameRunRecord[] = useMemo(() => {
    return historyData?.games || [];
  }, [historyData]);

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
      totalRuns: Math.max(runsCount, authUser?.totalGames || 0),
      totalFruitsSliced: Math.max(totalFruits, authUser?.totalFruitsSliced || 0),
      avgScore: Math.round(totalScore / (runsCount || 1)),
      avgAccuracy: Math.round(totalAccuracy / (runsCount || 1)),
      classicRuns: classicCount,
      blitzRuns: blitzCount,
      zenRuns: zenCount,
      bestRunDate: bestDate
        ? new Date(bestDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "N/A",
    };
  }, [allRuns, authUser]);

  // Golden Run / Personal Best Record Run
  const goldenRun = useMemo(() => {
    if (!allRuns.length) return null;
    return [...allRuns].sort((a, b) => b.score - a.score)[0] || null;
  }, [allRuns]);

  // Top 5 Runs Mini Hall-of-Fame
  const topFiveRuns = useMemo(() => {
    if (!allRuns.length) return [];
    return [...allRuns]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [allRuns]);

  // Telemetry Chart Data (Last 10 runs in chronological order)
  const telemetryData = useMemo(() => {
    if (!allRuns.length) return [];
    // slice newest 10 runs, then reverse to chronological sequence (oldest -> newest)
    return [...allRuns].slice(0, 10).reverse();
  }, [allRuns]);

  // Filtered and Sorted runs list (Rule 12: memoize expensive transformations)
  const filteredRuns = useMemo(() => {
    let result = [...allRuns];

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
  }, [allRuns, filterMode, timeframe, sortOption]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / pageSize));

  const paginatedRuns = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRuns.slice(start, start + pageSize);
  }, [filteredRuns, currentPage, pageSize]);

  // Stable handlers (Rule 01)
  const handleFilterModeChange = useCallback((mode: HistoryFilterMode) => {
    setFilterMode(mode);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: HistorySortOption) => {
    setSortOption(sort);
    setCurrentPage(1);
  }, []);

  const handleTimeframeChange = useCallback((time: HistoryTimeframe) => {
    setTimeframe(time);
    setCurrentPage(1);
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
    totalCount: filteredRuns.length,
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
