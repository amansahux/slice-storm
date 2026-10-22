import React, { memo } from "react";
import { Star, Receipt } from "lucide-react";
import type { GameRunRecord } from "../../api/history.api";

interface HistoryGoldenTicketProps {
  goldenRun: GameRunRecord | null;
  onOpenDetails: (run: GameRunRecord) => void;
}

export const HistoryGoldenTicket: React.FC<HistoryGoldenTicketProps> = memo(
  ({ goldenRun, onOpenDetails }) => {
    if (!goldenRun) return null;

    const formattedDate = new Date(goldenRun.createdAt).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const durationMins = Math.floor(goldenRun.duration / 60);
    const durationSecs = goldenRun.duration % 60;
    const timeFormatted = `${String(durationMins).padStart(2, "0")}m ${String(
      durationSecs
    ).padStart(2, "0")}s`;

    return (
      <section className="relative bg-[#FFF4D6] border-4 border-[#1b1c1c] p-6 sm:p-8 rounded-2xl shadow-[8px_8px_0_0_#1b1c1c] overflow-hidden select-none">
        {/* Faux tape corners */}
        <div className="absolute -top-3 left-6 bg-[#ffe07e] text-[#231b00] px-6 sm:px-8 py-1 border border-[#1b1c1c] font-['Rubik',sans-serif] text-[10px] sm:text-xs font-black shadow-[2px_2px_0px_#1b1c1c] z-10 -rotate-1">
          ★ GOLDEN MASTER PASS ★
        </div>
        <div className="absolute -bottom-3 right-8 bg-[#b61929] text-white px-6 sm:px-8 py-1 border border-[#1b1c1c] font-['Rubik',sans-serif] text-[10px] sm:text-xs font-black shadow-[2px_2px_0px_#1b1c1c] z-10 rotate-1 hidden sm:block">
          AUTHENTICATED SLICE
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          {/* Left: Ticket Header & Big Stamp */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffe07e] text-[#4d3e00] border-2 border-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-black uppercase rounded shadow-[2px_2px_0px_#1b1c1c]">
              <Star className="w-3.5 h-3.5 fill-[#b61929] text-[#b61929]" />
              <span>PERSONAL BEST — ALL-TIME HIGH</span>
            </div>

            <div>
              <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl lg:text-4xl uppercase text-[#1b1c1c] font-black tracking-tight">
                GOLDEN TICKET // MASTER RECORD
              </h2>
              <p className="font-['Rubik',sans-serif] text-xs sm:text-sm text-[#5b403f] mt-1">
                Mode: <strong className="text-[#1b1c1c] uppercase">{goldenRun.mode} SURVIVAL</strong> • Date: <strong>{formattedDate}</strong>
              </p>
            </div>

            <div className="p-4 bg-white border-4 border-[#1b1c1c] shadow-[4px_4px_0_0_#1b1c1c] rounded-xl inline-block">
              <div className="font-['Rubik',sans-serif] text-[10px] sm:text-xs text-[#5b403f] uppercase font-bold">
                TOTAL REGISTERED SCORE
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-3xl sm:text-5xl font-black text-[#b61929] tracking-tight mt-1">
                {goldenRun.score.toLocaleString()}{" "}
                <span className="text-base text-[#1b1c1c] font-bold">PTS</span>
              </div>
              <div className="font-['Rubik',sans-serif] text-[10px] sm:text-xs text-emerald-700 font-black uppercase mt-1">
                {goldenRun.bombsHit === 0
                  ? "✓ ZERO BOMBS DETONATED • PERFECT FRENZY"
                  : `⚠️ ${goldenRun.bombsHit} BOMB(S) ENCOUNTERED`}
              </div>
            </div>
          </div>

          {/* Middle: Stats Matrix */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="bg-white border-2 border-[#1b1c1c] p-3 rounded-xl shadow-[2px_2px_0_0_#1b1c1c]">
              <div className="font-['Rubik',sans-serif] text-[10px] text-[#5b403f] uppercase font-bold">
                PEAK COMBO
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#9a4600] mt-1">
                ×{goldenRun.maxCombo} COMBO
              </div>
              <div className="font-['Rubik',sans-serif] text-[11px] text-[#5b403f]">
                Triple blade rush
              </div>
            </div>

            <div className="bg-white border-2 border-[#1b1c1c] p-3 rounded-xl shadow-[2px_2px_0_0_#1b1c1c]">
              <div className="font-['Rubik',sans-serif] text-[10px] text-[#5b403f] uppercase font-bold">
                TARGET HARVEST
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#1b1c1c] mt-1">
                {goldenRun.fruitsSliced} FRUITS
              </div>
              <div className="font-['Rubik',sans-serif] text-[11px] text-[#5b403f]">
                Sliced cleanly
              </div>
            </div>

            <div className="bg-white border-2 border-[#1b1c1c] p-3 rounded-xl shadow-[2px_2px_0_0_#1b1c1c]">
              <div className="font-['Rubik',sans-serif] text-[10px] text-[#5b403f] uppercase font-bold">
                SLICE ACCURACY
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-emerald-700 mt-1">
                {goldenRun.accuracy || 95}%
              </div>
              <div className="font-['Rubik',sans-serif] text-[11px] text-[#5b403f]">
                {goldenRun.fruitsMissed} whiffs
              </div>
            </div>

            <div className="bg-white border-2 border-[#1b1c1c] p-3 rounded-xl shadow-[2px_2px_0_0_#1b1c1c]">
              <div className="font-['Rubik',sans-serif] text-[10px] text-[#5b403f] uppercase font-bold">
                RUN TIME
              </div>
              <div className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#1b1c1c] mt-1">
                {timeFormatted}
              </div>
              <div className="font-['Rubik',sans-serif] text-[11px] text-[#5b403f]">
                Stage survived
              </div>
            </div>
          </div>

          {/* Right: Fruit Harvest Log & Details Button */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-4">
            <div className="bg-white border-2 border-[#1b1c1c] p-3.5 rounded-xl shadow-[2px_2px_0_0_#1b1c1c] space-y-2">
              <span className="font-['Rubik',sans-serif] text-[10px] uppercase font-black tracking-wider text-[#5b403f] block">
                JUICE HARVEST SUMMARY
              </span>
              <div className="grid grid-cols-2 gap-1.5 font-['Rubik',sans-serif] text-xs font-bold">
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-900 px-2 py-0.5 rounded border border-[#1b1c1c]">
                  🍉 Watermelons
                </span>
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-900 px-2 py-0.5 rounded border border-[#1b1c1c]">
                  🍊 Oranges
                </span>
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded border border-[#1b1c1c]">
                  🍌 Bananas
                </span>
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 px-2 py-0.5 rounded border border-[#1b1c1c]">
                  🫐 Berries
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenDetails(goldenRun)}
              className="cursor-pointer w-full py-3 px-4 bg-[#ffe07e] hover:bg-[#e9c339] text-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-black uppercase border-4 border-[#1b1c1c] rounded-xl shadow-[4px_4px_0_0_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4 text-[#b61929]" />
              <span>[ 📜 VIEW RUN DETAILS ]</span>
            </button>
          </div>
        </div>
      </section>
    );
  }
);

HistoryGoldenTicket.displayName = "HistoryGoldenTicket";
