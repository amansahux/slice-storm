import React, { memo } from "react";
import { Link } from "react-router";
import { Crown, Shield, Swords, Star, Play } from "lucide-react";
import type { LeaderboardUserEntry } from "../../api/leaderboard.api";

interface LeaderboardTicketItemProps {
  entry: LeaderboardUserEntry;
  isCurrentUser: boolean;
}

export const LeaderboardTicketItem: React.FC<LeaderboardTicketItemProps> = memo(
  ({ entry, isCurrentUser }) => {
    const isTop1 = entry.rank === 1;
    const isTop2 = entry.rank === 2;
    const isTop3 = entry.rank === 3;

    // Custom formatting for rank string like #01, #02, #10
    const rankDisplay = entry.rank < 10 ? `#0${entry.rank}` : `#${entry.rank}`;

    return (
      <div
        id={isCurrentUser ? "player-rank-ticket" : undefined}
        className={`relative border-3 border-[#1b1c1c] rounded-2xl p-4 sm:p-5 transition-all select-none flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isCurrentUser
            ? "bg-[#ffe07e] border-4 shadow-[6px_6px_0px_#1b1c1c] scale-[1.01] my-2"
            : isTop1
            ? "bg-[#FFF4D6] shadow-[4px_4px_0px_#1b1c1c] hover:-translate-y-0.5"
            : "bg-white shadow-[3px_3px_0px_#1b1c1c] hover:-translate-y-0.5"
        }`}
      >
        {/* Ribbon for Active Player */}
        {isCurrentUser && (
          <div className="absolute -top-3.5 left-6 bg-[#b61929] text-white font-['Rubik',sans-serif] text-[10px] font-black px-3 py-0.5 border-2 border-[#1b1c1c] rounded shadow-[2px_2px_0px_#1b1c1c] uppercase -rotate-2 flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            <span>YOU ARE HERE // ACTIVE PLAYER</span>
          </div>
        )}

        {/* Left: Rank, Avatar & Callsign */}
        <div className="flex items-center gap-4 min-w-[240px] pt-1 md:pt-0">
          <span
            className={`font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl font-black w-12 text-center ${
              isTop1
                ? "text-[#cba81c]"
                : isTop2
                ? "text-[#5b403f]"
                : isTop3
                ? "text-[#9a4600]"
                : isCurrentUser
                ? "text-[#b61929]"
                : "text-[#1b1c1c]/50"
            }`}
          >
            {rankDisplay}
          </span>

          <div
            className={`w-12 h-12 rounded-xl border-2 border-[#1b1c1c] flex items-center justify-center shadow-[2px_2px_0px_#1b1c1c] overflow-hidden flex-shrink-0 ${
              isTop1
                ? "bg-[#ffe07e]"
                : isTop2
                ? "bg-[#eae7e7]"
                : isTop3
                ? "bg-[#ffdbc9]"
                : isCurrentUser
                ? "bg-white"
                : "bg-[#f6f3f2]"
            }`}
          >
            {entry.avatar ? (
              <img
                src={entry.avatar}
                alt={entry.name}
                className="w-full h-full object-cover"
              />
            ) : isTop1 ? (
              <Crown className="w-6 h-6 text-[#b61929]" />
            ) : isTop2 ? (
              <Shield className="w-6 h-6 text-[#5b403f]" />
            ) : isTop3 ? (
              <Swords className="w-6 h-6 text-[#9a4600]" />
            ) : (
              <Swords className="w-6 h-6 text-[#1b1c1c]/60" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Bricolage_Grotesque',sans-serif] text-lg sm:text-xl font-black text-[#1b1c1c] uppercase tracking-tight truncate max-w-[160px] sm:max-w-[200px]">
                {entry.name}
              </span>
              {isTop1 && (
                <span className="bg-[#b61929] text-white text-[9px] font-black px-1.5 py-0.2 rounded border border-[#1b1c1c] uppercase">
                  CHAMP
                </span>
              )}
              {isCurrentUser && (
                <span className="bg-[#b61929] text-white font-['Rubik',sans-serif] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#1b1c1c]">
                  ★ YOU
                </span>
              )}
            </div>
            <span className="font-['Rubik',sans-serif] text-[11px] font-bold text-[#5b403f] uppercase block">
              {entry.mode} MASTER • VERIFIED RUN
            </span>
          </div>
        </div>

        {/* Right: Score, Combo, Mode & Action */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap w-full md:w-auto justify-between md:justify-end">
          {/* Final Score */}
          <div className="text-left md:text-right">
            <span className="block font-['Rubik',sans-serif] text-[10px] font-bold text-[#5b403f] uppercase">
              FINAL SCORE
            </span>
            <span className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929]">
              {entry.score.toLocaleString()}{" "}
              <span className="text-xs text-[#1b1c1c]">PTS</span>
            </span>
          </div>

          {/* Peak Combo */}
          <div className="bg-white border-2 border-[#1b1c1c] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_#1b1c1c]">
            <span className="block font-['Rubik',sans-serif] text-[9px] font-bold text-[#5b403f] uppercase">
              COMBO
            </span>
            <span className="font-['Rubik',sans-serif] text-xs font-black text-[#9a4600]">
              ×{entry.maxCombo} PEAK
            </span>
          </div>

          {/* Mode Pill */}
          <span
            className={`font-['Rubik',sans-serif] text-[11px] font-black px-2.5 py-1 rounded-lg border-2 border-[#1b1c1c] uppercase ${
              entry.mode === "arcade"
                ? "bg-[#ffdbc9] text-[#763300]"
                : entry.mode === "zen"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-[#eae7e7] text-[#1b1c1c]"
            }`}
          >
            {entry.mode}
          </span>

          {/* Action Button */}
          {isCurrentUser ? (
            <Link
              to="/arcade"
              className="bg-[#d9363e] hover:bg-[#b61929] text-white font-['Rubik',sans-serif] text-xs font-black px-4 py-2 border-2 border-[#1b1c1c] rounded-lg shadow-[2px_2px_0px_#1b1c1c] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 uppercase"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>BEAT IT</span>
            </Link>
          ) : (
            <Link
              to="/arcade"
              className="bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-bold px-3.5 py-2 border-2 border-[#1b1c1c] rounded-lg shadow-[2px_2px_0px_#1b1c1c] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-[#1b1c1c]" />
              <span>PLAY</span>
            </Link>
          )}
        </div>
      </div>
    );
  }
);

LeaderboardTicketItem.displayName = "LeaderboardTicketItem";
