import React from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { DashboardHeroMarquee } from "../components/DashboardHeroMarquee";
import { DashboardScoreboard } from "../components/DashboardScoreboard";
import { DashboardRecentRuns } from "../components/DashboardRecentRuns";
import { DashboardRivalsWall } from "../components/DashboardRivalsWall";
import { DashboardArcadeCallout } from "../components/DashboardArcadeCallout";
import {
  DashboardLoadingSkeleton,
  DashboardErrorState,
  DashboardEmptyState,
} from "../components/DashboardStates";

const Dashboard: React.FC = () => {
  const {
    profile,
    stats,
    recentRuns,
    leaderboardPreview,
    isLoading,
    isError,
    isEmpty,
    errorMessage,
    refetch,
    handlePlayNow,
    handleInsertCoinAndPlay,
    handleViewLeaderboard,
    handleViewHistory,
    handleReplayTape,
  } = useDashboard();

  return (
    <div
      className="min-h-screen text-[#1b1c1c] flex flex-col font-['Rubik',sans-serif] antialiased selection:bg-[#b61929] selection:text-white"
      style={{
        backgroundColor: "#f7e8c3",
        backgroundImage: `radial-gradient(#eed197 1.5px, transparent 1.5px), repeating-linear-gradient(45deg, rgba(235, 195, 126, 0.15) 0, rgba(235, 195, 126, 0.15) 10px, transparent 10px, transparent 20px)`,
        backgroundSize: "24px 24px, 40px 40px",
      }}
    >

      {/* 2. Main Arcade Cabinet Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {isLoading ? (
          <DashboardLoadingSkeleton />
        ) : isError ? (
          <DashboardErrorState message={errorMessage} onRetry={refetch} />
        ) : isEmpty ? (
          <DashboardEmptyState onPlayNow={handlePlayNow} />
        ) : (
          <>
            {/* HERO MARQUEE */}
            <DashboardHeroMarquee
              profile={profile}
              onPlayNow={handlePlayNow}
              onViewLeaderboard={handleViewLeaderboard}
            />

            {/* YOUR SCOREBOARD: 4 Tactile Tickets */}
            <DashboardScoreboard stats={stats} profile={profile} />

            {/* DUAL COLUMN: Recent Runs Receipts vs Rivals Wall */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <DashboardRecentRuns
                  runs={recentRuns}
                  totalRunsCount={stats?.totalGames ?? recentRuns.length}
                  onViewHistory={handleViewHistory}
                  onReplayTape={handleReplayTape}
                />
              </div>

              <div className="lg:col-span-5">
                <DashboardRivalsWall
                  rivals={leaderboardPreview}
                  profile={profile}
                  onViewLeaderboard={handleViewLeaderboard}
                />
              </div>
            </div>

            {/* FINAL INSERT COIN CTA */}
            <DashboardArcadeCallout
              onInsertCoinAndPlay={handleInsertCoinAndPlay}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;