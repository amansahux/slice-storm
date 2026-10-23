import React from "react";
import { Swords, Zap, Apple, Shield, Lock } from "lucide-react";
import type { DashboardTrophy } from "../../api/dashboard.api";

interface DashboardTrophiesProps {
  trophies: DashboardTrophy[];
  unlockedCount: number;
}

export const DashboardTrophies: React.FC<DashboardTrophiesProps> = React.memo(
  ({ trophies, unlockedCount }) => {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-7 bg-[#ffe07e] border-2 border-[#1b1c1c] shadow-[2px_2px_0_0_#1b1c1c]" />
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1b1c1c]">
              YOUR TROPHIES // STICKER ALBUM
            </h2>
          </div>
          <span className="font-['Rubik',sans-serif] text-xs bg-[#FFF4D6] border-2 border-[#1b1c1c] px-2.5 py-0.5 font-bold shadow-[2px_2px_0_0_#1b1c1c]">
            {unlockedCount} / {trophies.length} UNLOCKED
          </span>
        </div>

        {/* Sticker Grid with slight paper rotations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {trophies.map((trophy, idx) => {
            const rotations = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]", "rotate-[2deg]", "rotate-0"];
            const rotClass = rotations[idx % rotations.length];

            if (!trophy.unlocked) {
              return (
                <div
                  key={trophy.id}
                  className="bg-[#eae7e7]/60 border-3 border-dashed border-[#1b1c1c]/60 shadow-[3px_3px_0_0_#8f706e] p-3 text-center flex flex-col items-center opacity-75"
                >
                  <div className="w-14 h-14 rounded-full bg-[#e4e2e1] text-[#8f706e] border-2 border-[#1b1c1c]/50 flex items-center justify-center my-2">
                    <Lock className="w-7 h-7" />
                  </div>
                  <span className="font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase text-[#8f706e]">
                    {trophy.title}
                  </span>
                  <span className="text-[10px] text-[#8f706e] font-medium mt-1">
                    {trophy.description}
                  </span>
                  <span className="mt-2 bg-[#f0eded] text-[#8f706e] border border-[#8f706e] text-[9px] font-black px-1.5 py-0.5">
                    LOCKED 🔒
                  </span>
                </div>
              );
            }

            const iconColors = [
              "bg-[#b61929] text-white",
              "bg-[#fe893c] text-white",
              "bg-[#ffe07e] text-[#4d3e00]",
              "bg-[#e4e2e1] text-[#1b1c1c]",
              "bg-[#b61929] text-white",
            ];
            const badgeBg = iconColors[idx % iconColors.length];

            return (
              <div
                key={trophy.id}
                className={`bg-white border-3 border-[#1b1c1c] shadow-[4px_4px_0_0_#1b1c1c] p-3 text-center ${rotClass} hover:rotate-0 transition-transform flex flex-col items-center`}
              >
                <div
                  className={`w-14 h-14 rounded-full ${badgeBg} border-2 border-[#1b1c1c] flex items-center justify-center shadow-[2px_2px_0_0_#1b1c1c] my-2`}
                >
                  {idx === 0 ? (
                    <Swords className="w-7 h-7" />
                  ) : idx === 1 ? (
                    <Zap className="w-7 h-7" />
                  ) : idx === 2 ? (
                    <Apple className="w-7 h-7" />
                  ) : (
                    <Shield className="w-7 h-7" />
                  )}
                </div>
                <span className="font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase text-[#1b1c1c]">
                  {trophy.title}
                </span>
                <span className="text-[10px] text-[#8f706e] font-medium mt-1">
                  {trophy.description}
                </span>
                <span className="mt-2 bg-[#ffe07e] text-[#4d3e00] border border-[#1b1c1c] text-[9px] font-black px-1.5 py-0.5">
                  UNLOCKED ★
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
);
DashboardTrophies.displayName = "DashboardTrophies";
