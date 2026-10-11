import React, { memo } from "react";
import type { GameMode } from "../../config/game.types";

interface GameHudProps {
  score: number;
  combo: number;
  lives: number;
  maxLives: number;
  timeRemainingText: string;
  gameMode: GameMode;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const GameHud: React.FC<GameHudProps> = memo(({
  score,
  combo,
  lives,
  maxLives,
  timeRemainingText,
  gameMode,
  isPaused,
  onTogglePause,
}) => {
  return (
    <div
      className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 z-30 pointer-events-none select-none transition-all"
      id="gameHudContainer"
    >
      <div className="flex flex-row justify-between items-center gap-2 sm:gap-4">
        {/* 1. TOP-LEFT SCORE BOX */}
        <div className="pointer-events-auto bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 shadow-[4px_4px_0px_#1b1c1c] flex items-center gap-2 transform -rotate-1">
          <div className="bg-[#b61929] text-white w-8 h-8 rounded border-2 border-[#1b1c1c] flex items-center justify-center font-['Titan_One','Bricolage_Grotesque',sans-serif] text-xs font-bold shadow-[1px_1px_0px_#1b1c1c]">
            ★
          </div>
          <div>
            <div className="text-[10px] font-['Rubik',sans-serif] text-[#5b403f] uppercase font-extrabold tracking-wider">
              POINTS
            </div>
            <div className="text-xl sm:text-2xl font-black font-['Bricolage_Grotesque',sans-serif] text-[#b61929] tracking-tight leading-none">
              {String(score).padStart(4, "0")}
            </div>
          </div>
        </div>

        {/* 2. CENTER MULTIPLIER / FRENZY CHIP + CLOCK */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div
            className={`bg-[#ffe07e] text-[#231b00] border-2 border-[#1b1c1c] px-3 py-1 sm:px-5 sm:py-1.5 rounded-full shadow-[4px_4px_0px_#1b1c1c] text-center transform transition-transform duration-100 ${
              combo >= 3 ? "scale-105 bg-[#fe893c] text-white" : "scale-100"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-[16px] text-[#b61929]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="text-xs sm:text-sm font-black font-['Rubik',sans-serif] tracking-wide uppercase">
                COMBO ×{Math.max(1, combo)}
              </span>
            </div>
          </div>

          {/* Blitz / Mode indicator & In-Game Clock */}
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-['Rubik',sans-serif] bg-white/95 px-2.5 py-0.5 rounded border border-[#1b1c1c] font-extrabold uppercase text-[#9a4600] shadow-[2px_2px_0px_#1b1c1c]">
            <span className="material-symbols-outlined text-[13px] text-[#9a4600]">
              timer
            </span>
            <span>{timeRemainingText}</span>
            <span className="text-[#5b403f] font-normal">|</span>
            <span>
              {gameMode === "classic" ? "SURVIVAL MODE" : "BLITZ 60s FRENZY"}
            </span>
          </div>
        </div>

        {/* 3. TOP-RIGHT CLUSTER: LIVES + TACTILE ARCADE PAUSE BUTTON */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Hearts / Lives Indicator */}
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-lg px-2.5 py-1.5 sm:px-3.5 sm:py-2 shadow-[4px_4px_0px_#1b1c1c] flex items-center gap-1.5 transform rotate-1">
            <div className="text-[10px] font-['Rubik',sans-serif] text-[#5b403f] mr-1 hidden sm:block uppercase font-extrabold">
              LIVES
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: maxLives }).map((_, idx) => {
                const isAlive = idx < lives;
                return (
                  <span
                    key={idx}
                    className={`material-symbols-outlined text-[20px] sm:text-[24px] transition-all ${
                      isAlive
                        ? "text-[#b61929] scale-100"
                        : "text-gray-400 opacity-20 grayscale scale-90"
                    }`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                );
              })}
            </div>
          </div>

          {/* HUD Tactile Arcade Pause Button */}
          <button
            type="button"
            onClick={onTogglePause}
            className="cursor-pointer bg-[#fe893c] text-[#672c00] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5 font-['Bricolage_Grotesque',sans-serif] uppercase text-xs sm:text-sm font-black transition-all"
            title="Pause Gameplay"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
              {isPaused ? "play_arrow" : "pause"}
            </span>
            <span className="font-['Rubik',sans-serif] font-black tracking-wider hidden sm:inline">
              {isPaused ? "RESUME" : "PAUSE"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});

GameHud.displayName = "GameHud";
