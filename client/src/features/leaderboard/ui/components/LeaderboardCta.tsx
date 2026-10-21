import React, { memo } from "react";
import { Link } from "react-router";
import { Swords, BarChart3, Zap } from "lucide-react";

export const LeaderboardCta: React.FC = memo(() => {
  return (
    <section className="mb-14 select-none">
      <div className="relative bg-[#fe893c] border-4 border-[#1b1c1c] rounded-2xl p-8 sm:p-12 shadow-[8px_8px_0px_#1b1c1c] text-center overflow-hidden">
        {/* Comic Starburst decorative blobs */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#ffe07e] rounded-full opacity-40 -rotate-12 pointer-events-none" />
        <div className="absolute -bottom-16 -right-12 w-56 h-56 bg-[#b61929] opacity-20 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Washi tape badge */}
          <span className="inline-flex items-center gap-1.5 bg-[#FFF4D6] text-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-black uppercase px-4 py-1.5 border-2 border-[#1b1c1c] rounded-lg shadow-[2px_2px_0px_#1b1c1c] -rotate-1 mb-4">
            <Zap className="w-3.5 h-3.5 text-[#b61929]" />
            <span>CHALLENGE THE CURRENT CHAMPION</span>
          </span>

          <h2 className="font-['Bricolage_Grotesque',sans-serif] text-3xl sm:text-5xl font-black text-[#1b1c1c] uppercase leading-tight tracking-tight">
            STOP WATCHING THE BOARD.
            <br />
            <span className="text-[#b61929] drop-shadow-[2px_2px_0px_#FFF]">
              CHANGE IT.
            </span>
          </h2>

          <p className="font-['Rubik',sans-serif] text-sm sm:text-base font-bold text-[#672c00] mt-3 mb-8">
            The cabinet is warm, your blade is razor-sharp, and only your slicing reflexes stand between you and arcade glory.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/arcade"
              className="bg-[#d9363e] hover:bg-[#b61929] text-white font-['Bricolage_Grotesque',sans-serif] text-base sm:text-lg font-black uppercase px-8 py-4 border-4 border-[#1b1c1c] rounded-xl shadow-[6px_6px_0px_#1b1c1c] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1b1c1c] active:translate-y-1 active:shadow-none transition-all flex items-center gap-3"
            >
              <Swords className="w-5 h-5" />
              <span>INSERT COIN &amp; SLAM PLAY</span>
            </Link>

            <Link
              to="/dashboard"
              className="bg-[#FFF4D6] hover:bg-white text-[#1b1c1c] font-['Bricolage_Grotesque',sans-serif] text-base sm:text-lg font-black uppercase px-6 py-4 border-4 border-[#1b1c1c] rounded-xl shadow-[4px_4px_0px_#1b1c1c] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#1b1c1c] active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5 text-[#b61929]" />
              <span>DASHBOARD</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

LeaderboardCta.displayName = "LeaderboardCta";
