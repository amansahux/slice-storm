import React, { memo } from "react";
import { Crown, Medal, Shield, Swords, Sparkles, CheckCircle2 } from "lucide-react";
import type { LeaderboardUserEntry } from "../../api/leaderboard.api";

interface LeaderboardPodiumProps {
  first: LeaderboardUserEntry | null;
  second: LeaderboardUserEntry | null;
  third: LeaderboardUserEntry | null;
}

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = memo(
  ({ first, second, third }) => {
    if (!first && !second && !third) return null;

    return (
      <section className="mb-12 select-none">
        <div className="flex items-center gap-2 mb-6">
          <Medal className="w-6 h-6 text-[#b61929]" />
          <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl text-[#1b1c1c] uppercase font-black tracking-tight">
            THE APEX SLICERS // SEASON PODIUM
          </h2>
        </div>

        {/* 3-Column Podium Bento Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-8">
          {/* #2 PODIUM (SILVER) - Left Step */}
          {second ? (
            <div className="order-2 md:order-1 relative bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-2xl shadow-[6px_6px_0px_#1b1c1c] p-5 hover:-translate-y-1 transition-transform group">
              {/* Tape Top Decor */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#eae7e7] text-[#5b403f] text-[10px] font-black uppercase px-4 py-0.5 border-2 border-[#1b1c1c] shadow-[1px_1px_0px_#1b1c1c] -rotate-2 whitespace-nowrap">
                RUNNER UP // RANK #2
              </div>

              <div className="flex flex-col items-center text-center pt-2">
                {/* Silver Avatar */}
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-2xl bg-white border-3 border-[#1b1c1c] flex items-center justify-center shadow-[3px_3px_0px_#1b1c1c] group-hover:scale-105 transition-transform overflow-hidden">
                    {second.avatar ? (
                      <img
                        src={second.avatar}
                        alt={second.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Shield className="w-9 h-9 text-[#5b403f]" />
                    )}
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-[#eae7e7] text-[#1b1c1c] text-xs font-black w-7 h-7 rounded-full border-2 border-[#1b1c1c] flex items-center justify-center shadow-[2px_2px_0px_#1b1c1c]">
                    #2
                  </span>
                </div>

                {/* Player Name & Weapon */}
                <h3 className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#1b1c1c] uppercase tracking-tight truncate max-w-[200px]">
                  {second.name}
                </h3>
                <span className="inline-block bg-[#f0eded] text-[#5b403f] font-['Rubik',sans-serif] text-[10px] font-bold px-2.5 py-0.5 rounded border border-[#1b1c1c] mt-1 uppercase">
                  {second.mode} MASTER
                </span>

                {/* Score Pill */}
                <div className="mt-4 w-full bg-white border-3 border-[#1b1c1c] p-3 rounded-xl shadow-[3px_3px_0px_#1b1c1c]">
                  <span className="block font-['Rubik',sans-serif] text-[10px] font-bold text-[#5b403f] uppercase">
                    HIGHEST RUN
                  </span>
                  <span className="block font-['Bricolage_Grotesque',sans-serif] text-2xl font-black text-[#b61929] leading-tight">
                    {second.score.toLocaleString()}{" "}
                    <span className="text-xs font-bold text-[#1b1c1c]">PTS</span>
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 w-full mt-3 font-['Rubik',sans-serif] text-[11px] font-bold">
                  <div className="bg-[#f6f3f2] border border-[#1b1c1c] p-2 rounded-lg text-left">
                    <span className="text-[#5b403f] block text-[9px] uppercase">
                      PEAK COMBO
                    </span>
                    <span className="text-[#9a4600] font-black">
                      ×{second.maxCombo} MULTI
                    </span>
                  </div>
                  <div className="bg-[#f6f3f2] border border-[#1b1c1c] p-2 rounded-lg text-left">
                    <span className="text-[#5b403f] block text-[9px] uppercase">
                      FRUITS SLICED
                    </span>
                    <span className="text-[#1b1c1c] font-black">
                      {second.fruitsSliced.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Base Details */}
                <div className="w-full mt-4 pt-2.5 border-t-2 border-dashed border-[#1b1c1c]/30 flex justify-between items-center text-[11px] font-bold text-[#5b403f]">
                  <span>MODE: {second.mode.toUpperCase()}</span>
                  <span className="text-[#b61929] font-black">VERIFIED</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="order-2 md:order-1 opacity-40 bg-white/50 border-3 border-dashed border-[#1b1c1c] rounded-2xl p-8 text-center">
              <span className="font-['Rubik',sans-serif] text-xs font-bold uppercase">
                #2 PODIUM EMPTY
              </span>
            </div>
          )}

          {/* #1 PODIUM (GOLD) - Center Apex */}
          {first ? (
            <div className="order-1 md:order-2 relative bg-[#ffe07e] border-4 border-[#1b1c1c] rounded-2xl shadow-[8px_8px_0px_#1b1c1c] p-6 hover:-translate-y-1.5 transition-transform group md:-mt-8">
              {/* Animated Crown Sticker */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <Crown className="w-12 h-12 text-[#b61929] fill-[#ffe07e] filter drop-shadow-[2px_2px_0px_#1b1c1c] animate-bounce" />
              </div>

              {/* Badge Banner */}
              <div className="mt-3 text-center">
                <span className="inline-block bg-[#b61929] text-white font-['Rubik',sans-serif] text-xs font-black uppercase px-4 py-1 border-3 border-[#1b1c1c] rounded shadow-[2px_2px_0px_#1b1c1c] rotate-1">
                  👑 CABINET REIGNING CHAMPION
                </span>
              </div>

              <div className="flex flex-col items-center text-center pt-3">
                {/* Gold Avatar */}
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-2xl bg-white border-4 border-[#1b1c1c] flex items-center justify-center shadow-[4px_4px_0px_#1b1c1c] group-hover:scale-105 transition-transform overflow-hidden">
                    {first.avatar ? (
                      <img
                        src={first.avatar}
                        alt={first.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Swords className="w-11 h-11 text-[#b61929]" />
                    )}
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-[#fe893c] text-white font-black text-sm w-9 h-9 rounded-full border-3 border-[#1b1c1c] flex items-center justify-center shadow-[2px_2px_0px_#1b1c1c]">
                    #1
                  </span>
                </div>

                {/* Player Title */}
                <h3 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-black text-[#1b1c1c] uppercase tracking-tight truncate max-w-[220px]">
                  {first.name}
                </h3>
                <span className="inline-block bg-[#d9363e] text-white font-['Rubik',sans-serif] text-[10px] font-black px-3 py-0.5 rounded border-2 border-[#1b1c1c] mt-1 uppercase">
                  GOD TIER • {first.mode}
                </span>

                {/* Grand Score */}
                <div className="mt-4 w-full bg-[#FFF4D6] border-4 border-[#1b1c1c] p-4 rounded-xl shadow-[4px_4px_0px_#1b1c1c]">
                  <span className="block font-['Rubik',sans-serif] text-[10px] font-black text-[#5b403f] uppercase tracking-wider">
                    CHAMPION HIGHSCORE
                  </span>
                  <span className="block font-['Bricolage_Grotesque',sans-serif] text-3xl sm:text-4xl font-black text-[#b61929] leading-none mt-1">
                    {first.score.toLocaleString()}{" "}
                    <span className="font-['Rubik',sans-serif] text-sm text-[#1b1c1c]">
                      PTS
                    </span>
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 w-full mt-3 font-['Rubik',sans-serif] text-[11px] font-bold">
                  <div className="bg-white border-2 border-[#1b1c1c] p-2.5 rounded-lg text-left shadow-[2px_2px_0px_#1b1c1c]">
                    <span className="text-[#5b403f] block text-[9px] uppercase">
                      PEAK FRENZY
                    </span>
                    <span className="text-[#b61929] font-black text-sm">
                      ×{first.maxCombo} COMBO
                    </span>
                  </div>
                  <div className="bg-white border-2 border-[#1b1c1c] p-2.5 rounded-lg text-left shadow-[2px_2px_0px_#1b1c1c]">
                    <span className="text-[#5b403f] block text-[9px] uppercase">
                      FRUITS SLICED
                    </span>
                    <span className="text-[#1b1c1c] font-black text-sm">
                      {first.fruitsSliced.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="w-full mt-4 pt-2.5 border-t-2 border-dashed border-[#1b1c1c]/40 flex justify-between items-center text-[11px] font-black text-[#1b1c1c]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#b61929]" />
                    <span>RUN CERTIFIED</span>
                  </span>
                  <span className="bg-[#1b1c1c] text-[#ffe07e] px-2 py-0.5 rounded text-[10px]">
                    TOP CHAMP
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* #3 PODIUM (BRONZE) - Right Step */}
          {third ? (
            <div className="order-3 md:order-3 relative bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-2xl shadow-[6px_6px_0px_#1b1c1c] p-5 hover:-translate-y-1 transition-transform group">
              {/* Tape Top Decor */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ffdbc9] text-[#763300] text-[10px] font-black uppercase px-4 py-0.5 border-2 border-[#1b1c1c] shadow-[1px_1px_0px_#1b1c1c] rotate-2 whitespace-nowrap">
                PODIUM BRONZE // RANK #3
              </div>

              <div className="flex flex-col items-center text-center pt-2">
                {/* Bronze Avatar */}
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-2xl bg-[#ffb68d]/40 border-3 border-[#1b1c1c] flex items-center justify-center shadow-[3px_3px_0px_#1b1c1c] group-hover:scale-105 transition-transform overflow-hidden">
                    {third.avatar ? (
                      <img
                        src={third.avatar}
                        alt={third.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Sparkles className="w-9 h-9 text-[#9a4600]" />
                    )}
                  </div>
                  <span className="absolute -bottom-2 -right-2 bg-[#9a4600] text-white text-xs font-black w-7 h-7 rounded-full border-2 border-[#1b1c1c] flex items-center justify-center shadow-[2px_2px_0px_#1b1c1c]">
                    #3
                  </span>
                </div>

                {/* Player Name */}
                <h3 className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#1b1c1c] uppercase tracking-tight truncate max-w-[200px]">
                  {third.name}
                </h3>
                <span className="inline-block bg-[#f0eded] text-[#5b403f] font-['Rubik',sans-serif] text-[10px] font-bold px-2.5 py-0.5 rounded border border-[#1b1c1c] mt-1 uppercase">
                  {third.mode} SLICER
                </span>

                {/* Score Pill */}
                <div className="mt-4 w-full bg-white border-3 border-[#1b1c1c] p-3 rounded-xl shadow-[3px_3px_0px_#1b1c1c]">
                  <span className="block font-['Rubik',sans-serif] text-[10px] font-bold text-[#5b403f] uppercase">
                    HIGHEST RUN
                  </span>
                  <span className="block font-['Bricolage_Grotesque',sans-serif] text-2xl font-black text-[#9a4600] leading-tight">
                    {third.score.toLocaleString()}{" "}
                    <span className="text-xs font-bold text-[#1b1c1c]">PTS</span>
                  </span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 w-full mt-3 font-['Rubik',sans-serif] text-[11px] font-bold">
                  <div className="bg-[#f6f3f2] border border-[#1b1c1c] p-2 rounded-lg text-left">
                    <span className="text-[#5b403f] block text-[9px] uppercase">
                      PEAK COMBO
                    </span>
                    <span className="text-[#9a4600] font-black">
                      ×{third.maxCombo} MULTI
                    </span>
                  </div>
                  <div className="bg-[#f6f3f2] border border-[#1b1c1c] p-2 rounded-lg text-left">
                    <span className="text-[#5b403f] block text-[9px] uppercase">
                      FRUITS SLICED
                    </span>
                    <span className="text-[#1b1c1c] font-black">
                      {third.fruitsSliced.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Base Details */}
                <div className="w-full mt-4 pt-2.5 border-t-2 border-dashed border-[#1b1c1c]/30 flex justify-between items-center text-[11px] font-bold text-[#5b403f]">
                  <span>MODE: {third.mode.toUpperCase()}</span>
                  <span className="text-[#9a4600] font-black">PODIUM</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="order-3 md:order-3 opacity-40 bg-white/50 border-3 border-dashed border-[#1b1c1c] rounded-2xl p-8 text-center">
              <span className="font-['Rubik',sans-serif] text-xs font-bold uppercase">
                #3 PODIUM EMPTY
              </span>
            </div>
          )}
        </div>
      </section>
    );
  }
);

LeaderboardPodium.displayName = "LeaderboardPodium";
