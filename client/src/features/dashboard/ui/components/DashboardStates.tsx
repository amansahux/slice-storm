import React from "react";
import { AlertCircle, RefreshCw, Swords } from "lucide-react";
import { playArcadeSound } from "../../../../shared/utils/arcadeAudio";

export const DashboardLoadingSkeleton: React.FC = React.memo(() => {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* Hero Marquee Skeleton */}
      <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] shadow-[6px_6px_0px_#1b1c1c] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="space-y-4 max-w-2xl w-full">
            <div className="flex gap-2">
              <div className="h-6 w-36 bg-[#1b1c1c]/15 rounded" />
              <div className="h-6 w-28 bg-[#1b1c1c]/15 rounded" />
            </div>
            <div className="h-10 sm:h-12 w-3/4 bg-[#1b1c1c]/20 rounded" />
            <div className="h-6 w-5/6 bg-[#1b1c1c]/10 rounded" />
            <div className="h-5 w-64 bg-[#1b1c1c]/15 rounded" />
          </div>
          <div className="flex flex-col gap-3 min-w-[240px]">
            <div className="h-12 bg-[#1b1c1c]/20 rounded border-2 border-[#1b1c1c]" />
            <div className="h-12 bg-[#1b1c1c]/15 rounded border-2 border-[#1b1c1c]" />
          </div>
        </div>
      </div>

      {/* 4 Scoreboard Tickets Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-[#FFF4D6] border-4 border-[#1b1c1c] shadow-[5px_5px_0_0_#1b1c1c] p-4 flex flex-col justify-between h-48"
          >
            <div className="flex justify-between items-center pb-2 border-b-2 border-dashed border-[#1b1c1c]/30">
              <div className="h-4 w-24 bg-[#1b1c1c]/15 rounded" />
              <div className="h-4 w-12 bg-[#1b1c1c]/15 rounded" />
            </div>
            <div className="space-y-2 my-2">
              <div className="h-3 w-20 bg-[#1b1c1c]/10 rounded" />
              <div className="h-10 w-28 bg-[#1b1c1c]/20 rounded" />
            </div>
            <div className="h-6 bg-[#1b1c1c]/10 rounded" />
          </div>
        ))}
      </div>

      {/* Dual Column Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="h-8 w-48 bg-[#1b1c1c]/15 rounded" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border-4 border-[#1b1c1c] shadow-[5px_5px_0_0_#1b1c1c] p-4 h-36"
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-8 w-48 bg-[#1b1c1c]/15 rounded" />
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] shadow-[6px_6px_0_0_#1b1c1c] p-5 h-80" />
        </div>
      </div>
    </div>
  );
});
DashboardLoadingSkeleton.displayName = "DashboardLoadingSkeleton";

interface DashboardErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = React.memo(
  ({ message = "Failed to load arcade dashboard data from cabinet.", onRetry }) => {
    return (
      <div className="bg-[#FFF4D6] border-4 border-[#b61929] p-8 text-center shadow-[6px_6px_0px_#1b1c1c] max-w-xl mx-auto my-12">
        <div className="w-16 h-16 bg-[#b61929] text-white flex items-center justify-center mx-auto mb-4 border-3 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c]">
          <AlertCircle className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-black text-[#1b1c1c] uppercase font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          CABINET TELEMETRY ERROR
        </h3>
        <p className="text-sm font-bold text-gray-700 mt-2 max-w-md mx-auto leading-relaxed">
          {message}
        </p>
        <button
          onClick={() => {
            playArcadeSound("click");
            onRetry();
          }}
          className="mt-6 inline-flex items-center gap-2 bg-[#b61929] text-white border-3 border-[#1b1c1c] px-6 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          RETRY CABINET LINK
        </button>
      </div>
    );
  }
);
DashboardErrorState.displayName = "DashboardErrorState";

interface DashboardEmptyStateProps {
  onPlayNow: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = React.memo(
  ({ onPlayNow }) => {
    return (
      <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] p-8 sm:p-12 text-center shadow-[6px_6px_0px_#1b1c1c] max-w-xl mx-auto my-12 relative overflow-hidden">
        <div className="w-16 h-16 bg-[#fe893c] text-white flex items-center justify-center mx-auto mb-4 border-3 border-[#1b1c1c] shadow-[3px_3px_0px_#1b1c1c]">
          <Swords className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-black text-[#1b1c1c] uppercase font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          NO COMBAT LOGS DETECTED
        </h3>
        <p className="text-sm font-bold text-[#5b403f] mt-2 max-w-md mx-auto leading-relaxed">
          Your blade is fresh from the forge. Step into the arcade arena, slash your first fruit, and claim your place on the cabinet marquee!
        </p>
        <button
          onClick={() => {
            playArcadeSound("slash");
            onPlayNow();
          }}
          className="mt-6 inline-flex items-center gap-2 bg-[#d9363e] text-white border-3 border-[#1b1c1c] px-6 py-3 font-black uppercase text-sm shadow-[4px_4px_0px_#1b1c1c] hover:-translate-y-0.5 active:translate-y-1 transition-all cursor-pointer"
        >
          <Swords className="w-4 h-4" />
          INSERT COIN & PLAY NOW
        </button>
      </div>
    );
  }
);
DashboardEmptyState.displayName = "DashboardEmptyState";
