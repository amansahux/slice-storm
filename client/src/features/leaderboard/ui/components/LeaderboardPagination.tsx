import React, { memo } from "react";
import { Locate, ChevronLeft, ChevronRight } from "lucide-react";

interface LeaderboardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onJumpToPlayer: () => void;
  hasPlayerTicket: boolean;
  playerRank: number | null;
}

export const LeaderboardPagination: React.FC<LeaderboardPaginationProps> = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    onJumpToPlayer,
    hasPlayerTicket,
    playerRank,
  }) => {
    return (
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-14 bg-[#FFF4D6] border-3 border-[#1b1c1c] p-4 rounded-2xl shadow-[4px_4px_0px_#1b1c1c] select-none">
        {/* Quick Jump to User */}
        {hasPlayerTicket ? (
          <button
            type="button"
            onClick={onJumpToPlayer}
            className="cursor-pointer bg-[#ffe07e] hover:bg-[#e9c339] text-[#231b00] font-['Rubik',sans-serif] text-xs font-black px-4 py-2.5 border-2 border-[#1b1c1c] rounded-xl shadow-[2px_2px_0px_#1b1c1c] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 uppercase"
          >
            <Locate className="w-4 h-4 text-[#b61929]" />
            <span>
              JUMP TO MY RANK {playerRank ? `(#0${playerRank})` : ""}
            </span>
          </button>
        ) : (
          <div className="font-['Rubik',sans-serif] text-xs font-bold text-[#5b403f]">
            ⚡ PLAY AN ARCADE RUN TO GET A LIVE TICKET
          </div>
        )}

        {/* Pagination Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`font-['Rubik',sans-serif] text-xs font-bold px-3.5 py-2 border-2 border-[#1b1c1c] rounded-xl flex items-center gap-1.5 transition-all ${
              currentPage <= 1
                ? "opacity-50 cursor-not-allowed bg-[#eae7e7] text-[#5b403f]"
                : "cursor-pointer bg-white hover:bg-[#ffe07e] text-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>PREV SHEET</span>
          </button>

          <div className="bg-white text-[#1b1c1c] font-['Rubik',sans-serif] text-xs font-black px-3.5 py-2 border-2 border-[#1b1c1c] rounded-xl shadow-[1px_1px_0px_#1b1c1c]">
            PAGE {currentPage} OF {totalPages}
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`font-['Rubik',sans-serif] text-xs font-bold px-3.5 py-2 border-2 border-[#1b1c1c] rounded-xl flex items-center gap-1.5 transition-all ${
              currentPage >= totalPages
                ? "opacity-50 cursor-not-allowed bg-[#eae7e7] text-[#5b403f]"
                : "cursor-pointer bg-white hover:bg-[#ffe07e] text-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <span>NEXT SHEET</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }
);

LeaderboardPagination.displayName = "LeaderboardPagination";
