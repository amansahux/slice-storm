import React, { memo } from "react";
import { MainMenuButton } from "./MainMenuButton";

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = memo(({
  onResume,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div className="absolute z-20 inset-0 flex items-center justify-center p-4 bg-[#1b1c1c]/50 backdrop-blur-[2px] animate-fadeIn overflow-y-auto">
      <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl p-6 sm:p-8 max-w-sm w-full shadow-[8px_8px_0px_#1b1c1c] transform rotate-1 text-center outline outline-4 outline-white my-auto">
        <div className="bg-[#fe893c] text-[#672c00] border-2 border-[#1b1c1c] py-1 px-4 rounded-md inline-block mb-3 uppercase font-['Rubik',sans-serif] text-xs font-black tracking-wider shadow-[2px_2px_0px_#1b1c1c]">
          GAME PAUSED
        </div>
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-black text-[#1b1c1c] uppercase mb-6">
          BREATH OF THE BLADE
        </h2>
        <div className="space-y-3">
          <button
            type="button"
            onClick={onResume}
            className="cursor-pointer w-full bg-[#b61929] hover:bg-[#930019] text-white border-3 border-[#1b1c1c] py-3 rounded-lg shadow-[4px_4px_0px_#1b1c1c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-['Bricolage_Grotesque',sans-serif] uppercase font-bold text-base transition-all"
          >
            RESUME SLICE
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="cursor-pointer w-full bg-[#FFD84D] hover:bg-[#ffe07e] text-[#1b1c1c] border-3 border-[#1b1c1c] py-3 rounded-lg shadow-[4px_4px_0px_#1b1c1c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-['Bricolage_Grotesque',sans-serif] uppercase font-bold text-base transition-all"
          >
            RESTART MATCH
          </button>
          <MainMenuButton onClick={onMainMenu} />
        </div>
      </div>
    </div>
  );
});

PauseOverlay.displayName = "PauseOverlay";
