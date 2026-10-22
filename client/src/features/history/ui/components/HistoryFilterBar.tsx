import React, { memo } from "react";
import { Calendar, ArrowUpDown } from "lucide-react";
import type {
  HistoryFilterMode,
  HistorySortOption,
  HistoryTimeframe,
} from "../../hooks/useHistory";

interface HistoryFilterBarProps {
  filterMode: HistoryFilterMode;
  onFilterModeChange: (mode: HistoryFilterMode) => void;
  sortOption: HistorySortOption;
  onSortChange: (sort: HistorySortOption) => void;
  timeframe: HistoryTimeframe;
  onTimeframeChange: (timeframe: HistoryTimeframe) => void;
  totalRunsCount: number;
}

export const HistoryFilterBar: React.FC<HistoryFilterBarProps> = memo(
  ({
    filterMode,
    onFilterModeChange,
    sortOption,
    onSortChange,
    timeframe,
    onTimeframeChange,
    totalRunsCount,
  }) => {
    return (
      <section className="bg-white border-4 border-[#1b1c1c] p-4 rounded-2xl shadow-[4px_4px_0_0_#1b1c1c] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 select-none">
        {/* Mode Tabs */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onFilterModeChange("all")}
            className={`cursor-pointer px-3 sm:px-4 py-2 border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-black uppercase rounded-lg transition-all text-center ${
              filterMode === "all"
                ? "bg-[#b61929] text-white shadow-[2px_2px_0_0_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c]"
            }`}
          >
            ALL RUNS ({totalRunsCount})
          </button>

          <button
            type="button"
            onClick={() => onFilterModeChange("classic")}
            className={`cursor-pointer px-3 sm:px-4 py-2 border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-black uppercase rounded-lg transition-all text-center ${
              filterMode === "classic"
                ? "bg-[#b61929] text-white shadow-[2px_2px_0_0_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c]"
            }`}
          >
            CLASSIC
          </button>

          <button
            type="button"
            onClick={() => onFilterModeChange("arcade")}
            className={`cursor-pointer px-3 sm:px-4 py-2 border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-black uppercase rounded-lg transition-all text-center ${
              filterMode === "arcade"
                ? "bg-[#b61929] text-white shadow-[2px_2px_0_0_#1b1c1c] -translate-y-0.5"
                : "bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c]"
            }`}
          >
            BLITZ 60S
          </button>
        </div>

        {/* Dropdowns: Timeframe & Sorting */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="flex-1 sm:flex-initial flex items-center gap-1.5 bg-[#FFF4D6] border-2 border-[#1b1c1c] px-3 py-1.5 rounded-lg shadow-[2px_2px_0_0_#1b1c1c]">
            <Calendar className="w-3.5 h-3.5 text-[#5b403f]" />
            <select
              value={timeframe}
              onChange={(e) =>
                onTimeframeChange(e.target.value as HistoryTimeframe)
              }
              className="bg-transparent border-0 font-['Rubik',sans-serif] text-xs uppercase font-bold text-[#1b1c1c] focus:ring-0 cursor-pointer p-0 pr-2"
            >
              <option value="all">ALL TIME</option>
              <option value="today">TODAY</option>
              <option value="week">THIS WEEK</option>
              <option value="month">THIS MONTH</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex-1 sm:flex-initial flex items-center gap-1.5 bg-[#FFF4D6] border-2 border-[#1b1c1c] px-3 py-1.5 rounded-lg shadow-[2px_2px_0_0_#1b1c1c]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#5b403f]" />
            <select
              value={sortOption}
              onChange={(e) =>
                onSortChange(e.target.value as HistorySortOption)
              }
              className="bg-transparent border-0 font-['Rubik',sans-serif] text-xs uppercase font-bold text-[#1b1c1c] focus:ring-0 cursor-pointer p-0 pr-2"
            >
              <option value="newest">NEWEST FIRST</option>
              <option value="highest_score">HIGHEST SCORE</option>
              <option value="max_combo">MAX COMBO</option>
              <option value="duration">LONGEST RUN</option>
            </select>
          </div>
        </div>
      </section>
    );
  }
);

HistoryFilterBar.displayName = "HistoryFilterBar";
