import React, { memo } from "react";
import type { GameMode, GameState } from "../../config/game.types";

interface GameHudProps {
  score: number;
  combo: number;
  lives: number;
  maxLives: number;
  timeRemainingText: string;
  gameMode: GameMode;
  gameState: GameState;
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
  gameState,
  isPaused,
  onTogglePause,
}) => {
  // Pause button is only active & visible while in active gameplay or paused (before game over)
  const isPauseAvailable = gameState === "PLAYING" || gameState === "PAUSED";

  return (
    <div
      className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 pt-2 sm:pt-3 z-30 pointer-events-none select-none transition-all"
      id="gameHudContainer"
    >
      <div className="flex flex-row justify-between items-center gap-1.5 sm:gap-3 md:gap-4">
        {/* 1. TOP-LEFT SCORE BOX */}
        <div className="pointer-events-auto bg-[#FFF4D6] border-2 sm:border-4 border-[#1b1c1c] rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 shadow-[2px_2px_0px_#1b1c1c] sm:shadow-[4px_4px_0px_#1b1c1c] flex items-center gap-1.5 sm:gap-2 transform -rotate-1 shrink-0">
          <div className="bg-[#b61929] text-white w-6 h-6 sm:w-8 sm:h-8 rounded border sm:border-2 border-[#1b1c1c] flex items-center justify-center font-['Titan_One','Bricolage_Grotesque',sans-serif] text-[10px] sm:text-xs font-bold shadow-[1px_1px_0px_#1b1c1c]">
            ★
          </div>
          <div>
            <div className="text-[9px] sm:text-[10px] font-['Rubik',sans-serif] text-[#5b403f] uppercase font-extrabold tracking-wider leading-tight">
              PTS
            </div>
            <div className="text-base sm:text-xl md:text-2xl font-black font-['Bricolage_Grotesque',sans-serif] text-[#b61929] tracking-tight leading-none">
              {String(score).padStart(4, "0")}
            </div>
          </div>
        </div>

        {/* 2. CENTER MULTIPLIER / FRENZY CHIP + CLOCK */}
        <div className="pointer-events-auto flex flex-col items-center shrink-0 min-w-0">
          <div
            className={`bg-[#ffe07e] text-[#231b00] border sm:border-2 border-[#1b1c1c] px-2.5 py-0.5 sm:px-4 sm:py-1 md:px-5 md:py-1.5 rounded-full shadow-[2px_2px_0px_#1b1c1c] sm:shadow-[4px_4px_0px_#1b1c1c] text-center transform transition-transform duration-100 ${
              combo >= 3 ? "scale-105 bg-[#fe893c] text-white" : "scale-100"
            }`}
          >
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[14px] sm:text-[16px] text-[#b61929]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm font-black font-['Rubik',sans-serif] tracking-wide uppercase whitespace-nowrap">
                COMBO ×{Math.max(1, combo)}
              </span>
            </div>
          </div>

          {/* Blitz / Mode indicator & In-Game Clock */}
          <div className="mt-0.5 sm:mt-1 flex items-center gap-1 text-[9px] sm:text-[11px] font-['Rubik',sans-serif] bg-white/95 px-2 py-0.5 rounded border border-[#1b1c1c] font-extrabold uppercase text-[#9a4600] shadow-[1px_1px_0px_#1b1c1c] whitespace-nowrap">
            <span className="material-symbols-outlined text-[11px] sm:text-[13px] text-[#9a4600]">
              timer
            </span>
            <span>{timeRemainingText}</span>
            <span className="text-[#5b403f] font-normal hidden xs:inline">|</span>
            <span className="hidden xs:inline">
              {gameMode === "classic" ? "SURVIVAL" : "BLITZ 60s"}
            </span>
          </div>
        </div>

        {/* 3. TOP-RIGHT CLUSTER: LIVES + TACTILE ARCADE PAUSE BUTTON */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* Hearts / Lives Indicator */}
          <div className="bg-[#FFF4D6] border-2 sm:border-4 border-[#1b1c1c] rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 md:px-3.5 md:py-2 shadow-[2px_2px_0px_#1b1c1c] sm:shadow-[4px_4px_0px_#1b1c1c] flex items-center gap-1 transform rotate-1">
            <div className="text-[10px] font-['Rubik',sans-serif] text-[#5b403f] mr-0.5 hidden md:block uppercase font-extrabold">
              LIVES
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: maxLives }).map((_, idx) => {
                const isAlive = idx < lives;
                return (
                  <span
                    key={idx}
                    className={`material-symbols-outlined text-[16px] sm:text-[20px] md:text-[24px] transition-all ${
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

          {/* HUD Tactile Arcade Pause Button (Only enabled/visible during active game) */}
          {isPauseAvailable && (
            <button
              type="button"
              onClick={onTogglePause}
              className="cursor-pointer bg-[#fe893c] text-[#672c00] px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] sm:shadow-[4px_4px_0px_#1b1c1c] active:translate-x-[1px] active:translate-y-[1px] sm:active:translate-x-[2px] sm:active:translate-y-[2px] active:shadow-none flex items-center gap-1 font-['Bricolage_Grotesque',sans-serif] uppercase text-xs sm:text-sm font-black transition-all"
              title="Pause Gameplay"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] md:text-[20px]">
                {isPaused ? "play_arrow" : "pause"}
              </span>
              <span className="font-['Rubik',sans-serif] font-black tracking-wider hidden sm:inline text-xs">
                {isPaused ? "RESUME" : "PAUSE"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

GameHud.displayName = "GameHud";
