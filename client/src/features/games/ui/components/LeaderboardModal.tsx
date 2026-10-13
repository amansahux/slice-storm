import React, { memo } from "react";
import type { LeaderboardUserEntry } from "../../apis/game.api";
import type { LeaderboardEntry } from "../../config/game.types";

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: readonly (LeaderboardEntry | LeaderboardUserEntry)[];
  isLoading?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = memo(({
  isOpen,
  onClose,
  entries,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center p-4 bg-[#1b1c1c]/50 backdrop-blur-[2px] animate-fadeIn select-none">
      <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl p-6 max-w-md w-full shadow-[8px_8px_0px_#1b1c1c] outline outline-4 outline-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#b61929] uppercase">
            ARCADE LEADERBOARDS
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer w-8 h-8 rounded border-2 border-[#1b1c1c] bg-[#eae7e7] hover:bg-[#e4e2e1] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center font-bold transition-all"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-[#b61929] border-t-transparent rounded-full animate-spin" />
            <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#5b403f] uppercase tracking-wider">
              Loading Champions...
            </span>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center font-['Rubik',sans-serif] text-sm text-[#5b403f]">
            No Dojo records yet. Be the first to slice!
          </div>
        ) : (
          <div className="space-y-2 mb-6 max-h-72 overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.rank}
                className={`flex justify-between items-center p-2.5 rounded border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] font-['Rubik',sans-serif] font-bold text-sm ${
                  entry.rank === 1
                    ? "bg-[#ffe07e] text-[#231b00]"
                    : "bg-white text-[#1b1c1c]"
                }`}
              >
                <span className="tracking-wide flex items-center gap-2">
                  <span className="w-5 text-center font-black">
                    {entry.rank === 1 ? "👑" : `${entry.rank}.`}
                  </span>
                  {entry.name}
                </span>
                <span className="text-[#b61929] font-black">
                  {entry.score.toLocaleString()} PTS
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full bg-[#fe893c] hover:bg-[#fe7a24] text-[#672c00] py-2.5 border-2 border-[#1b1c1c] rounded-lg shadow-[3px_3px_0px_#1b1c1c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-bold uppercase tracking-wider transition-all"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
});

LeaderboardModal.displayName = "LeaderboardModal";
