import React, { memo } from "react";
import { MainMenuButton } from "./MainMenuButton";

interface GameOverOverlayProps {
  score: number;
  fruitsSliced: number;
  maxCombo: number;
  onPlayAgain: () => void;

  onMainMenu: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = memo(({
  score,
  fruitsSliced,
  maxCombo,
  onPlayAgain,

  onMainMenu,
}) => {
  return (
    <div className="absolute z-20 inset-0 flex items-center justify-center p-3 sm:p-4 bg-[#1b1c1c]/65 backdrop-blur-[2px] animate-fadeIn overflow-y-auto">
      <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl p-5 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_#1b1c1c] transform -rotate-1 relative outline outline-4 outline-white text-center my-auto">
        {/* Header Ribbon with Logo Asset */}
        <div className="w-full flex justify-center -mt-10 sm:-mt-14 mb-2">
          <img
            src="/logo.png"
            alt="SLICE STORM Logo"
            className="w-44 sm:w-56 object-contain drop-shadow-[0_4px_0_#1b1c1c] hover:scale-105 transition-transform"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://lh3.googleusercontent.com/aida/AEtjO1W_Ds8rOEhWI7qhd71xYfwcBqc58O_C8-io-tJ77q7XXevtydGqBT9qB3zKMTi_Jv7GNRKqG6jd4pyoWWs7PIVeUlM6_xruRO0VYLHFGVQwcWXUGNxL2Om3tiDwzntF9-oC2K0rQ5YnxyzHRyBUg8g48Vo3cdtjLQ-8iQqsS_8veMqa388NNoCVRuq2LaiNvLiXRceJLc32O4V01TNG4b9nCVqf5ffB3ie4rSZND4cZnrT9R2nllE_hoyg";
            }}
          />
        </div>

        <div className="bg-[#b61929] text-white border-2 border-[#1b1c1c] py-1 px-4 rounded-md inline-block uppercase font-['Rubik',sans-serif] text-xs font-black mb-2 animate-bounce shadow-[2px_2px_0px_#1b1c1c]">
          RUN TERMINATED
        </div>
        <h2 className="font-['Titan_One','Bricolage_Grotesque',sans-serif] text-3xl sm:text-4xl text-[#b61929] uppercase tracking-tight mb-4 drop-shadow-[1px_1px_0_#1b1c1c]">
          GAME OVER!
        </h2>

        {/* Score & Stats Card */}
        <div className="bg-white border-3 border-[#1b1c1c] p-4 rounded-lg shadow-[4px_4px_0px_#1b1c1c] mb-6 text-left space-y-2 border-2">
          <div className="flex justify-between items-center pb-2 border-b-2 border-[#1b1c1c]/20">
            <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#5b403f] uppercase">
              TOTAL SCORE:
            </span>
            <span className="font-['Bricolage_Grotesque',sans-serif] text-2xl font-black text-[#b61929]">
              {score}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b-2 border-[#1b1c1c]/20">
            <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#5b403f] uppercase">
              FRUITS SLICED:
            </span>
            <span className="font-['Rubik',sans-serif] text-lg font-extrabold text-[#1b1c1c]">
              {fruitsSliced}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#5b403f] uppercase">
              MAX COMBO:
            </span>
            <span className="font-['Rubik',sans-serif] text-lg font-extrabold text-[#9a4600]">
              ×{maxCombo}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="cursor-pointer w-full bg-[#d9363e] hover:bg-[#b61929] text-white border-3 border-[#1b1c1c] py-3.5 rounded-lg shadow-[6px_6px_0px_#1b1c1c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-['Bricolage_Grotesque',sans-serif] text-xl uppercase font-black transition-all"
          >
            PLAY AGAIN
          </button>

          <MainMenuButton onClick={onMainMenu} />
        </div>
      </div>
    </div>
  );
});

GameOverOverlay.displayName = "GameOverOverlay";
