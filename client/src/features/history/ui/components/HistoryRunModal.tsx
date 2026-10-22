import React, { useEffect } from "react";
import { X, Play, Bomb, Target, Zap, Clock, Calendar } from "lucide-react";
import type { GameRunRecord } from "../../api/history.api";

interface HistoryRunModalProps {
  run: GameRunRecord | null;
  onClose: () => void;
  onPlayAgain: () => void;
}

export const HistoryRunModal: React.FC<HistoryRunModalProps> = React.memo(
  ({ run, onClose, onPlayAgain }) => {
    // Lock background scroll while modal is open (Requirement 1)
    useEffect(() => {
      if (!run) return;
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [run]);

    if (!run) return null;

    const formattedDate = new Date(run.createdAt).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const isBlitz = run.mode.toLowerCase() === "blitz";
    const minutes = Math.floor(run.duration / 60);
    const seconds = run.duration % 60;
    const timeFormatted = `${minutes}m ${seconds}s`;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-modal-title"
      >
        <div
          className="relative w-full max-w-lg bg-[#fff8eb] border-4 border-[#1b1c1c] shadow-[8px_8px_0px_#1b1c1c] p-6 sm:p-8 flex flex-col gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b-3 border-[#1b1c1c] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-black uppercase px-2.5 py-0.5 border-2 border-[#1b1c1c] ${
                    isBlitz
                      ? "bg-[#6d28d9] text-[#ffd875]"
                      : "bg-[#ffd875] text-[#1b1c1c]"
                  }`}
                >
                  {run.mode} RUN
                </span>
                <span className="text-xs font-mono font-bold text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
              </div>
              <h2
                id="run-modal-title"
                className="font-black text-2xl sm:text-3xl tracking-tight text-[#1b1c1c] mt-1 font-serif"
              >
                TICKET #{run.sessionId ? run.sessionId.slice(-6).toUpperCase() : "RECORD"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 border-2 border-[#1b1c1c] bg-white hover:bg-[#b61929] hover:text-white transition-colors cursor-pointer shadow-[2px_2px_0px_#1b1c1c]"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Score Banner */}
          <div className="bg-[#ffd875] border-3 border-[#1b1c1c] p-4 text-center shadow-[4px_4px_0px_#1b1c1c]">
            <p className="text-xs font-black tracking-widest text-[#1b1c1c]/80 uppercase">
              Final Certified Score
            </p>
            <div className="text-4xl sm:text-5xl font-black text-[#1b1c1c] tracking-tight font-serif mt-1">
              {run.score.toLocaleString()}
            </div>
            <p className="text-[11px] font-mono font-bold text-[#1b1c1c]/70 mt-1 uppercase">
              STATUS: {run.status.toUpperCase()}
            </p>
          </div>

          {/* Detailed Metric Cards */}
          <div className="grid grid-cols-2 gap-3 text-[#1b1c1c]">
            <div className="bg-white border-2 border-[#1b1c1c] p-3 shadow-[2px_2px_0px_#1b1c1c]">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-600 uppercase mb-1">
                <Target className="w-3.5 h-3.5 text-[#b61929]" /> Accuracy
              </div>
              <div className="text-2xl font-black">{Math.round(run.accuracy)}%</div>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                {run.fruitsSliced} sliced / {run.fruitsMissed} missed
              </p>
            </div>

            <div className="bg-white border-2 border-[#1b1c1c] p-3 shadow-[2px_2px_0px_#1b1c1c]">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-600 uppercase mb-1">
                <Zap className="w-3.5 h-3.5 text-[#eab308]" /> Max Combo
              </div>
              <div className="text-2xl font-black text-[#b61929] font-serif">
                {run.maxCombo}x
              </div>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Consecutive clean strikes</p>
            </div>

            <div className="bg-white border-2 border-[#1b1c1c] p-3 shadow-[2px_2px_0px_#1b1c1c]">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-600 uppercase mb-1">
                <Clock className="w-3.5 h-3.5 text-[#2563eb]" /> Survived
              </div>
              <div className="text-2xl font-black font-mono">{timeFormatted}</div>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">Total battle duration</p>
            </div>

            <div className="bg-white border-2 border-[#1b1c1c] p-3 shadow-[2px_2px_0px_#1b1c1c]">
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-600 uppercase mb-1">
                <Bomb className="w-3.5 h-3.5 text-[#1b1c1c]" /> Bombs Detonated
              </div>
              <div className="text-2xl font-black text-gray-900 font-mono">
                {run.bombsHit}
              </div>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                {run.bombsHit === 0 ? "Clean mine-free run!" : "Hazard strikes took lives"}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onPlayAgain}
              className="w-full sm:flex-1 py-3 px-5 bg-[#b61929] text-white font-black uppercase text-sm border-2 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1b1c1c] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Launch New Run
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 bg-white text-[#1b1c1c] font-black uppercase text-sm border-2 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] hover:bg-[#eae0ca] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
);

HistoryRunModal.displayName = "HistoryRunModal";
