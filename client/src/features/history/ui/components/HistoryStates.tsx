import React from "react";
import { AlertCircle, RefreshCw, Swords, Play } from "lucide-react";

interface HistoryLoadingSkeletonProps {
  count?: number;
}

export const HistoryLoadingSkeleton: React.FC<HistoryLoadingSkeletonProps> = React.memo(
  ({ count = 3 }) => {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#FFF4D6] border-3 border-[#1b1c1c] p-5 shadow-[5px_5px_0px_#1b1c1c] animate-pulse relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b-2 border-dashed border-[#1b1c1c]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#1b1c1c]/10 border-2 border-[#1b1c1c]/20" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-[#1b1c1c]/15 rounded" />
                  <div className="h-3 w-40 bg-[#1b1c1c]/10 rounded" />
                </div>
              </div>
              <div className="h-10 w-28 bg-[#1b1c1c]/15 rounded" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
              <div className="h-12 bg-[#1b1c1c]/10 rounded" />
              <div className="h-12 bg-[#1b1c1c]/10 rounded" />
              <div className="h-12 bg-[#1b1c1c]/10 rounded" />
              <div className="h-12 bg-[#1b1c1c]/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }
);
HistoryLoadingSkeleton.displayName = "HistoryLoadingSkeleton";

interface HistoryErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const HistoryErrorState: React.FC<HistoryErrorStateProps> = React.memo(
  ({ message = "Failed to synchronize combat log files from central archive.", onRetry }) => {
    return (
      <div className="bg-[#FFF4D6] border-4 border-[#b61929] p-8 text-center shadow-[6px_6px_0px_#1b1c1c] max-w-xl mx-auto my-8">
        <div className="w-14 h-14 bg-[#b61929] text-white flex items-center justify-center mx-auto mb-4 border-2 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-[#1b1c1c] uppercase font-serif tracking-tight">
          ARCHIVE RETRIEVAL MALFUNCTION
        </h3>
        <p className="text-sm font-bold text-gray-700 mt-2 max-w-md mx-auto">
          {message}
        </p>
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-[#1b1c1c] text-[#ffd875] hover:bg-[#b61929] hover:text-white font-black text-xs uppercase tracking-wider border-2 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Reconnect Archive
        </button>
      </div>
    );
  }
);
HistoryErrorState.displayName = "HistoryErrorState";

interface HistoryEmptyStateProps {
  onPlayClick: () => void;
}

export const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = React.memo(
  ({ onPlayClick }) => {
    return (
      <div className="bg-[#FFF4D6] border-4 border-dashed border-[#1b1c1c]/40 p-10 sm:p-14 text-center my-6 shadow-[5px_5px_0px_#1b1c1c]/15">
        <div className="w-16 h-16 bg-[#ffd875] text-[#1b1c1c] flex items-center justify-center mx-auto mb-4 border-3 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c]">
          <Swords className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-[#1b1c1c] uppercase font-serif tracking-tight">
          NO COMBAT LOGS RECORDED YET
        </h3>
        <p className="text-sm font-bold text-gray-600 max-w-md mx-auto mt-2 leading-relaxed">
          Your slice book is completely pristine. Step up to the slicing dojo, carve your first melons, and stamp your permanent ledger!
        </p>
        <button
          onClick={onPlayClick}
          className="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-[#b61929] text-white font-black text-sm uppercase tracking-wider border-3 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#1b1c1c] transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          Enter The Arena
        </button>
      </div>
    );
  }
);
HistoryEmptyState.displayName = "HistoryEmptyState";
