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
        {/* Mode Tabs: Responsive 2-column grid on mobile, flexible row on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          {/* ALL MODES */}
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`cursor-pointer font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase px-3 sm:px-4 py-2.5 border-3 border-[#1b1c1c] rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 w-full lg:w-auto text-center ${
              filterMode === "all"
                ? "bg-[#b61929] text-white shadow-[3px_3px_0px_#1b1c1c] sm:shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] sm:shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">ALL MODES</span>
            <span
              className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.2 rounded border border-[#1b1c1c] hidden xs:inline-block ${
                filterMode === "all"
                  ? "bg-[#ffe07e] text-[#231b00]"
                  : "bg-white text-[#1b1c1c]"
              }`}
            >
              ALL
            </span>
          </button>

          {/* CLASSIC SURVIVAL */}
          <button
            type="button"
            onClick={() => onFilterChange("classic")}
            className={`cursor-pointer font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase px-3 sm:px-4 py-2.5 border-3 border-[#1b1c1c] rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 w-full lg:w-auto text-center ${
              filterMode === "classic"
                ? "bg-[#b61929] text-white shadow-[3px_3px_0px_#1b1c1c] sm:shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] sm:shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <Swords
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                filterMode === "classic" ? "text-white" : "text-[#b61929]"
              }`}
            />
            <span className="truncate">CLASSIC</span>
          </button>

          {/* ARCADE BLITZ 60S */}
          <button
            type="button"
            onClick={() => onFilterChange("arcade")}
            className={`cursor-pointer font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase px-3 sm:px-4 py-2.5 border-3 border-[#1b1c1c] rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 w-full lg:w-auto text-center ${
              filterMode === "arcade"
                ? "bg-[#b61929] text-white shadow-[3px_3px_0px_#1b1c1c] sm:shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffdbc9] text-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] sm:shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <Zap
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                filterMode === "arcade" ? "text-white" : "text-[#9a4600]"
              }`}
            />
            <span className="truncate">ARCADE BLITZ</span>
          </button>

          {/* ZEN TRANQUILITY */}
          <button
            type="button"
            onClick={() => onFilterChange("zen")}
            className={`cursor-pointer font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase px-3 sm:px-4 py-2.5 border-3 border-[#1b1c1c] rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 w-full lg:w-auto text-center ${
              filterMode === "zen"
                ? "bg-[#b61929] text-white shadow-[3px_3px_0px_#1b1c1c] sm:shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#e4e2e1] text-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] sm:shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
            <span className="truncate">ZEN MODE</span>
          </button>
        </div>

        {/* Quick Blade Callsign Search Input: full width on mobile */}
        <div className="relative w-full lg:w-auto lg:min-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#1b1c1c]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="SEARCH CALLSIGN OR RUN ID..."
            className="w-full bg-white text-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-bold pl-10 pr-4 py-2.5 border-3 border-[#1b1c1c] rounded-xl shadow-[3px_3px_0px_#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#b61929] focus:border-[#1b1c1c] placeholder:text-[#5b403f]/60 uppercase tracking-wide"
          />
        </div>
      </section>
    );
  }
);

LeaderboardFilterBar.displayName = "LeaderboardFilterBar";
