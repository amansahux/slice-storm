import React, { memo } from "react";
import { Link } from "react-router";
import { RefreshCw, Swords, SearchX, ShieldAlert } from "lucide-react";

interface LeaderboardStatesProps {
  type: "loading" | "error" | "empty";
  errorMessage?: string;
  onRetry?: () => void;
  searchQuery?: string;
}

export const LeaderboardStates: React.FC<LeaderboardStatesProps> = memo(
  ({ type, errorMessage, onRetry, searchQuery }) => {
    if (type === "loading") {
      return (
        <div className="space-y-4 my-8">
          {/* Skeleton Cards */}
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="bg-white/80 border-3 border-[#1b1c1c]/20 rounded-2xl p-4 sm:p-5 shadow-[2px_2px_0px_#1b1c1c]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#eae7e7] rounded-xl" />
                <div className="w-12 h-12 bg-[#eae7e7] rounded-xl" />
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-[#eae7e7] rounded" />
                  <div className="w-20 h-3 bg-[#eae7e7] rounded" />
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-24 h-6 bg-[#eae7e7] rounded" />
                <div className="w-16 h-6 bg-[#eae7e7] rounded" />
                <div className="w-20 h-8 bg-[#eae7e7] rounded-lg" />
              </div>
            </div>
          ))}
          <div className="text-center py-4">
            <span className="font-['Rubik',sans-serif] text-xs font-black uppercase text-[#5b403f] animate-pulse">
              ⚡ CONNECTING TO ARCADE CABINET MATRIX...
            </span>
          </div>
        </div>
      );
    }

    if (type === "error") {
      return (
        <div className="my-8 bg-[#ffdad6] border-4 border-[#ba1a1a] rounded-2xl p-8 sm:p-10 shadow-[6px_6px_0px_#1b1c1c] text-center select-none">
          <div className="w-14 h-14 bg-white rounded-2xl border-3 border-[#ba1a1a] flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_#ba1a1a]">
            <ShieldAlert className="w-8 h-8 text-[#ba1a1a]" />
          </div>
          <h3 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-black uppercase text-[#ba1a1a]">
            FAILED TO SYNC CABINET LEADERBOARD
          </h3>
          <p className="font-['Rubik',sans-serif] text-sm text-[#410006] mt-2 max-w-md mx-auto">
            {errorMessage || "Unable to reach the highscore mainframe. Verify your network or retry."}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-6 cursor-pointer bg-[#ba1a1a] hover:bg-[#93000a] text-white font-['Rubik',sans-serif] text-xs font-black px-6 py-3 rounded-xl border-3 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] active:translate-y-0.5 active:shadow-none transition-all inline-flex items-center gap-2 uppercase"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RETRY CONNECTION</span>
            </button>
          )}
        </div>
      );
    }

    if (type === "empty") {
      return (
        <div className="my-8 bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-2xl p-8 sm:p-12 shadow-[6px_6px_0px_#1b1c1c] text-center select-none">
          <div className="w-16 h-16 bg-white rounded-2xl border-3 border-[#1b1c1c] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#1b1c1c]">
            {searchQuery ? (
              <SearchX className="w-8 h-8 text-[#b61929]" />
            ) : (
              <Swords className="w-8 h-8 text-[#b61929]" />
            )}
          </div>
          <h3 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-black uppercase text-[#1b1c1c]">
            {searchQuery ? "NO MATCHING CALLSIGN FOUND" : "NO HIGHSCORES RECORDED YET"}
          </h3>
          <p className="font-['Rubik',sans-serif] text-sm text-[#5b403f] mt-2 max-w-md mx-auto">
            {searchQuery
              ? `No sliced runs found for "${searchQuery}". Clear your search query or try a different blade master.`
              : "Be the pioneer samurai to set the maiden highscore on this cabinet!"}
          </p>

          <Link
            to="/arcade"
            className="mt-6 inline-flex items-center gap-2 bg-[#d9363e] hover:bg-[#b61929] text-white font-['Rubik',sans-serif] text-xs font-black px-6 py-3 rounded-xl border-3 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] uppercase active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Swords className="w-4 h-4" />
            <span>PLAY FIRST RUN</span>
          </Link>
        </div>
      );
    }

    return null;
  }
);

LeaderboardStates.displayName = "LeaderboardStates";
