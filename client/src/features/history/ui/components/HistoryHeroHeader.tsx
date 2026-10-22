import React, { memo } from "react";
import { Link } from "react-router";
import { Swords, BarChart3, Database } from "lucide-react";

export const HistoryHeroHeader: React.FC = memo(() => {
  return (
    <section className="relative bg-[#FFF4D6] border-4 border-[#1b1c1c] p-6 sm:p-8 rounded-2xl shadow-[6px_6px_0_0_#1b1c1c] select-none">
      {/* Washi tape corner decorations */}
      <div className="absolute -top-3.5 left-6 sm:left-10 bg-[#b61929] text-white px-4 sm:px-6 py-0.5 sm:py-1 font-['Rubik',sans-serif] text-[10px] sm:text-xs font-black tracking-wider uppercase border border-[#1b1c1c] z-10 -rotate-1 shadow-[2px_2px_0px_#1b1c1c]">
        RECORD LOG v4.2
      </div>
      <div className="absolute -top-3.5 right-6 sm:right-12 bg-[#ffe07e] text-[#231b00] px-3 sm:px-5 py-0.5 font-['Rubik',sans-serif] text-[10px] sm:text-xs font-black border border-[#1b1c1c] z-10 rotate-1 shadow-[2px_2px_0px_#1b1c1c] hidden sm:block">
        TICKET PRINTER: ONLINE
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#ffe07e] text-[#4d3e00] px-3 py-0.5 border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-xs uppercase font-black rounded shadow-[2px_2px_0px_#1b1c1c]">
            <Database className="w-3.5 h-3.5 text-[#b61929]" />
            <span>CENTRAL ARCHIVE // COMBAT DOSSIER</span>
          </div>

          <h1 className="font-['Bricolage_Grotesque',sans-serif] text-3xl sm:text-5xl lg:text-6xl uppercase text-[#1b1c1c] tracking-tight font-black leading-none drop-shadow-[2px_2px_0px_#FFF]">
            YOUR RUNS <span className="text-[#b61929]">//</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b61929] via-[#d9363e] to-[#fe893c]">
              SCOREBOOK
            </span>
          </h1>

          <p className="font-['Rubik',sans-serif] text-xs sm:text-sm lg:text-base text-[#5b403f] font-medium max-w-2xl mt-1">
            Every slice tells a story. Review your combat logs, dissect combos, inspect bomb incidents, and sharpen your blade for the master league.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 flex-shrink-0">
          <Link
            to="/arcade"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#d9363e] hover:bg-[#b61929] text-white border-4 border-[#1b1c1c] font-['Bricolage_Grotesque',sans-serif] text-base font-black rounded-xl shadow-[4px_4px_0_0_#1b1c1c] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#1b1c1c] active:translate-y-1 active:shadow-none transition-all uppercase"
          >
            <Swords className="w-5 h-5" />
            <span>PLAY AGAIN</span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-[#ffe07e] text-[#1b1c1c] border-4 border-[#1b1c1c] font-['Bricolage_Grotesque',sans-serif] text-base font-black rounded-xl shadow-[4px_4px_0_0_#1b1c1c] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#1b1c1c] active:translate-y-1 active:shadow-none transition-all uppercase"
          >
            <BarChart3 className="w-5 h-5 text-[#b61929]" />
            <span>DASHBOARD</span>
          </Link>
        </div>
      </div>
    </section>
  );
});

HistoryHeroHeader.displayName = "HistoryHeroHeader";
