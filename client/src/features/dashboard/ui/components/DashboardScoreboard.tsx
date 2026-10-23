import React from "react";
import { Star, Flame, Gamepad2, Apple, Award, Timer, Droplets } from "lucide-react";
import type { DashboardStats, DashboardProfile } from "../../api/dashboard.api";

interface DashboardScoreboardProps {
  stats: DashboardStats | undefined;
  profile: DashboardProfile | undefined;
}

export const DashboardScoreboard: React.FC<DashboardScoreboardProps> = React.memo(
  ({ stats, profile }) => {
    const highestScore = stats?.highestScore ?? 0;
    const mode = stats?.highestScoreMode ? stats.highestScoreMode.toUpperCase() : "SURVIVAL";
    const highestCombo = stats?.highestCombo ?? 0;
    const totalGames = stats?.totalGames ?? 0;
    const playTimeHours = stats?.estimatedPlayTimeHours ?? 0;
    const fruitsSliced = stats?.totalFruitsSliced ?? 0;
    const accuracy = stats?.accuracy ?? 94.2;
    const rank = profile?.rank ?? 7;

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-7 bg-[#b61929] border-2 border-[#1b1c1c] shadow-[2px_2px_0_0_#1b1c1c]" />
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1b1c1c]">
              YOUR SCOREBOARD // REPUTATION
            </h2>
          </div>
          <span className="hidden sm:inline-block bg-[#FFF4D6] border-2 border-[#1b1c1c] px-3 py-1 font-['Rubik',sans-serif] text-xs font-black shadow-[2px_2px_0_0_#1b1c1c]">
            UPDATED LIVE FROM CABINET #01
          </span>
        </div>

        {/* 4 Bento Ticket Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* CARD 1: PERSONAL BEST */}
          <div className="relative bg-white border-4 border-[#1b1c1c] shadow-[5px_5px_0_0_#1b1c1c] p-4 flex flex-col justify-between rotate-[-1deg] hover:rotate-0 transition-transform">
            <div className="absolute -top-3 left-1/3 w-16 h-5 -rotate-2 bg-[#ffe07e]/90 shadow-[1px_1px_3px_rgba(0,0,0,0.15)] border-l-2 border-r-2 border-dashed border-[#8f706e]/50 pointer-events-none" />
            <div className="flex justify-between items-start border-b-2 border-dashed border-[#1b1c1c] pb-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#b61929] flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#b61929]" /> PERSONAL BEST
              </span>
              <span className="bg-[#ffe07e] text-[#4d3e00] border border-[#1b1c1c] text-[10px] font-black px-1.5 py-0.5">
                ALL-TIME
              </span>
            </div>
            <div className="space-y-1 my-1">
              <div className="text-[11px] font-bold text-[#8f706e] uppercase tracking-wider">
                LIFETIME RECORD
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-4xl sm:text-[44px] leading-none font-black text-[#b61929] tracking-tight">
                {highestScore.toLocaleString()}
              </div>
              <div className="text-[11px] font-black text-[#9a4600] uppercase">
                ⚡ ACHIEVED IN {mode} MODE
              </div>
            </div>
            <div className="mt-4 pt-2 border-t-2 border-[#1b1c1c] bg-[#f6f3f2] -mx-4 -mb-4 p-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5b403f] flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#725c00]" /> TOP 3% SLICER
              </span>
              <span className="text-[10px] bg-[#b61929] text-white px-1.5 py-0.5 border border-[#1b1c1c] font-black">
                RANK #{rank.toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* CARD 2: COMBO FRENZY */}
          <div className="relative bg-[#FFF4D6] border-4 border-[#1b1c1c] shadow-[5px_5px_0_0_#1b1c1c] p-4 flex flex-col justify-between rotate-[1.5deg] hover:rotate-0 transition-transform">
            <div className="flex justify-between items-start border-b-2 border-dashed border-[#1b1c1c] pb-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#9a4600] flex items-center gap-1">
                <Flame className="w-4 h-4 fill-[#fe893c] text-[#9a4600]" /> COMBO FRENZY
              </span>
              <span className="bg-[#fe893c] text-white border border-[#1b1c1c] text-[10px] font-black px-1.5 py-0.5 shadow-[1px_1px_0_0_#1b1c1c]">
                PEAK
              </span>
            </div>
            <div className="space-y-1 my-1">
              <div className="text-[11px] font-bold text-[#8f706e] uppercase tracking-wider">
                MAX STREAK MULTIPLIER
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-4xl sm:text-[44px] leading-none font-black text-[#9a4600] tracking-tight">
                ×{highestCombo}
              </div>
              <div className="text-[11px] font-black text-[#b61929] uppercase">
                STORM GOD STRIKE COMBO!
              </div>
            </div>
            <div className="mt-4 pt-2 border-t-2 border-[#1b1c1c] bg-[#ffdbc9] -mx-4 -mb-4 p-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#672c00] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#9a4600]" /> 6 WATERMELONS IN 1 SLASH
              </span>
              <span className="text-[10px] font-black uppercase text-[#9a4600]">HOT STREAK</span>
            </div>
          </div>

          {/* CARD 3: GAMES PLAYED */}
          <div className="relative bg-white border-4 border-[#1b1c1c] shadow-[5px_5px_0_0_#1b1c1c] p-4 flex flex-col justify-between rotate-[-1.5deg] hover:rotate-0 transition-transform">
            <div className="flex justify-between items-start border-b-2 border-dashed border-[#1b1c1c] pb-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#1b1c1c] flex items-center gap-1">
                <Gamepad2 className="w-4 h-4" /> GAMES PLAYED
              </span>
              <span className="bg-[#f0eded] text-[#1b1c1c] border border-[#1b1c1c] text-[10px] font-black px-1.5 py-0.5">
                INSERT COIN
              </span>
            </div>
            <div className="space-y-1 my-1">
              <div className="text-[11px] font-bold text-[#8f706e] uppercase tracking-wider">
                ARCADE SESSIONS
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-4xl sm:text-[44px] leading-none font-black text-[#1b1c1c] tracking-tight">
                {totalGames}
              </div>
              <div className="text-[11px] font-black text-[#8f706e] uppercase">
                TOTAL RUNS COMPLETED
              </div>
            </div>
            <div className="mt-4 pt-2 border-t-2 border-[#1b1c1c] bg-[#eae7e7] -mx-4 -mb-4 p-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5b403f] flex items-center gap-1">
                <Timer className="w-3.5 h-3.5 text-[#1b1c1c]" /> {playTimeHours} ARCADE HRS
              </span>
              <span className="text-[10px] font-black text-[#1b1c1c]">VETERAN</span>
            </div>
          </div>

          {/* CARD 4: FRUITS JUICED */}
          <div className="relative bg-[#ffe07e] border-4 border-[#1b1c1c] shadow-[5px_5px_0_0_#1b1c1c] p-4 flex flex-col justify-between rotate-[1deg] hover:rotate-0 transition-transform">
            <div className="flex justify-between items-start border-b-2 border-dashed border-[#1b1c1c] pb-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#4d3e00] flex items-center gap-1">
                <Apple className="w-4 h-4" /> FRUITS JUICED
              </span>
              <span className="bg-[#b61929] text-white border border-[#1b1c1c] text-[10px] font-black px-1.5 py-0.5 shadow-[1px_1px_0_0_#1b1c1c]">
                {(fruitsSliced * 0.015).toFixed(1)} L
              </span>
            </div>
            <div className="space-y-1 my-1">
              <div className="text-[11px] font-bold text-[#564500] uppercase tracking-wider">
                CLEAN CUTS
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-4xl sm:text-[44px] leading-none font-black text-[#231b00] tracking-tight">
                {fruitsSliced.toLocaleString()}
              </div>
              <div className="text-[11px] font-black text-[#4d3e00] uppercase">
                TOTAL FRUITS SLAIN
              </div>
            </div>
            <div className="mt-4 pt-2 border-t-2 border-[#1b1c1c] bg-[#ffe9a3] -mx-4 -mb-4 p-2.5 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#4d3e00] flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-[#b61929]" /> {accuracy}% ACCURACY
              </span>
              <span className="text-[10px] font-black text-[#b61929] uppercase">PURE JUICE</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
DashboardScoreboard.displayName = "DashboardScoreboard";
