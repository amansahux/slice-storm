import React, { memo } from "react";
import { Link } from "react-router";
import { User, Target, Swords, ArrowUpRight } from "lucide-react";
import type { AuthUser } from "../../../auth/api/auth.api";
import type { LeaderboardUserEntry } from "../../api/leaderboard.api";

interface PlayerRadarProps {
  authUser: AuthUser | null;
  ranking: {
    rank: number | null;
    entry: LeaderboardUserEntry | null;
    nextRival: LeaderboardUserEntry | null;
    pointGap: number;
    progressPercent: number;
  } | null;
}

export const PlayerRadar: React.FC<PlayerRadarProps> = memo(
  ({ authUser, ranking }) => {
    if (!authUser) {
      return (
        <section className="mb-10 select-none">
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_#1b1c1c] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black uppercase text-[#1b1c1c]">
                WANT TO ETCH YOUR NAME ON THE BOARD?
              </h3>
              <p className="font-['Rubik',sans-serif] text-sm text-[#5b403f] mt-1">
                Log in to sync your personal best, track rival gaps, and climb the global cabinet!
              </p>
            </div>
            <Link
              to="/login"
              className="bg-[#b61929] hover:bg-[#d9363e] text-white font-['Rubik',sans-serif] text-xs font-black px-6 py-3 rounded-xl border-3 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] uppercase flex items-center gap-2 whitespace-nowrap active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>PLAYER LOGIN</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      );
    }

    const rankText = ranking?.rank ? `#0${ranking.rank}` : "UNRANKED";
    const userScore = ranking?.entry?.score ?? authUser.highestScore ?? 0;
    const userCombo = ranking?.entry?.maxCombo ?? authUser.highestCombo ?? 0;
    const rival = ranking?.nextRival;
    const pointGap = ranking?.pointGap ?? 0;
    const progressPercent = ranking?.progressPercent ?? 85;

    return (
      <section className="mb-10 select-none">
        <div className="relative bg-white border-4 border-[#1b1c1c] rounded-2xl shadow-[8px_8px_0px_#1b1c1c] p-6 lg:p-8 overflow-hidden">
          {/* Push Pins Papercraft Decor */}
          <div className="absolute -top-3 left-8 w-6 h-6 rounded-full bg-[#b61929] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          <div className="absolute -top-3 right-8 w-6 h-6 rounded-full bg-[#b61929] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Player Stats Summary */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r-4 border-[#1b1c1c]/20 lg:pr-6 pb-6 lg:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-[#fe893c] text-[#672c00] px-2.5 py-0.5 font-['Rubik',sans-serif] text-[10px] font-black border-2 border-[#1b1c1c] rounded uppercase">
                  ACTIVE PLAYER CARD
                </span>
                <span className="text-emerald-700 font-['Rubik',sans-serif] text-xs font-black flex items-center">
                  ONLINE
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#ffe07e] border-3 border-[#1b1c1c] flex items-center justify-center shadow-[3px_3px_0px_#1b1c1c] overflow-hidden flex-shrink-0">
                  {authUser.avatar ? (
                    <img
                      src={authUser.avatar}
                      alt={authUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-[#1b1c1c]" />
                  )}
                </div>

                <div>
                  <h3 className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#1b1c1c] uppercase truncate max-w-[170px]">
                    {authUser.name} <span className="text-[#b61929]">(YOU)</span>
                  </h3>
                  <p className="font-['Rubik',sans-serif] text-xs font-bold text-[#5b403f]">
                    RANK {rankText} • KATANA MASTER
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs font-black">
                    <span className="text-[#b61929]">
                      {userScore.toLocaleString()} PTS
                    </span>
                    <span className="text-[#1b1c1c]/40">•</span>
                    <span className="text-[#9a4600]">
                      ×{userCombo} PEAK COMBO
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Rival Distance Meter & Progress */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-['Rubik',sans-serif] text-xs font-black uppercase text-[#1b1c1c] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#b61929]" />
                  {rival ? (
                    <span>
                      NEXT RIVAL:{" "}
                      <span className="text-[#b61929]">
                        #{rival.rank} {rival.name} ({rival.score.toLocaleString()}{" "}
                        PTS)
                      </span>
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-black">
                      YOU HOLD THE APEX POSITION!
                    </span>
                  )}
                </span>

                {rival && (
                  <span className="bg-[#FFF4D6] text-[#b61929] font-['Rubik',sans-serif] text-[10px] font-black px-2 py-0.5 border border-[#1b1c1c] rounded">
                    GAP: {pointGap.toLocaleString()} PTS
                  </span>
                )}
              </div>

              {/* Hard Comic Segmented Progress Bar */}
              <div className="w-full bg-[#eae7e7] border-3 border-[#1b1c1c] h-7 rounded-lg overflow-hidden shadow-[2px_2px_0px_#1b1c1c] p-0.5">
                <div
                  className="h-full bg-[#fe893c] border-r-2 border-[#1b1c1c] transition-all flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(10, Math.min(100, progressPercent))}%` }}
                >
                  <span className="font-['Rubik',sans-serif] text-[10px] font-black text-[#672c00] tracking-wider whitespace-nowrap">
                    {progressPercent}% CLOSING
                  </span>
                </div>
              </div>

              <p className="font-['Rubik',sans-serif] text-xs text-[#5b403f] font-medium mt-2">
                {rival ? (
                  <>
                    ⚡ <strong>1 solid run</strong> dethrones {rival.name} and propels you into the Global Top!
                  </>
                ) : (
                  <>Defend your crown against incoming samurai slicers!</>
                )}
              </p>
            </div>

            {/* Right: Launch Run Action Button */}
            <div className="lg:col-span-3 flex justify-start lg:justify-end">
              <Link
                to="/arcade"
                className="w-full sm:w-auto bg-[#d9363e] hover:bg-[#b61929] text-white font-['Bricolage_Grotesque',sans-serif] text-base font-black uppercase px-6 py-3.5 border-4 border-[#1b1c1c] rounded-xl shadow-[5px_5px_0px_#1b1c1c] hover:-translate-y-1 hover:shadow-[7px_7px_0px_#1b1c1c] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2.5 text-center"
              >
                <Swords className="w-5 h-5" />
                <span>LAUNCH TARGET RUN</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

PlayerRadar.displayName = "PlayerRadar";
