import React from "react";
import { Receipt, PlayCircle } from "lucide-react";
import type { DashboardRecentRun } from "../../api/dashboard.api";

interface DashboardRecentRunsProps {
  runs: DashboardRecentRun[];
  totalRunsCount: number;
  onViewHistory: () => void;
  onReplayTape: (sessionId: string) => void;
}

export const DashboardRecentRuns: React.FC<DashboardRecentRunsProps> = React.memo(
  ({ runs, totalRunsCount, onViewHistory, onReplayTape }) => {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-7 bg-[#fe893c] border-2 border-[#1b1c1c] shadow-[2px_2px_0_0_#1b1c1c]" />
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1b1c1c]">
              RECENT RUNS // SCORE TICKETS
            </h2>
          </div>
          <span className="font-['Rubik',sans-serif] text-xs uppercase bg-[#e4e2e1] border-2 border-[#1b1c1c] px-2.5 py-0.5 font-bold shadow-[2px_2px_0_0_#1b1c1c]">
            RECEIPT PRINTER ACTIVE
          </span>
        </div>

        {runs.length === 0 ? (
          <div className="bg-white border-4 border-[#1b1c1c] p-6 text-center shadow-[4px_4px_0_0_#1b1c1c]">
            <Receipt className="w-8 h-8 text-[#8f706e] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#5b403f]">No recent game receipts printed yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {runs.slice(0, 3).map((run, index) => {
              const runNumber = totalRunsCount - index;
              const isToday =
                new Date(run.createdAt).toDateString() === new Date().toDateString();
              const dateLabel = isToday
                ? `TODAY, ${new Date(run.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : new Date(run.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }).toUpperCase();

              const durationMins = Math.floor(run.duration / 60);
              const durationSecs = run.duration % 60;
              const formattedDuration = `${durationMins}m ${durationSecs.toString().padStart(2, "0")}s`;

              return (
                <article
                  key={run.id || run.sessionId}
                  className="relative bg-white border-4 border-[#1b1c1c] shadow-[5px_5px_0_0_#1b1c1c] p-4 sm:p-5 transition-transform hover:-translate-y-1"
                >
                  {index === 0 && (
                    <div className="absolute -top-2.5 right-8 w-20 h-5 rotate-1 bg-[#ffe07e]/90 shadow-[1px_1px_3px_rgba(0,0,0,0.15)] border-l-2 border-r-2 border-dashed border-[#8f706e]/50 pointer-events-none" />
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-dashed border-[#1b1c1c] pb-3 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#b61929] text-white border-2 border-[#1b1c1c] px-2 py-0.5 text-xs font-black shadow-[1px_1px_0_0_#1b1c1c]">
                        RUN #{runNumber > 0 ? runNumber : index + 1}
                      </span>
                      <h3 className="font-['Bricolage_Grotesque',sans-serif] text-base sm:text-lg font-black uppercase text-[#1b1c1c]">
                        {run.mode.toUpperCase()} SURVIVAL
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {run.bombsHit === 0 ? (
                        <span className="bg-[#ffe07e] text-[#4d3e00] border border-[#1b1c1c] text-[10px] font-black px-2 py-0.5 shadow-[1px_1px_0_0_#1b1c1c]">
                          BOMB-FREE RUN!
                        </span>
                      ) : (
                        <span className="bg-[#f0eded] border border-[#1b1c1c] text-[10px] font-black px-2 py-0.5 text-[#ba1a1a]">
                          {run.bombsHit} BOMB STRUCK
                        </span>
                      )}
                      <span className="text-xs font-['Rubik',sans-serif] text-[#8f706e] font-bold">
                        {dateLabel}
                      </span>
                    </div>
                  </div>

                  {/* Ticket Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 my-1">
                    <div className="bg-[#f6f3f2] border-2 border-[#1b1c1c] p-2 shadow-[2px_2px_0_0_#1b1c1c]">
                      <div className="text-[10px] font-black uppercase text-[#8f706e]">SCORE</div>
                      <div className="font-['Bricolage_Grotesque',sans-serif] text-lg sm:text-xl font-black text-[#b61929]">
                        {run.score.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#f6f3f2] border-2 border-[#1b1c1c] p-2 shadow-[2px_2px_0_0_#1b1c1c]">
                      <div className="text-[10px] font-black uppercase text-[#8f706e]">MAX COMBO</div>
                      <div className="font-['Bricolage_Grotesque',sans-serif] text-lg sm:text-xl font-black text-[#fe893c]">
                        ×{run.maxCombo}
                      </div>
                    </div>
                    <div className="bg-[#f6f3f2] border-2 border-[#1b1c1c] p-2 shadow-[2px_2px_0_0_#1b1c1c]">
                      <div className="text-[10px] font-black uppercase text-[#8f706e]">FRUITS / BOMBS</div>
                      <div className="font-['Bricolage_Grotesque',sans-serif] text-lg sm:text-xl font-black text-[#1b1c1c]">
                        {run.fruitsSliced} /{" "}
                        <span className={run.bombsHit > 0 ? "text-[#ba1a1a]" : "text-[#b61929]"}>
                          {run.bombsHit}
                        </span>
                      </div>
                    </div>
                    <div className="bg-[#f6f3f2] border-2 border-[#1b1c1c] p-2 shadow-[2px_2px_0_0_#1b1c1c]">
                      <div className="text-[10px] font-black uppercase text-[#8f706e]">SURVIVED</div>
                      <div className="font-['Bricolage_Grotesque',sans-serif] text-lg sm:text-xl font-black text-[#1b1c1c]">
                        {formattedDuration}
                      </div>
                    </div>
                  </div>

                  {/* Ticket Bottom Breakdown */}
                  <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-[#1b1c1c]/20 gap-2">
                    <div className="flex items-center gap-3 font-bold text-[#1b1c1c]">
                      <span>🍉 {Math.round(run.fruitsSliced * 0.4)} Melons</span>
                      <span>🍊 {Math.round(run.fruitsSliced * 0.3)} Oranges</span>
                      <span>🍌 {Math.round(run.fruitsSliced * 0.2)} Bananas</span>
                      <span>🍓 {Math.max(1, Math.round(run.fruitsSliced * 0.1))} Berries</span>
                    </div>
                    <button
                      onClick={() => onReplayTape(run.sessionId)}
                      className="text-[#b61929] hover:underline font-black uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <span>REPLAY TAPE</span>
                      <PlayCircle className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Perforated View All Button */}
        <button
          onClick={onViewHistory}
          className="w-full bg-[#FFF4D6] hover:bg-[#ffe07e] text-[#1b1c1c] border-4 border-[#1b1c1c] py-3 px-4 font-['Bricolage_Grotesque',sans-serif] text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1b1c1c] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
        >
          <Receipt className="w-5 h-5" />
          📜 PULL FULL TICKET ROLL ({totalRunsCount} RUNS)
        </button>
      </section>
    );
  }
);
DashboardRecentRuns.displayName = "DashboardRecentRuns";
