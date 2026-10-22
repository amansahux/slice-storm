import React, { memo } from "react";
import { Receipt, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { GameRunRecord } from "../../api/history.api";

interface HistoryTicketCardProps {
  run: GameRunRecord;
  index: number;
  onOpenDetails: (run: GameRunRecord) => void;
}

export const HistoryTicketCard: React.FC<HistoryTicketCardProps> = memo(
  ({ run, index, onOpenDetails }) => {
    const formattedDate = new Date(run.createdAt).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const mins = Math.floor(run.duration / 60);
    const secs = run.duration % 60;
    const durationFormatted = `${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;

    const hasBomb = run.bombsHit > 0;

    return (
      <article className="relative bg-white border-4 border-[#1b1c1c] p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0_0_#1b1c1c] hover:-translate-y-1 transition-all select-none">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b-2 border-dashed border-[#1b1c1c]/25 pb-3">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 font-['Bricolage_Grotesque',sans-serif] font-black text-xs sm:text-sm border-2 border-[#1b1c1c] rounded-lg shadow-[1px_1px_0px_#1b1c1c] ${
                run.mode === "classic"
                  ? "bg-[#b61929] text-white"
                  : "bg-[#fe893c] text-[#672c00]"
              }`}
            >
              #{run.sessionId ? run.sessionId.slice(-4).toUpperCase() : `0${index + 1}`}
            </span>
            <div>
              <h3 className="font-['Bricolage_Grotesque',sans-serif] text-base sm:text-lg font-black text-[#1b1c1c] uppercase tracking-tight">
                {run.mode} SURVIVAL
              </h3>
              <span className="font-['Rubik',sans-serif] text-[11px] text-[#5b403f] font-bold block">
                {formattedDate} • VERIFIED ARCADE LOG
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between pt-1 sm:pt-0">
            <span className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929]">
              {run.score.toLocaleString()} PTS
            </span>
            {hasBomb ? (
              <span className="font-['Rubik',sans-serif] text-[10px] text-[#ba1a1a] font-extrabold uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-[#ba1a1a]" />
                {run.bombsHit} BOMB(S) HIT
              </span>
            ) : (
              <span className="font-['Rubik',sans-serif] text-[10px] text-emerald-700 font-extrabold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                NO BOMBS HIT
              </span>
            )}
          </div>
        </div>

        {/* 4 Stats Matrix Cells */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 py-3 border-b-2 border-dashed border-[#1b1c1c]/25 text-center">
          <div className="bg-[#f6f3f2] p-2 border border-[#1b1c1c] rounded-xl">
            <div className="font-['Rubik',sans-serif] text-[10px] text-[#5b403f] uppercase font-bold">
              FRUITS
            </div>
            <div className="font-['Rubik',sans-serif] font-black text-sm sm:text-base text-[#1b1c1c]">
              {run.fruitsSliced} SLICES
            </div>
          </div>

          <div className="bg-[#f6f3f2] p-2 border border-[#1b1c1c] rounded-xl">
            <div className="font-['Rubik',sans-serif] text-[10px] text-[#5b403f] uppercase font-bold">
              MAX COMBO
            </div>
            <div className="font-['Rubik',sans-serif] font-black text-sm sm:text-base text-[#9a4600]">
              ×{run.maxCombo} COMBO
            </div>
          </div>

          <div className="bg-[#f6f3f2] p-2 border border-[#1b1c1c] rounded-xl">
            <div className="font-['Rubik',sans-serif] text-[10px] text-[#5b403f] uppercase font-bold">
              ACCURACY
            </div>
            <div className="font-['Rubik',sans-serif] font-black text-sm sm:text-base text-emerald-700">
              {run.accuracy || 92}%
            </div>
          </div>

          <div className="bg-[#f6f3f2] p-2 border border-[#1b1c1c] rounded-xl">
            <div className="font-['Rubik',sans-serif] text-[10px] text-[#5b403f] uppercase font-bold">
              DURATION
            </div>
            <div className="font-['Rubik',sans-serif] font-black text-sm sm:text-base text-[#1b1c1c]">
              {durationFormatted}
            </div>
          </div>
        </div>

        {/* Card Footer with Details Button */}
        <div className="pt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-['Rubik',sans-serif] text-xs font-bold text-[#5b403f]">
            <span>🍉 Fruit Slices Verified</span>
            <span>•</span>
            <span className="uppercase text-[#1b1c1c]">{run.status}</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenDetails(run)}
            className="cursor-pointer px-4 py-1.5 bg-[#ffe07e] hover:bg-[#e9c339] text-[#1b1c1c] border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-black uppercase rounded-lg shadow-[2px_2px_0_0_#1b1c1c] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
          >
            <Receipt className="w-3.5 h-3.5 text-[#b61929]" />
            <span>VIEW RUN →</span>
          </button>
        </div>
      </article>
    );
  }
);

HistoryTicketCard.displayName = "HistoryTicketCard";
