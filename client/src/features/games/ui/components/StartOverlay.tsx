import React, { memo } from "react";
import { Play } from "lucide-react";
import type { GameMode, BladeTheme } from "../../config/game.types";
import { BLADE_THEMES } from "../../config/game.constants";

interface StartOverlayProps {
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  selectedBlade: BladeTheme;
  onSelectBlade: (blade: BladeTheme) => void;
  onStartGame: () => void;
}

export const StartOverlay: React.FC<StartOverlayProps> = memo(({
  gameMode,
  onSelectGameMode,
  selectedBlade,
  onSelectBlade,
  onStartGame,
}) => {
  return (
    <div className="absolute z-20 inset-0 flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl p-5 sm:p-8 max-w-lg w-full shadow-[8px_8px_0px_#1b1c1c] transform -rotate-1 relative outline outline-4 outline-white my-auto">
        {/* Header Ribbon with Logo Asset */}
        <div className="w-full flex justify-center -mt-10 sm:-mt-14 mb-2 sm:mb-3">
          <img
            src="/logo.png"
            alt="SLICE STORM Logo"
            className="w-52 sm:w-80 object-contain drop-shadow-[0_4px_0_#1b1c1c] animate-bounce hover:scale-105 transition-transform"
            onError={(e) => {
              // Fallback to Stitch image if local logo is missing
              (e.currentTarget as HTMLImageElement).src =
                "https://lh3.googleusercontent.com/aida/AEtjO1W_Ds8rOEhWI7qhd71xYfwcBqc58O_C8-io-tJ77q7XXevtydGqBT9qB3zKMTi_Jv7GNRKqG6jd4pyoWWs7PIVeUlM6_xruRO0VYLHFGVQwcWXUGNxL2Om3tiDwzntF9-oC2K0rQ5YnxyzHRyBUg8g48Vo3cdtjLQ-8iQqsS_8veMqa388NNoCVRuq2LaiNvLiXRceJLc32O4V01TNG4b9nCVqf5ffB3ie4rSZND4cZnrT9R2nllE_hoyg";
            }}
          />
        </div>

        <div className="text-center space-y-1 mb-4 sm:mb-5">
          <p className="font-['Rubik',sans-serif] text-sm sm:text-lg text-[#b61929] uppercase font-extrabold tracking-wider">
            SLICE • COMBO • SURVIVE
          </p>
          <p className="font-['Rubik',sans-serif] text-xs sm:text-sm text-[#5b403f] max-w-xs mx-auto">
            Swipe fast across ripe fruits to build mega combos. Dodge spiky bombs at all costs!
          </p>
        </div>

        {/* Mode Selectors */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
          <button
            type="button"
            onClick={() => onSelectGameMode("classic")}
            className={`cursor-pointer p-2.5 sm:p-3 rounded-lg border-3 border-[#1b1c1c] flex flex-col items-center transition-all ${
              gameMode === "classic"
                ? "bg-[#ffe07e] text-[#231b00] shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-white text-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] opacity-85 hover:opacity-100"
            }`}
          >
            <span className="font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase">
              CLASSIC
            </span>
            <span className="text-[10px] sm:text-[11px] font-['Rubik',sans-serif] font-bold opacity-80">
              3 Hearts • Endless
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectGameMode("arcade")}
            className={`cursor-pointer p-2.5 sm:p-3 rounded-lg border-3 border-[#1b1c1c] flex flex-col items-center transition-all ${
              gameMode === "arcade"
                ? "bg-[#ffe07e] text-[#231b00] shadow-[4px_4px_0px_#1b1c1c] -translate-y-0.5"
                : "bg-white text-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] opacity-85 hover:opacity-100"
            }`}
          >
            <span className="font-['Rubik',sans-serif] text-xs sm:text-sm font-black uppercase">
              ARCADE 60s
            </span>
            <span className="text-[10px] sm:text-[11px] font-['Rubik',sans-serif] font-bold opacity-80">
              Frenzy Timer • No Drop Loss
            </span>
          </button>
        </div>

        {/* Blade Style Selector Mini Ribbon */}
        <div className="bg-white border-2 border-[#1b1c1c] p-2 sm:p-2.5 rounded-lg flex items-center justify-between mb-4 sm:mb-5 shadow-[2px_2px_0px_#1b1c1c]">
          <span className="font-['Rubik',sans-serif] text-[11px] sm:text-xs font-black uppercase text-[#1b1c1c] pl-1">
            Blade Trail:
          </span>
          <div className="flex gap-2">
            {BLADE_THEMES.map((theme) => {
              const isSelected = selectedBlade.name === theme.name;
              return (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => onSelectBlade(theme)}
                  style={{ backgroundColor: theme.primary }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#1b1c1c] transition-transform ${
                    isSelected
                      ? "scale-125 ring-2 ring-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c]"
                      : "hover:scale-110 shadow-sm"
                  }`}
                  title={theme.name}
                />
              );
            })}
          </div>
        </div>

        {/* SLAM ACTION BUTTON */}
        <button
          type="button"
          onClick={onStartGame}
          className="cursor-pointer w-full bg-[#d9363e] hover:bg-[#b61929] text-white border-4 border-[#1b1c1c] py-3 sm:py-3.5 rounded-lg shadow-[6px_6px_0px_#1b1c1c] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none flex items-center justify-center gap-2 transition-all group"
        >
          <Play className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] fill-white group-hover:scale-110 transition-transform" />
          <span className="font-['Bricolage_Grotesque',sans-serif] text-lg sm:text-2xl font-black uppercase tracking-tight text-white">
            INSERT COIN &amp; SLICE
          </span>
        </button>

        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-3 text-[10px] sm:text-xs font-['Rubik',sans-serif] text-[#5b403f] font-bold">
          <span>MOUSE SWIPE OR TOUCH DRAG</span>
          <span>•</span>
          <span>60 FPS ARCADE ENGINE</span>
        </div>
      </div>
    </div>
  );
});

StartOverlay.displayName = "StartOverlay";
