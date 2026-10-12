import React, { memo } from "react";

interface MainMenuButtonProps {
  onClick: () => void;
  className?: string;
}

export const MainMenuButton: React.FC<MainMenuButtonProps> = memo(({
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer w-full bg-[#eae7e7] hover:bg-[#e4e2e1] text-[#1b1c1c] border-3 border-[#1b1c1c] py-2.5 rounded-lg shadow-[3px_3px_0px_#1b1c1c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-['Rubik',sans-serif] text-sm uppercase font-bold transition-all ${className}`}
    >
      MAIN MENU
    </button>
  );
});

MainMenuButton.displayName = "MainMenuButton";
