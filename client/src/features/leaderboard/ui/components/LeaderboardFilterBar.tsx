import React, { memo } from "react";
import { Swords, Zap, Award, Search, Sparkles } from "lucide-react";
import type { LeaderboardFilterMode } from "../../hooks/useLeaderboard";

interface LeaderboardFilterBarProps {
  filterMode: LeaderboardFilterMode;
  onFilterChange: (mode: LeaderboardFilterMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const LeaderboardFilterBar: React.FC<LeaderboardFilterBarProps> = memo(
  ({ filterMode, onFilterChange, searchQuery, onSearchChange }) => {
    return (
      <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 select-none">
        {/* Mode Tabs (Arcade physical push buttons) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* ALL MODES */}
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`cursor-pointer font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase px-4 py-2.5 border-3 border-[#1b1c1c] rounded-lg transition-all flex items-center gap-2 ${
              filterMode === "all"
                ? "bg-[#b61929] text-white shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ALL MODES</span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded border border-[#1b1c1c] ${
                filterMode === "all"
                  ? "bg-[#ffe07e] text-[#231b00]"
                  : "bg-white text-[#1b1c1c]"
              }`}
            >
              GLOBAL
            </span>
          </button>

          {/* CLASSIC SURVIVAL */}
          <button
            type="button"
            onClick={() => onFilterChange("classic")}
            className={`cursor-pointer font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase px-4 py-2.5 border-3 border-[#1b1c1c] rounded-lg transition-all flex items-center gap-2 ${
              filterMode === "classic"
                ? "bg-[#b61929] text-white shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <Swords
              className={`w-4 h-4 ${
                filterMode === "classic" ? "text-white" : "text-[#b61929]"
              }`}
            />
            <span>CLASSIC SURVIVAL</span>
          </button>

          {/* ARCADE BLITZ 60S */}
          <button
            type="button"
            onClick={() => onFilterChange("arcade")}
            className={`cursor-pointer font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase px-4 py-2.5 border-3 border-[#1b1c1c] rounded-lg transition-all flex items-center gap-2 ${
              filterMode === "arcade"
                ? "bg-[#b61929] text-white shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffdbc9] text-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <Zap
              className={`w-4 h-4 ${
                filterMode === "arcade" ? "text-white" : "text-[#9a4600]"
              }`}
            />
            <span>ARCADE BLITZ 60S</span>
          </button>

          {/* ZEN TRANQUILITY */}
          <button
            type="button"
            onClick={() => onFilterChange("zen")}
            className={`cursor-pointer font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase px-4 py-2.5 border-3 border-[#1b1c1c] rounded-lg transition-all flex items-center gap-2 ${
              filterMode === "zen"
                ? "bg-[#b61929] text-white shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#e4e2e1] text-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>ZEN TRANQUILITY</span>
          </button>
        </div>

        {/* Quick Blade Callsign Search Input */}
        <div className="relative min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1b1c1c]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH CALLSIGN OR RUN ID..."
            className="w-full bg-white text-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-bold pl-10 pr-4 py-2.5 border-3 border-[#1b1c1c] rounded-lg shadow-[3px_3px_0px_#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#b61929] focus:border-[#1b1c1c] placeholder:text-[#5b403f]/60 uppercase tracking-wide"
          />
        </div>
      </section>
    );
  }
);

LeaderboardFilterBar.displayName = "LeaderboardFilterBar";
