import React from "react";
import { Swords } from "lucide-react";
import type { DashboardLeaderboardEntry, DashboardProfile } from "../../api/dashboard.api";

interface DashboardRivalsWallProps {
  rivals: DashboardLeaderboardEntry[];
  profile: DashboardProfile | undefined;
  onViewLeaderboard: () => void;
}

export const DashboardRivalsWall: React.FC<DashboardRivalsWallProps> = React.memo(
  ({ rivals, profile, onViewLeaderboard }) => {
    const gap = profile?.gapToNextRank ?? 760;
    const rivalName = profile?.nextRivalName ?? "FruitFury";
    const targetRank = profile?.rank ? Math.max(1, profile.rank - 1) : 6;

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-7 bg-[#cba81c] border-2 border-[#1b1c1c] shadow-[2px_2px_0_0_#1b1c1c]" />
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1b1c1c]">
              CABINET RIVALS // S4
            </h2>
          </div>
          <span className="bg-[#ffe07e] border border-[#1b1c1c] px-2 py-0.5 font-['Rubik',sans-serif] text-xs font-black shadow-[2px_2px_0_0_#1b1c1c]">
            GLOBAL TOP 10
          </span>
        </div>

        {/* Corkboard High-Score Card */}
        <div className="relative bg-[#FFF4D6] border-4 border-[#1b1c1c] shadow-[6px_6px_0_0_#1b1c1c] p-4 sm:p-5 space-y-3">
          {/* Tape Pins */}
          <div className="absolute -top-3 left-10 w-24 h-6 -rotate-2 bg-[#ffe07e]/90 shadow-[1px_1px_3px_rgba(0,0,0,0.15)] border-l-2 border-r-2 border-dashed border-[#8f706e]/50 pointer-events-none" />
          <div className="absolute -top-3 right-10 w-24 h-6 rotate-2 bg-[#ffe07e]/90 shadow-[1px_1px_3px_rgba(0,0,0,0.15)] border-l-2 border-r-2 border-dashed border-[#8f706e]/50 pointer-events-none" />

          {/* Header Callout inside card */}
          <div className="bg-[#b61929] text-white border-2 border-[#1b1c1c] p-2.5 shadow-[3px_3px_0_0_#1b1c1c] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-white" />
              <span className="font-['Bricolage_Grotesque',sans-serif] text-base font-black uppercase tracking-tight">
                RIVAL RADAR
              </span>
            </div>
            <span className="bg-[#ffe07e] text-[#4d3e00] border border-[#1b1c1c] text-[10px] font-black px-1.5 py-0.5">
              TARGET: #{targetRank.toString().padStart(2, "0")}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-[#5b403f] leading-relaxed">
            You are trailing <strong className="text-[#1b1c1c] font-black">#{targetRank.toString().padStart(2, "0")} {rivalName}</strong> by just{" "}
            <strong className="text-[#b61929] font-black">{gap.toLocaleString()} points</strong>. One solid ×15 combo run will knock them off their perch!
          </p>

          {/* Leaderboard Tier List */}
          <div className="space-y-2 pt-1">
            {rivals.slice(0, 5).map((rival) => {
              if (rival.isCurrentPlayer) {
                return (
                  <div
                    key={rival.userId || rival.rank}
                    className="bg-[#ffe07e] border-4 border-[#1b1c1c] p-3 flex items-center justify-between shadow-[4px_4px_0_0_#1b1c1c] scale-[1.02] relative z-20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 bg-[#b61929] text-white border-2 border-[#1b1c1c] flex items-center justify-center font-black font-['Bricolage_Grotesque',sans-serif] text-sm shadow-[1px_1px_0_0_#1b1c1c]">
                        #{rival.rank.toString().padStart(2, "0")}
                      </span>
                      <div>
                        <div className="font-['Rubik',sans-serif] text-sm sm:text-base font-black leading-none text-[#1b1c1c] flex items-center gap-1.5">
                          {rival.name.toUpperCase()}{" "}
                          <span className="bg-[#b61929] text-white text-[9px] font-black px-1.5 py-0.5 border border-[#1b1c1c]">
                            YOU
                          </span>
                        </div>
                        <div className="text-[10px] font-black text-[#b61929] mt-0.5">
                          BLADE: KATANA MASTER
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-['Bricolage_Grotesque',sans-serif] text-lg sm:text-xl font-black text-[#b61929] leading-none">
                        {rival.score.toLocaleString()}
                      </span>
                      <span className="text-[10px] block text-[#4d3e00] font-black">
                        YOUR RECORD
                      </span>
                    </div>
                  </div>
                );
              }

              const isImmediateTarget = rival.rank === targetRank;

              if (isImmediateTarget) {
                return (
                  <div
                    key={rival.userId || rival.rank}
                    className="bg-[#ffdbc9] border-3 border-[#1b1c1c] p-2.5 flex items-center justify-between shadow-[3px_3px_0_0_#1b1c1c] relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="w-8 h-8 bg-[#fe893c] text-white border border-[#1b1c1c] flex items-center justify-center font-black font-['Bricolage_Grotesque',sans-serif] text-xs">
                        #{rival.rank.toString().padStart(2, "0")}
                      </span>
                      <div>
                        <div className="font-['Rubik',sans-serif] text-sm font-extrabold leading-none text-[#1b1c1c] flex items-center gap-1.5">
                          {rival.name}
                          <span className="bg-[#b61929] text-white text-[9px] font-black px-1 border border-[#1b1c1c]">
                            RIVAL
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-[#9a4600] mt-0.5">
                          BLADE: TWIN SHURIKEN
                        </div>
                      </div>
                    </div>
                    <div className="text-right relative z-10">
                      <span className="font-['Bricolage_Grotesque',sans-serif] text-base sm:text-lg font-black text-[#9a4600]">
                        {rival.score.toLocaleString()}
                      </span>
                      <span className="text-[10px] block text-[#9a4600] font-black">
                        +{gap.toLocaleString()} PTS GAP
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={rival.userId || rival.rank}
                  className="bg-white border-2 border-[#1b1c1c] p-2.5 flex items-center justify-between shadow-[2px_2px_0_0_#1b1c1c]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-[#eae7e7] border border-[#1b1c1c] flex items-center justify-center font-black font-['Bricolage_Grotesque',sans-serif] text-xs">
                      #{rival.rank.toString().padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-['Rubik',sans-serif] text-sm font-extrabold leading-none text-[#1b1c1c]">
                        {rival.name}
                      </div>
                      <div className="text-[10px] font-bold text-[#8f706e] mt-0.5">
                        BLADE: {rival.mode === "classic" ? "DRAGON STEEL" : "SHADOW EDGE"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-['Bricolage_Grotesque',sans-serif] text-base font-black text-[#1b1c1c]">
                      {rival.score.toLocaleString()}
                    </span>
                    <span className="text-[10px] block text-[#8f706e] font-bold">PTS</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button to View Full Leaderboards */}
          <button
            onClick={onViewLeaderboard}
            className="block w-full text-center bg-[#d9363e] hover:bg-[#b61929] text-white py-2.5 px-4 border-3 border-[#1b1c1c] font-['Bricolage_Grotesque',sans-serif] text-sm font-black uppercase tracking-wider shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
          >
            🏆 VIEW FULL LEADERBOARD (TOP 100)
          </button>
        </div>
      </section>
    );
  }
);
DashboardRivalsWall.displayName = "DashboardRivalsWall";
