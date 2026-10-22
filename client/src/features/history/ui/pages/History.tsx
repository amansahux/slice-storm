import React, { useCallback } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Swords, Sparkles } from "lucide-react";
import { useHistory } from "../../hooks/useHistory";
import { HistoryHeroHeader } from "../components/HistoryHeroHeader";
import { HistoryPerformanceSummary } from "../components/HistoryPerformanceSummary";
import { HistoryGoldenTicket } from "../components/HistoryGoldenTicket";
import { HistoryFilterBar } from "../components/HistoryFilterBar";
import { HistoryTicketCard } from "../components/HistoryTicketCard";
import { HistoryAnalyticsSidebar } from "../components/HistoryAnalyticsSidebar";
import { HistoryRunModal } from "../components/HistoryRunModal";
import {
  HistoryLoadingSkeleton,
  HistoryErrorState,
  HistoryEmptyState,
} from "../components/HistoryStates";
import type { GameRunRecord } from "../../api/history.api";

export const History: React.FC = () => {
  const navigate = useNavigate();
  const {
    filterMode,
    sortOption,
    timeframe,
    currentPage,
    totalPages,
    totalCount,
    paginatedRuns,
    summaryMetrics,
    goldenRun,
    topFiveRuns,
    telemetryData,
    selectedRun,
    isLoading,
    isError,
    error,
    refetch,
    handleFilterModeChange,
    handleSortChange,
    handleTimeframeChange,
    handlePageChange,
    openRunModal,
    closeRunModal,
  } = useHistory();

  const handlePlayAgain = useCallback(() => {
    navigate("/play");
  }, [navigate]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  }, [currentPage, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  }, [currentPage, totalPages, handlePageChange]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-[#F7E8C3] text-[#1b1c1c] font-sans selection:bg-[#ffd875] selection:text-[#1b1c1c] p-3 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Dossier Header */}
        <HistoryHeroHeader />

        {/* 2. Top Metric Summaries */}
        <HistoryPerformanceSummary
          bestScore={summaryMetrics.bestScore}
          bestCombo={summaryMetrics.bestCombo}
          totalRuns={summaryMetrics.totalRuns}
          totalFruitsSliced={summaryMetrics.totalFruitsSliced}
          classicRuns={summaryMetrics.classicRuns}
          blitzRuns={summaryMetrics.blitzRuns}
          bestRunDate={summaryMetrics.bestRunDate}
        />

        {/* 3. Golden Master Ticket Highlight (Personal Best) */}
        <HistoryGoldenTicket
          goldenRun={goldenRun}
          onOpenDetails={openRunModal}
        />

        {/* 4. Filter and Sorting Controls */}
        <HistoryFilterBar
          filterMode={filterMode}
          onFilterModeChange={handleFilterModeChange}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          totalRunsCount={totalCount}
        />

        {/* 5. Main 2-Column Content: Feed on Left + Analytics on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Feed Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#1b1c1c]/20">
              <span className="font-mono text-xs font-black tracking-widest uppercase text-gray-700">
                DISPATCHED ARCHIVES ({paginatedRuns.length} OF {totalCount})
              </span>
              <span className="font-mono text-xs font-bold text-gray-500">
                PAGE {currentPage} OF {Math.max(1, totalPages)}
              </span>
            </div>

            {/* State Handling: Loading, Error, Empty, Loaded */}
            {isLoading && <HistoryLoadingSkeleton count={4} />}

            {!isLoading && isError && (
              <HistoryErrorState
                message={error instanceof Error ? error.message : undefined}
                onRetry={handleRetry}
              />
            )}

            {!isLoading && !isError && paginatedRuns.length === 0 && (
              <HistoryEmptyState onPlayClick={handlePlayAgain} />
            )}

            {!isLoading && !isError && paginatedRuns.length > 0 && (
              <div className="space-y-4">
                {paginatedRuns.map((run: GameRunRecord, idx: number) => (
                  <HistoryTicketCard
                    key={run._id || run.sessionId || idx}
                    run={run}
                    index={(currentPage - 1) * 10 + idx}
                    onOpenDetails={openRunModal}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t-2 border-[#1b1c1c]/20">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#1b1c1c] bg-[#FFF4D6] text-[#1b1c1c] font-black text-xs uppercase shadow-[3px_3px_0px_#1b1c1c] hover:bg-[#ffd875] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  PREV
                </button>

                <div className="font-mono text-xs font-black text-[#1b1c1c] bg-white border-2 border-[#1b1c1c] px-3 py-1.5 shadow-[2px_2px_0px_#1b1c1c]">
                  SHEET {currentPage} / {totalPages}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-[#1b1c1c] bg-[#FFF4D6] text-[#1b1c1c] font-black text-xs uppercase shadow-[3px_3px_0px_#1b1c1c] hover:bg-[#ffd875] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  NEXT
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Analytics Sidebar */}
          <div className="lg:col-span-4 w-full">
            <HistoryAnalyticsSidebar
              summaryMetrics={summaryMetrics}
              telemetryData={telemetryData}
              topFiveRuns={topFiveRuns}
              onOpenDetails={openRunModal}
            />
          </div>
        </div>

        {/* 6. Footer Call-to-Action Bar */}
        <div className="bg-[#b61929] border-4 border-[#1b1c1c] p-6 sm:p-8 shadow-[8px_8px_0px_#1b1c1c] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#ffd875] text-[#1b1c1c] flex items-center justify-center border-2 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-black uppercase tracking-tight">
                Think You Can Beat {summaryMetrics.bestScore.toLocaleString()}?
              </h3>
              <p className="text-xs sm:text-sm font-bold text-white/80 mt-1 max-w-xl">
                The leaderboard refreshes in real-time. Re-enter the arena, slice with discipline, and build your golden streaks.
              </p>
            </div>
          </div>
          <button
            onClick={handlePlayAgain}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#ffd875] text-[#1b1c1c] font-black text-sm uppercase tracking-wider border-3 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1b1c1c] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Swords className="w-5 h-5" />
            SLICE NOW
          </button>
        </div>
      </div>

      {/* 7. Run Details Inspection Modal */}
      <HistoryRunModal
        run={selectedRun}
        onClose={closeRunModal}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
};

export default History;