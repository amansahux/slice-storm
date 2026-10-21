import React, { memo } from "react";
import { Trophy, Sparkles } from "lucide-react";

interface LeaderboardMarqueeHeaderProps {
  peakScore: number;
}

export const LeaderboardMarqueeHeader: React.FC<LeaderboardMarqueeHeaderProps> =
  memo(({ peakScore }) => {
    return (
      <section className="relative mb-10 select-none">
        {/* Marquee Title Arcade Card */}
        <div className="relative bg-[#FFF4D6] border-4 border-[#1b1c1c] p-6 sm:p-8 rounded-2xl shadow-[8px_8px_0px_#1b1c1c] overflow-hidden">
          {/* Background diagonal decorative blobs */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#ffe07e] opacity-40 rounded-full pointer-events-none transform rotate-12" />
          <div className="absolute -right-4 bottom-0 w-96 h-12 bg-[#b61929] opacity-10 transform -rotate-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              {/* Washi tape badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#ffe07e] text-[#4d3e00] px-3 py-1 font-['Rubik',sans-serif] text-xs font-black border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] uppercase -rotate-1 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#b61929]" />
                <span>HALL OF JUICED LEGENDS</span>
              </div>

              <h1 className="font-['Bricolage_Grotesque',sans-serif] text-3xl sm:text-5xl lg:text-6xl text-[#1b1c1c] tracking-tight uppercase leading-none drop-shadow-[2px_2px_0px_#FFF] font-black">
                TOP SLICERS <span className="text-[#b61929]">//</span>{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#b61929] via-[#d9363e] to-[#fe893c]">
                  GLOBAL CABINET
                </span>
              </h1>

              <p className="font-['Rubik',sans-serif] text-sm sm:text-base text-[#5b403f] font-medium mt-3 max-w-xl">
                The storm&apos;s fastest blades. One clean run, one razor-sharp
                combo can dethrone champions and etch your callsign into arcade
                history forever.
              </p>
            </div>

            {/* Trophy Graphic Sticker Badge */}
            <div className="flex-shrink-0 flex md:flex-col items-center justify-center gap-2 bg-white border-4 border-[#1b1c1c] p-4 rounded-xl shadow-[5px_5px_0px_#1b1c1c] rotate-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#ffe07e] border-3 border-[#1b1c1c] flex items-center justify-center shadow-[2px_2px_0px_#1b1c1c]">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#b61929]" />
              </div>
              <div className="text-center">
                <span className="block font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#1b1c1c] leading-tight">
                  {peakScore.toLocaleString()}
                </span>
                <span className="block font-['Rubik',sans-serif] text-[10px] font-black text-[#5b403f] uppercase tracking-wider">
                  ALL-TIME PEAK
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  });

LeaderboardMarqueeHeader.displayName = "LeaderboardMarqueeHeader";
