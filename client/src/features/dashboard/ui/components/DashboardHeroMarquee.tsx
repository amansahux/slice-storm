import React from "react";
import { Swords, Trophy, Coins } from "lucide-react";
import type { DashboardProfile } from "../../api/dashboard.api";

interface DashboardHeroMarqueeProps {
  profile: DashboardProfile | undefined;
  onPlayNow: () => void;
  onViewLeaderboard: () => void;
}

export const DashboardHeroMarquee: React.FC<DashboardHeroMarqueeProps> = React.memo(
  ({ profile, onPlayNow, onViewLeaderboard }) => {
    const playerName = profile?.name ? profile.name.toUpperCase() : "SAMURAI";
    const tokens = profile?.tokens ?? 450;
    const sharpness = profile?.bladeSharpness ?? 88;
    const gap = profile?.gapToNextRank ?? 760;
    const rival = profile?.nextRivalName ?? "FruitFury";

    return (
      <section className="relative bg-[#FFF4D6] border-4 border-[#1b1c1c] shadow-[6px_6px_0px_#1b1c1c] p-5 sm:p-7 overflow-hidden">
        {/* Tape Strips at corners */}
        <div className="absolute -top-3 left-10 w-28 h-7 rotate-[-3deg] z-10 bg-[#ffe07e]/90 shadow-[1px_1px_3px_rgba(0,0,0,0.15)] border-l-2 border-r-2 border-dashed border-[#8f706e]/50 pointer-events-none" />
        <div className="absolute -bottom-3 right-12 w-28 h-7 rotate-[2deg] z-10 bg-[#ffe07e]/90 shadow-[1px_1px_3px_rgba(0,0,0,0.15)] border-l-2 border-r-2 border-dashed border-[#8f706e]/50 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Banner Copy */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#b61929] text-white border-2 border-[#1b1c1c] px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0_0_#1b1c1c] rotate-[-1deg] flex items-center gap-1">
                <Swords className="w-3.5 h-3.5" /> KATANA MASTER DECK
              </span>
              <span className="bg-[#fe893c] text-white border-2 border-[#1b1c1c] px-2.5 py-0.5 text-xs font-bold shadow-[2px_2px_0_0_#1b1c1c]">
                SEASON 04 ACTIVE
              </span>
              <span className="bg-[#ffe07e] text-[#4d3e00] border-2 border-[#1b1c1c] px-2.5 py-0.5 text-xs font-black shadow-[2px_2px_0_0_#1b1c1c] flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#9a4600]" />
                TOKENS: {tokens.toLocaleString()}
              </span>
            </div>

            <h1 className="font-['Bricolage_Grotesque',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b1c1c] tracking-tight uppercase leading-none">
              WELCOME BACK,{" "}
              <span className="text-[#b61929] underline decoration-[#ffe07e] decoration-wavy">
                {playerName}!
              </span>
            </h1>

            <p className="font-['Rubik',sans-serif] text-sm sm:text-base text-[#5b403f] font-medium leading-relaxed">
              Your blade is sharpened and sizzling. You are only{" "}
              <strong className="text-[#b61929] font-black">{gap.toLocaleString()} PTS</strong> away from dethroning rival{" "}
              <span className="bg-[#eae7e7] px-1.5 py-0.5 border border-[#1b1c1c] font-black text-[#1b1c1c]">
                #{profile?.rank ? Math.max(1, profile.rank - 1).toString().padStart(2, "0") : "06"} {rival}
              </span>{" "}
              on the cabinet marquee!
            </p>

            {/* Blade Sharpness Gauge */}
            <div className="pt-1 flex items-center gap-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#8f706e]">
                BLADE SHARPNESS:
              </span>
              <div className="w-48 sm:w-64 h-5 bg-[#f0eded] border-2 border-[#1b1c1c] p-0.5 relative shadow-[2px_2px_0_0_#1b1c1c]">
                <div
                  className="h-full bg-gradient-to-r from-[#fe893c] to-[#b61929] border-r-2 border-[#1b1c1c] relative flex items-center justify-end pr-1 transition-all duration-500"
                  style={{ width: `${sharpness}%` }}
                >
                  <span className="text-[9px] font-black text-white leading-none">
                    {sharpness}%
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-black bg-[#ffe07e] border border-[#1b1c1c] px-1.5 py-0.5 shadow-[1px_1px_0_0_#1b1c1c]">
                RAZOR
              </span>
            </div>
          </div>

          {/* Right Quick Play CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
            <button
              onClick={onPlayNow}
              className="bg-[#d9363e] hover:bg-[#b61929] text-white py-3.5 px-6 border-3 border-[#1b1c1c] font-['Bricolage_Grotesque',sans-serif] text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[5px_5px_0px_#1b1c1c] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer group"
            >
              <Swords className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              ⚔️ SLAM & PLAY NOW
            </button>
            <button
              onClick={onViewLeaderboard}
              className="bg-[#ffe07e] hover:bg-[#ffd54f] text-[#4d3e00] py-3 px-6 border-3 border-[#1b1c1c] font-['Bricolage_Grotesque',sans-serif] text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1b1c1c] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer text-center"
            >
              <Trophy className="w-5 h-5 text-[#9a4600]" />
              🏆 VIEW LEADERBOARD
            </button>
          </div>
        </div>
      </section>
    );
  }
);
DashboardHeroMarquee.displayName = "DashboardHeroMarquee";
