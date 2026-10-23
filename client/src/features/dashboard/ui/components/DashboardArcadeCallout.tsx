import React from "react";
import { Coins } from "lucide-react";

interface DashboardArcadeCalloutProps {
  onInsertCoinAndPlay: () => void;
}

export const DashboardArcadeCallout: React.FC<DashboardArcadeCalloutProps> = React.memo(
  ({ onInsertCoinAndPlay }) => {
    return (
      <section className="relative bg-[#b61929] border-4 border-[#1b1c1c] shadow-[7px_7px_0_0_#1b1c1c] p-6 sm:p-8 text-white overflow-hidden text-center sm:text-left">
        {/* Background Comic Burst */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 15%, transparent 16%)",
            backgroundSize: "8px 8px",
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-block bg-[#ffe07e] text-[#4d3e00] border-2 border-[#1b1c1c] px-2.5 py-0.5 text-xs font-black shadow-[2px_2px_0_0_#1b1c1c]">
              BLADE READY IN SCABBARD
            </div>
            <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
              READY FOR ANOTHER RUN?
            </h2>
            <p className="font-['Rubik',sans-serif] text-sm text-white/90 leading-relaxed">
              Insert 1 token or click below to launch the web arcade canvas and beat your high score.
            </p>
          </div>

          <button
            onClick={onInsertCoinAndPlay}
            className="bg-[#ffe07e] hover:bg-[#ffd54f] text-[#4d3e00] border-4 border-[#1b1c1c] py-4 px-8 font-['Bricolage_Grotesque',sans-serif] text-base font-black uppercase tracking-wider shadow-[6px_6px_0_0_#1b1c1c] flex items-center justify-center gap-3 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer self-center sm:self-auto"
          >
            <Coins className="w-6 h-6 text-[#9a4600]" />
            <span>INSERT COIN & PLAY</span>
          </button>
        </div>
      </section>
    );
  }
);
DashboardArcadeCallout.displayName = "DashboardArcadeCallout";
