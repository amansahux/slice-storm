import React, { memo } from "react";
import { ShieldCheck, Receipt } from "lucide-react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { LeaderboardMarqueeHeader } from "../components/LeaderboardMarqueeHeader";
import { LeaderboardFilterBar } from "../components/LeaderboardFilterBar";
import { LeaderboardPodium } from "../components/LeaderboardPodium";
import { PlayerRadar } from "../components/PlayerRadar";
import { LeaderboardTicketItem } from "../components/LeaderboardTicketItem";
import { LeaderboardPagination } from "../components/LeaderboardPagination";
import { LeaderboardCta } from "../components/LeaderboardCta";
import { LeaderboardStates } from "../components/LeaderboardStates";

const Leaderboard: React.FC = memo(() => {
  const {
    filterMode,
    searchQuery,
    currentPage,
    totalPages,
    totalCount,
    paginatedEntries,
    podium,
    peakScore,
    currentUserRanking,
    authUser,
    isLoading,
    isError,
    error,
    refetch,
    handleFilterChange,
    handleSearchChange,
    handlePageChange,
    scrollToPlayerRank,
  } = useLeaderboard();

  return (
    <div className="min-h-screen bg-[#F7E8C3] paper-pattern text-[#1b1c1c] antialiased select-none">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* 1. Page Header Ticker & Marquee Title */}
        <LeaderboardMarqueeHeader peakScore={peakScore} />

        {/* 2. Tactile Mode Switcher & Search Bar */}
        <LeaderboardFilterBar
          filterMode={filterMode}
          onFilterChange={handleFilterChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* 3. Top 3 Podium Winners (Shown when not searching and data exists) */}
        {!searchQuery && !isLoading && !isError && (
          <LeaderboardPodium
            first={podium.first}
            second={podium.second}
            third={podium.third}
          />
        )}

        {/* 4. Current Player Position & Rival Radar */}
        {!isLoading && !isError && (
          <PlayerRadar authUser={authUser} ranking={currentUserRanking} />
        )}

        {/* 5. High Score Board / Tickets Wall */}
        <section className="mb-10">
          {/* Header with Anti-Cheat Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 select-none">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="bg-[#b61929] text-white w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-[#1b1c1c] flex items-center justify-center shadow-[2px_2px_0px_#1b1c1c] flex-shrink-0">
                <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl lg:text-3xl text-[#1b1c1c] font-black uppercase tracking-tight truncate">
                  CABINET SCOREBOARD{" "}
                  <span className="text-[#b61929]">//</span> TOP SLICERS
                </h2>
                <p className="font-['Rubik',sans-serif] text-[11px] sm:text-xs font-bold text-[#5b403f] uppercase truncate">
                  UPDATED REAL-TIME • 60HZ REFRESH • {totalCount} ENTRIES
                </p>
              </div>
            </div>

            <div className="self-start sm:self-auto inline-flex items-center gap-1.5 sm:gap-2 bg-[#FFF4D6] border-2 border-[#1b1c1c] px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg shadow-[2px_2px_0px_#1b1c1c] rotate-1 whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 flex-shrink-0" />
              <span className="font-['Rubik',sans-serif] text-[10px] sm:text-xs font-black uppercase text-[#1b1c1c]">
                ANTI-CHEAT 4.2 VERIFIED
              </span>
            </div>
          </div>

          {/* Conditional Rendering of States */}
          {isLoading && <LeaderboardStates type="loading" />}

          {isError && (
            <LeaderboardStates
              type="error"
              errorMessage={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          )}

          {!isLoading && !isError && paginatedEntries.length === 0 && (
            <LeaderboardStates
              type="empty"
              searchQuery={searchQuery}
            />
          )}

          {!isLoading && !isError && paginatedEntries.length > 0 && (
            <div className="space-y-3">
              {paginatedEntries.map((entry) => {
                const isUser = Boolean(
                  authUser &&
                    ((entry.userId && entry.userId === authUser._id) ||
                      (entry.name &&
                        authUser.name &&
                        entry.name.toLowerCase() === authUser.name.toLowerCase()))
                );

                return (
                  <LeaderboardTicketItem
                    key={entry.id || `${entry.rank}-${entry.name}`}
                    entry={entry}
                    isCurrentUser={isUser}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* 6. Pagination & Quick Jump */}
        {!isLoading && !isError && paginatedEntries.length > 0 && (
          <LeaderboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onJumpToPlayer={scrollToPlayerRank}
            hasPlayerTicket={Boolean(currentUserRanking?.rank)}
            playerRank={currentUserRanking?.rank ?? null}
          />
        )}

        {/* 7. Bottom Call-To-Action Burst Box */}
        <LeaderboardCta />
      </main>
    </div>
  );
});

Leaderboard.displayName = "Leaderboard";
export default Leaderboard;