import React from "react";
import { Apple, Zap, Timer, CheckCircle } from "lucide-react";
import type { DashboardBounty } from "../../api/dashboard.api";

interface DashboardBountiesProps {
  bounties: DashboardBounty[];
  resetsInHours: number;
}

export const DashboardBounties: React.FC<DashboardBountiesProps> = React.memo(
  ({ bounties, resetsInHours }) => {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-7 bg-[#b61929] border-2 border-[#1b1c1c] shadow-[2px_2px_0_0_#1b1c1c]" />
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1b1c1c]">
              KEEP SLICING // DAILY BOUNTIES
            </h2>
          </div>
          <span className="font-['Rubik',sans-serif] text-xs bg-[#ffe07e] border-2 border-[#1b1c1c] px-2.5 py-0.5 font-black shadow-[2px_2px_0_0_#1b1c1c]">
            RESETS IN {resetsInHours.toString().padStart(2, "0")}H 00M
          </span>
        </div>

        {/* Comic Progress Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {bounties.map((bounty, idx) => {
            const isCompleted = bounty.completed;
            const cardBg = isCompleted ? "bg-[#FFF4D6]" : "bg-white";

            return (
              <div
                key={bounty.id}
                className={`${cardBg} border-4 border-[#1b1c1c] shadow-[5px_5px_0_0_#1b1c1c] p-4 flex flex-col justify-between relative overflow-hidden`}
              >
                {isCompleted && (
                  <div className="absolute -top-3 right-6 w-16 h-5 rotate-3 bg-[#ffe07e]/90 shadow-[1px_1px_3px_rgba(0,0,0,0.15)] border-l-2 border-r-2 border-dashed border-[#8f706e]/50 pointer-events-none" />
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 border border-[#1b1c1c] ${
                        isCompleted
                          ? "bg-[#ffe07e] text-[#4d3e00]"
                          : "bg-[#b61929] text-white"
                      }`}
                    >
                      {isCompleted ? "COMPLETED!" : `BOUNTY #${idx + 1}`}
                    </span>
                    <span className="text-xs font-bold text-[#8f706e]">
                      +{bounty.rewardTokens} TOKENS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {bounty.id.includes("1") ? (
                      <Apple className="w-6 h-6 text-[#b61929]" />
                    ) : bounty.id.includes("2") ? (
                      <Zap className="w-6 h-6 text-[#fe893c]" />
                    ) : (
                      <Timer className="w-6 h-6 text-[#1b1c1c]" />
                    )}
                    <h3 className="font-['Rubik',sans-serif] text-sm sm:text-base font-extrabold text-[#1b1c1c]">
                      {bounty.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#5b403f] font-medium">{bounty.description}</p>
                </div>

                {/* Progress Meter Bar */}
                <div className="mt-4 pt-2 space-y-1.5">
                  <div className="flex justify-between text-xs font-black">
                    <span>{isCompleted ? "CLAIM REWARD" : "PROGRESS"}</span>
                    <span className={isCompleted ? "text-[#9a4600]" : "text-[#b61929]"}>
                      {bounty.current} / {bounty.target} ({bounty.progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-6 bg-[#f0eded] border-2 border-[#1b1c1c] p-0.5 shadow-[2px_2px_0_0_#1b1c1c]">
                    <div
                      className={`h-full border-r-2 border-[#1b1c1c] transition-all duration-500 relative flex items-center ${
                        isCompleted
                          ? "bg-[#fe893c] justify-center w-full"
                          : "bg-gradient-to-r from-[#fe893c] to-[#d9363e] justify-end pr-1"
                      }`}
                      style={{ width: isCompleted ? "100%" : `${bounty.progressPercent}%` }}
                    >
                      {isCompleted ? (
                        <span className="text-[10px] font-black text-white flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> READY TO CLAIM! ★
                        </span>
                      ) : (
                        <span className="text-[10px] font-black text-white">🍉</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }
);
DashboardBounties.displayName = "DashboardBounties";
