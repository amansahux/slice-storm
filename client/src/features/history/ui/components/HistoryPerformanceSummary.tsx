import React, { memo } from "react";
import { Trophy, Flame, Swords, Apple } from "lucide-react";

interface HistoryPerformanceSummaryProps {
  bestScore: number;
  bestCombo: number;
  totalRuns: number;
  totalFruitsSliced: number;
  classicRuns: number;
  blitzRuns: number;
  bestRunDate: string;
}

export const HistoryPerformanceSummary: React.FC<HistoryPerformanceSummaryProps> =
  memo(
    ({
      bestScore,
      bestCombo,
      totalRuns,
      totalFruitsSliced,
      classicRuns,
      blitzRuns,
      bestRunDate,
    }) => {
      // Approximate juice extracted (1 slice ~ 15ml juice)
      const litersExtracted = ((totalFruitsSliced * 15) / 1000).toFixed(1);

      return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 select-none">
          {/* Card 1: Best Score */}
          <div className="relative bg-white border-4 border-[#1b1c1c] p-5 rounded-2xl shadow-[4px_4px_0_0_#1b1c1c] hover:-translate-y-1 transition-transform overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#ffe07e] opacity-40 rounded-full border-2 border-[#1b1c1c] pointer-events-none" />
            <div className="flex items-start justify-between">
              <span className="font-['Rubik',sans-serif] text-xs uppercase tracking-wider text-[#5b403f] font-bold">
                1. BEST SCORE
              </span>
              <Trophy className="w-6 h-6 text-[#b61929]" />
            </div>
            <div className="mt-3">
              <div className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl font-black text-[#b61929] tracking-tight">
                {bestScore.toLocaleString()}{" "}
                <span className="text-sm text-[#1b1c1c] font-bold">PTS</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ffe07e] text-[#231b00] border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-[10px] uppercase font-black rounded shadow-[1px_1px_0px_#1b1c1c]">
                ★ ALL-TIME RECORD ★
              </div>
            </div>
            <div className="mt-3 pt-3 border-t-2 border-dashed border-[#1b1c1c]/20 flex justify-between font-['Rubik',sans-serif] text-xs text-[#5b403f]">
              <span>Achieved: {bestRunDate}</span>
              <span className="font-black text-[#1b1c1c]">Top Tier</span>
            </div>
          </div>

          {/* Card 2: Best Combo */}
          <div className="relative bg-white border-4 border-[#1b1c1c] p-5 rounded-2xl shadow-[4px_4px_0_0_#1b1c1c] hover:-translate-y-1 transition-transform overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="font-['Rubik',sans-serif] text-xs uppercase tracking-wider text-[#5b403f] font-bold">
                2. BEST COMBO
              </span>
              <Flame className="w-6 h-6 text-[#fe893c]" />
            </div>
            <div className="mt-3">
              <div className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl font-black text-[#9a4600] tracking-tight">
                ×{bestCombo}{" "}
                <span className="text-base text-[#1b1c1c] font-bold">FRENZY</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#ffdbc9] text-[#763300] border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-[10px] uppercase font-black rounded shadow-[1px_1px_0px_#1b1c1c]">
                BLADE CASCADE
              </div>
            </div>
            <div className="mt-3 pt-3 border-t-2 border-dashed border-[#1b1c1c]/20 flex justify-between font-['Rubik',sans-serif] text-xs text-[#5b403f]">
              <span>Streak Power</span>
              <span className="font-black text-[#1b1c1c]">Katana Master</span>
            </div>
          </div>

          {/* Card 3: Total Runs */}
          <div className="relative bg-white border-4 border-[#1b1c1c] p-5 rounded-2xl shadow-[4px_4px_0_0_#1b1c1c] hover:-translate-y-1 transition-transform overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="font-['Rubik',sans-serif] text-xs uppercase tracking-wider text-[#5b403f] font-bold">
                3. TOTAL RUNS
              </span>
              <Swords className="w-6 h-6 text-[#b61929]" />
            </div>
            <div className="mt-3">
              <div className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl font-black text-[#1b1c1c] tracking-tight">
                {totalRuns}{" "}
                <span className="text-sm text-[#5b403f] font-bold">GAMES</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#eae7e7] border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-[10px] uppercase font-black rounded shadow-[1px_1px_0px_#1b1c1c]">
                VERIFIED ARCHIVE
              </div>
            </div>
            <div className="mt-3 pt-3 border-t-2 border-dashed border-[#1b1c1c]/20 flex justify-between font-['Rubik',sans-serif] text-xs text-[#5b403f]">
              <span>Classic: {classicRuns} runs</span>
              <span className="font-black text-[#1b1c1c]">Blitz: {blitzRuns}</span>
            </div>
          </div>

          {/* Card 4: Fruits Sliced */}
          <div className="relative bg-white border-4 border-[#1b1c1c] p-5 rounded-2xl shadow-[4px_4px_0_0_#1b1c1c] hover:-translate-y-1 transition-transform overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="font-['Rubik',sans-serif] text-xs uppercase tracking-wider text-[#5b403f] font-bold">
                4. FRUITS SLICED
              </span>
              <Apple className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="mt-3">
              <div className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                {totalFruitsSliced.toLocaleString()}{" "}
                <span className="text-sm text-[#1b1c1c] font-bold">SLICES</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-[10px] uppercase font-black rounded shadow-[1px_1px_0px_#1b1c1c]">
                💧 {litersExtracted}L JUICE EXTRACTED
              </div>
            </div>
            <div className="mt-3 pt-3 border-t-2 border-dashed border-[#1b1c1c]/20 flex justify-between font-['Rubik',sans-serif] text-xs text-[#5b403f]">
              <span>Blade Efficiency</span>
              <span className="font-black text-emerald-700">100% Juicy</span>
            </div>
          </div>
        </section>
      );
    }
  );

HistoryPerformanceSummary.displayName = "HistoryPerformanceSummary";
