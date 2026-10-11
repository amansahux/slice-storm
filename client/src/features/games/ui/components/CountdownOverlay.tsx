import React, { memo } from "react";

interface CountdownOverlayProps {
  countdownValue: number | string;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = memo(({
  countdownValue,
}) => {
  return (
    <div className="absolute z-50 inset-0 flex items-center justify-center pointer-events-none select-none animate-fadeIn">
      <div className="bg-[#FFD84D] border-4 border-[#1b1c1c] px-10 py-6 rounded-2xl shadow-[8px_8px_0px_#1b1c1c] text-center transform scale-100 transition-all duration-300">
        <span className="font-['Titan_One','Bricolage_Grotesque',sans-serif] text-5xl sm:text-7xl text-[#b61929] uppercase font-black drop-shadow-[2px_2px_0_#1b1c1c]">
          {countdownValue}
        </span>
      </div>
    </div>
  );
});

CountdownOverlay.displayName = "CountdownOverlay";
