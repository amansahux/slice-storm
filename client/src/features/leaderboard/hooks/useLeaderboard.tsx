import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import {
  getGlobalLeaderboardAPI,
  getModeLeaderboardAPI,
  type LeaderboardUserEntry,
  type GameMode,
} from "../api/leaderboard.api";

export type LeaderboardFilterMode = "all" | GameMode;

export const LEADERBOARD_QUERY_KEY = ["leaderboard"] as const;

export const useLeaderboard = () => {
  const [filterMode, setFilterMode] = useState<LeaderboardFilterMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const authUser = useSelector((state: RootState) => state.auth.user);

  // TanStack Query for server state management (Rule 06: Data Fetching)
  const {
    data: leaderboardEntries = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<LeaderboardUserEntry[]>({
    queryKey: [...LEADERBOARD_QUERY_KEY, filterMode],
    queryFn: async ({ signal }) => {
      if (filterMode === "all") {
        const res = await getGlobalLeaderboardAPI({ signal });
        return res.data.data ?? [];
      } else {
        const res = await getModeLeaderboardAPI(filterMode, { signal });
        return res.data.data ?? [];
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes cache validity
    gcTime: 1000 * 60 * 10,   // 10 minutes garbage collection
    refetchOnWindowFocus: false,
  });

  // Top 3 Podium Winners (from full server ranking)
  const podium = useMemo(() => {
    return {
      first: leaderboardEntries[0] || null,
      second: leaderboardEntries[1] || null,
      third: leaderboardEntries[2] || null,
    };
  }, [leaderboardEntries]);

  // All-time highest score peak in the cabinet
  const peakScore = useMemo(() => {
    if (!leaderboardEntries.length) return 0;
    return leaderboardEntries[0]?.score || 0;
  }, [leaderboardEntries]);

  // Current logged in user's position in this leaderboard
  const currentUserRanking = useMemo(() => {
    if (!authUser) return null;

    // Check by user._id or by name
    const foundIndex = leaderboardEntries.findIndex(
      (entry) =>
        (entry.userId && entry.userId === authUser._id) ||
        (entry.name && entry.name.toLowerCase() === authUser.name.toLowerCase())
    );

    if (foundIndex !== -1) {
      const entry = leaderboardEntries[foundIndex];
      const nextRival = foundIndex > 0 ? leaderboardEntries[foundIndex - 1] : null;
      const pointGap = nextRival ? Math.max(0, nextRival.score - entry.score) : 0;
      const progressPercent = nextRival
        ? Math.min(100, Math.round((entry.score / nextRival.score) * 100))
        : 100;

      return {
        rank: entry.rank || foundIndex + 1,
        entry,
        nextRival,
        pointGap,
        progressPercent,
      };
    }

    // Fallback if user hasn't played on this specific filter yet
    return {
      rank: null,
      entry: null,
      nextRival: leaderboardEntries[0] || null,
      pointGap: leaderboardEntries[0]
        ? Math.max(0, leaderboardEntries[0].score - (authUser.highestScore || 0))
        : 0,
      progressPercent: leaderboardEntries[0]
        ? Math.min(
            100,
            Math.round(
              ((authUser.highestScore || 0) / leaderboardEntries[0].score) * 100
            )
          )
        : 100,
    };
  }, [authUser, leaderboardEntries]);

  // Client-side search filtering (Rule 11 & Rule 12)
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return leaderboardEntries;

    return leaderboardEntries.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(q);
      const modeMatch = item.mode.toLowerCase().includes(q);
      const idMatch = item.id.toLowerCase().includes(q);
      return nameMatch || modeMatch || idMatch;
    });
  }, [leaderboardEntries, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / pageSize));

  // Current slice of paginated entries
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEntries.slice(startIndex, startIndex + pageSize);
  }, [filteredEntries, currentPage, pageSize]);

  // Stable event handlers (Rule 01)
  const handleFilterChange = useCallback((mode: LeaderboardFilterMode) => {
    setFilterMode(mode);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const scrollToPlayerRank = useCallback(() => {
    const element = document.getElementById("player-rank-ticket");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  return {
    filterMode,
    searchQuery,
    currentPage,
    pageSize,
    totalPages,
    totalCount: filteredEntries.length,
    leaderboardEntries,
    paginatedEntries,
    podium,
    peakScore,
    currentUserRanking,
    authUser,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    handleFilterChange,
    handleSearchChange,
    handlePageChange,
    scrollToPlayerRank,
  };
};
