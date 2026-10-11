import React, { memo } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  isSoundEnabled,
  toggleSound,
  playArcadeSound,
} from "../utils/arcadeAudio";

interface NavbarProps {
  onPlayClick?: () => void;
  soundOn?: boolean;
  onSoundToggle?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenStore?: () => void;
  onOpenHowToPlay?: () => void;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

export const Navbar: React.FC<NavbarProps> = memo(({
  onPlayClick,
  soundOn: propSoundOn,
  onSoundToggle,
  onOpenLeaderboard,
  onOpenStore,
  onOpenHowToPlay,
  activeNav = "ARCADE",
  onNavClick,
}) => {
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [internalSound, setInternalSound] = React.useState(isSoundEnabled());

  const currentSoundOn = propSoundOn !== undefined ? propSoundOn : internalSound;

  const handleSoundClick = () => {
    if (onSoundToggle) {
      onSoundToggle();
    } else {
      const next = toggleSound();
      setInternalSound(next);
    }
  };

  const handleNav = (item: string) => {
    playArcadeSound("blip");
    if (onNavClick) {
      onNavClick(item);
    } else {
      if (item === "ARCADE") navigate("/arcade");
      else if (item === "LEADERBOARDS" && onOpenLeaderboard) onOpenLeaderboard();
      else if (item === "STORE" && onOpenStore) onOpenStore();
      else if (item === "HOW TO PLAY" && onOpenHowToPlay) onOpenHowToPlay();
    }
  };

  const playerName = authUser?.name ? authUser.name.toUpperCase() : "PLAYER #01";
  const userInitial = authUser?.name ? authUser.name.charAt(0).toUpperCase() : "S";

  return (
    <header className="w-full z-40 bg-white border-b-4 border-[#1b1c1c] shadow-[0_4px_0_0_#1b1c1c] transition-all select-none">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-2.5 max-w-7xl mx-auto gap-2">
        {/* Brand & Mode Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-['Titan_One','Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black tracking-tight text-[#b61929] uppercase group-hover:-translate-y-0.5 transition-transform drop-shadow-[1px_1px_0_#1b1c1c]">
              SLICE STORM
            </span>
            <span className="inline-flex items-center bg-[#ffe07e] text-[#231b00] text-[10px] font-extrabold px-2 py-0.5 rounded border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] uppercase tracking-wide">
              ARCADE EDITION (v4.2)
            </span>
          </Link>
        </div>

        {/* Navigation Links Cluster */}
        <nav className="hidden md:flex items-center gap-6 font-['Rubik',sans-serif]">
          <button
            type="button"
            onClick={() => handleNav("ARCADE")}
            className={`font-black text-sm tracking-wider uppercase transition-all pb-1 ${
              activeNav === "ARCADE"
                ? "text-[#b61929] border-b-4 border-[#b61929]"
                : "text-[#1b1c1c] hover:text-[#b61929]"
            }`}
          >
            ARCADE
          </button>
          <button
            type="button"
            onClick={() => handleNav("LEADERBOARDS")}
            className={`font-black text-sm tracking-wider uppercase transition-all pb-1 ${
              activeNav === "LEADERBOARDS"
                ? "text-[#b61929] border-b-4 border-[#b61929]"
                : "text-[#1b1c1c] hover:text-[#b61929]"
            }`}
          >
            LEADERBOARDS
          </button>
          <button
            type="button"
            onClick={() => handleNav("STORE")}
            className={`font-black text-sm tracking-wider uppercase transition-all pb-1 ${
              activeNav === "STORE"
                ? "text-[#b61929] border-b-4 border-[#b61929]"
                : "text-[#1b1c1c] hover:text-[#b61929]"
            }`}
          >
            STORE
          </button>
          <button
            type="button"
            onClick={() => handleNav("HOW TO PLAY")}
            className={`font-black text-sm tracking-wider uppercase transition-all pb-1 ${
              activeNav === "HOW TO PLAY"
                ? "text-[#b61929] border-b-4 border-[#b61929]"
                : "text-[#1b1c1c] hover:text-[#b61929]"
            }`}
          >
            HOW TO PLAY
          </button>
        </nav>

        {/* Trailing Controls: SFX + Authenticated Player Chip + PLAY NOW */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SFX Toggle Button */}
          <button
            type="button"
            onClick={handleSoundClick}
            className="cursor-pointer bg-[#eae7e7] text-[#1b1c1c] p-1.5 sm:px-3 sm:py-1.5 rounded border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] flex items-center gap-1.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
            title="Toggle Sound"
          >
            <span className="material-symbols-outlined text-[18px]">
              {currentSoundOn ? "volume_up" : "volume_off"}
            </span>
            <span className="hidden sm:inline font-['Rubik',sans-serif] text-xs font-black uppercase">
              {currentSoundOn ? "SFX: ON" : "SFX: OFF"}
            </span>
          </button>

          {/* Authenticated Player Chip */}
          <div className="flex items-center gap-1.5 bg-[#FFF4D6] border-2 border-[#1b1c1c] px-2.5 py-1 rounded shadow-[2px_2px_0px_#1b1c1c]">
            <div className="w-6 h-6 rounded-full bg-[#b61929] text-white border border-[#1b1c1c] flex items-center justify-center text-xs font-black">
              {userInitial}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black uppercase text-[#1b1c1c] tracking-wide font-['Rubik',sans-serif]">
                {playerName}
              </span>
              <span className="hidden lg:inline-block bg-[#ffe07e] text-[#231b00] text-[9px] font-black px-1 rounded border border-[#1b1c1c]">
                VIP
              </span>
            </div>
          </div>

          {/* Action Button */}
          {onPlayClick ? (
            <button
              type="button"
              onClick={onPlayClick}
              className="cursor-pointer bg-[#b61929] text-white px-3 sm:px-4 py-1.5 rounded border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] text-xs sm:text-sm font-['Rubik',sans-serif] flex items-center gap-1.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
            >
              <span className="text-[14px]">⚔️</span>
              <span className="font-black uppercase tracking-wide">PLAY NOW</span>
            </button>
          ) : (
            <Link
              to="/arcade"
              className="bg-[#b61929] text-white px-3 sm:px-4 py-1.5 rounded border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] text-xs sm:text-sm font-['Rubik',sans-serif] flex items-center gap-1.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-transform"
            >
              <span className="text-[14px]">⚔️</span>
              <span className="font-black uppercase tracking-wide">PLAY NOW</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;