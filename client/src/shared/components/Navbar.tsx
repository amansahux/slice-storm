import React, { memo, useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  isSoundEnabled,
  toggleSound,
  playArcadeSound,
} from "../utils/arcadeAudio";
import Logo from "../../../public/logo.png";

interface NavbarProps {
  soundOn?: boolean;
  onSoundToggle?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenStore?: () => void;
  onOpenHowToPlay?: () => void;
  activeNav?: string;
  onNavClick?: (nav: string) => void;
}

interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: string;
}

const NAV_LINKS: readonly NavItemConfig[] = [
  { id: "ARCADE", label: "ARCADE", path: "/arcade", icon: "sports_esports" },
  { id: "DASHBOARD", label: "DASHBOARD", path: "/dashboard", icon: "dashboard" },
  { id: "LEADERBOARDS", label: "LEADERBOARDS", path: "/leaderboard", icon: "leaderboard" },
  { id: "HISTORY", label: "HISTORY", path: "/history", icon: "history" },
] as const;

export const Navbar: React.FC<NavbarProps> = memo(
  ({
    soundOn: propSoundOn,
    onSoundToggle,
    activeNav: propActiveNav,
    onNavClick,
  }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const authUser = useSelector((state: RootState) => state.auth.user);
    const [internalSound, setInternalSound] = useState(isSoundEnabled());
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const currentSoundOn =
      propSoundOn !== undefined ? propSoundOn : internalSound;

    // Derive active nav dynamically from current pathname if not explicitly passed
    const currentActiveNav = React.useMemo(() => {
      if (propActiveNav) return propActiveNav.toUpperCase();
      const currentPath = location.pathname.toLowerCase();
      if (currentPath === "/arcade") return "ARCADE";
      if (currentPath === "/dashboard") return "DASHBOARD";
      if (currentPath === "/leaderboard") return "LEADERBOARDS";
      if (currentPath === "/history") return "HISTORY";
      if (currentPath === "/profile") return "PROFILE";
      if (currentPath === "/setting") return "SETTING";
      return "";
    }, [propActiveNav, location.pathname]);

    const handleSoundClick = useCallback(() => {
      if (onSoundToggle) {
        onSoundToggle();
      } else {
        const next = toggleSound();
        setInternalSound(next);
      }
    }, [onSoundToggle]);

    const handleNav = useCallback(
      (link: NavItemConfig) => {
        playArcadeSound("blip");
        setIsMobileMenuOpen(false);
        if (onNavClick) {
          onNavClick(link.id);
        } else {
          navigate(link.path);
        }
      },
      [navigate, onNavClick]
    );

    const toggleMobileMenu = useCallback(() => {
      playArcadeSound("click");
      setIsMobileMenuOpen((prev) => !prev);
    }, []);

    // Prevent body scroll when mobile menu is open (Rule 03: clean up properly)
    useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isMobileMenuOpen]);

    const playerName = authUser?.name
      ? authUser.name.toUpperCase()
      : "PLAYER #01";
    const userInitial = authUser?.name
      ? authUser.name.charAt(0).toUpperCase()
      : "S";

    return (
      <header className="relative w-full z-50 bg-white border-b-4 border-[#1b1c1c] shadow-[0_4px_0_0_#1b1c1c] transition-all select-none">
        <div className="flex justify-between items-center w-full px-3 sm:px-6 py-2.5 max-w-7xl mx-auto gap-2">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => {
              playArcadeSound("blip");
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center active:scale-95 transition-transform"
          >
            <img
              src={Logo}
              alt="SLICE STORM Logo"
              className="w-36 sm:w-44 md:w-52 h-auto object-contain drop-shadow-[2px_2px_0_#1b1c1c]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 font-['Rubik',sans-serif]">
            {NAV_LINKS.map((link) => {
              const isActive = currentActiveNav === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNav(link)}
                  className={`cursor-pointer font-black text-sm tracking-wider uppercase transition-all pb-1 active:translate-y-[1px] ${
                    isActive
                      ? "text-[#b61929] border-b-4 border-[#b61929] drop-shadow-[0_1px_0_#1b1c1c]"
                      : "text-[#1b1c1c] hover:text-[#b61929]"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Trailing Controls & Crazy Arcade Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SFX Toggle Button */}
            <button
              type="button"
              onClick={handleSoundClick}
              className="cursor-pointer bg-[#eae7e7] hover:bg-[#e4e2e1] text-[#1b1c1c] p-1.5 sm:px-3 sm:py-1.5 rounded-lg border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] flex items-center gap-1.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              title="Toggle Sound"
            >
              <span className="material-symbols-outlined text-[18px]">
                {currentSoundOn ? "volume_up" : "volume_off"}
              </span>
              <span className="hidden sm:inline font-['Rubik',sans-serif] text-xs font-black uppercase">
                {currentSoundOn ? "SFX: ON" : "SFX: OFF"}
              </span>
            </button>

            {/* Authenticated Player Chip / Profile Link */}
            <Link
              to="/profile"
              onClick={() => playArcadeSound("blip")}
              className={`flex items-center gap-1.5 border-2 border-[#1b1c1c] px-2 sm:px-2.5 py-1 rounded-lg shadow-[2px_2px_0px_#1b1c1c] active:translate-x-[1px] active:translate-y-[1px] transition-all ${
                currentActiveNav === "PROFILE"
                  ? "bg-[#ffe07e] ring-2 ring-[#b61929]"
                  : "bg-[#FFF4D6] hover:bg-[#ffeec2]"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-[#b61929] text-white border border-[#1b1c1c] flex items-center justify-center text-xs font-black">
                {userInitial}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs font-black uppercase text-[#1b1c1c] tracking-wide font-['Rubik',sans-serif] max-w-[80px] sm:max-w-none truncate">
                  {playerName}
                </span>
                <span className="hidden md:inline-block bg-[#ffe07e] text-[#231b00] text-[9px] font-black px-1 rounded border border-[#1b1c1c]">
                  VIP
                </span>
              </div>
            </Link>

            {/* Crazy Neo-Brutalist Arcade Hamburger with Perfect Center Cross */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMobileMenuOpen}
              className={`lg:hidden cursor-pointer relative w-11 h-11 rounded-lg border-3 border-[#1b1c1c] flex items-center justify-center p-0 transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                isMobileMenuOpen
                  ? "bg-[#d9363e] shadow-[2px_2px_0px_#1b1c1c]"
                  : "bg-[#ffe07e] hover:bg-[#ffd84d] shadow-[3px_3px_0px_#1b1c1c]"
              }`}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between items-center pointer-events-none">
                {/* Top Katana Line */}
                <span
                  className={`block h-[3.5px] w-6 bg-[#1b1c1c] rounded-full transition-all duration-200 origin-center ${
                    isMobileMenuOpen
                      ? "absolute top-1/2 -translate-y-1/2 rotate-45"
                      : ""
                  }`}
                />
                {/* Middle Katana Line */}
                <span
                  className={`block h-[3.5px] w-6 bg-[#1b1c1c] rounded-full transition-all duration-150 origin-center ${
                    isMobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                {/* Bottom Katana Line */}
                <span
                  className={`block h-[3.5px] w-6 bg-[#1b1c1c] rounded-full transition-all duration-200 origin-center ${
                    isMobileMenuOpen
                      ? "absolute top-1/2 -translate-y-1/2 -rotate-45"
                      : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CRAZY RETRO ARCADE MOBILE SLIDEOUT / POP-DOWN DRAWER         */}
        {/* ============================================================ */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 z-50 flex flex-col animate-fadeIn">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[#1b1c1c]/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Container */}
            <div className="relative w-full bg-[#FFF4D6] border-b-4 border-[#1b1c1c] shadow-[0_8px_0_0_#1b1c1c] p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-80px)] paper-pattern">
              {/* Badge Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#1b1c1c]/20">
                <span className="inline-flex items-center bg-[#ffe07e] text-[#231b00] text-xs font-black px-2.5 py-1 rounded border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] uppercase tracking-wider">
                  🕹️ ARCADE STATIONS
                </span>
                <span className="font-['Rubik',sans-serif] text-[11px] font-bold text-[#5b403f] uppercase">
                  ACTIVE: {currentActiveNav || "NONE"}
                </span>
              </div>

              {/* Menu Nav Links with Neo-Brutalist Buttons */}
              <div className="flex flex-col gap-2.5">
                {NAV_LINKS.map((link, idx) => {
                  const isActive = currentActiveNav === link.id;
                  return (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => handleNav(link)}
                      className={`cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-xl border-3 border-[#1b1c1c] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-['Rubik',sans-serif] ${
                        isActive
                          ? "bg-[#b61929] text-white shadow-[4px_4px_0px_#1b1c1c] scale-[1.01]"
                          : "bg-white text-[#1b1c1c] hover:bg-[#fff9e6] shadow-[3px_3px_0px_#1b1c1c]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`material-symbols-outlined text-[22px] ${
                            isActive ? "text-white" : "text-[#b61929]"
                          }`}
                        >
                          {link.icon}
                        </span>
                        <span className="text-base font-black uppercase tracking-wide">
                          {link.label}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded border border-[#1b1c1c] ${
                          isActive
                            ? "bg-[#ffe07e] text-[#231b00]"
                            : "bg-[#eae7e7] text-[#5b403f]"
                        }`}
                      >
                        0{idx + 1}
                      </span>
                    </button>
                  );
                })}

                {/* Additional Settings link in mobile menu */}
                <button
                  type="button"
                  onClick={() => {
                    playArcadeSound("blip");
                    setIsMobileMenuOpen(false);
                    navigate("/setting");
                  }}
                  className={`cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-xl border-3 border-[#1b1c1c] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-['Rubik',sans-serif] ${
                    currentActiveNav === "SETTING"
                      ? "bg-[#b61929] text-white shadow-[4px_4px_0px_#1b1c1c]"
                      : "bg-white text-[#1b1c1c] hover:bg-[#fff9e6] shadow-[3px_3px_0px_#1b1c1c]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-[22px] ${
                        currentActiveNav === "SETTING" ? "text-white" : "text-[#b61929]"
                      }`}
                    >
                      settings
                    </span>
                    <span className="text-base font-black uppercase tracking-wide">
                      SETTINGS
                    </span>
                  </div>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded border border-[#1b1c1c] bg-[#eae7e7] text-[#5b403f]">
                    05
                  </span>
                </button>
              </div>

              {/* Mobile Quick Action Footer */}
              <div className="mt-5 pt-3 border-t-2 border-[#1b1c1c]/20 flex flex-col gap-2.5">
                <Link
                  to="/arcade"
                  onClick={() => {
                    playArcadeSound("blip");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#d9363e] hover:bg-[#b61929] text-white border-3 border-[#1b1c1c] py-3 rounded-xl shadow-[4px_4px_0px_#1b1c1c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-['Bricolage_Grotesque',sans-serif] text-lg font-black uppercase tracking-wider text-center flex items-center justify-center gap-2"
                >
                  <span>⚔️</span>
                  <span>ENTER THE ARENA</span>
                </Link>

                <div className="flex items-center justify-between text-[11px] font-['Rubik',sans-serif] font-bold text-[#5b403f] px-1">
                  <span>AUDIO SYNTH: {currentSoundOn ? "ACTIVE" : "MUTED"}</span>
                  <span>v4.2 PRO</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    );
  }
);

Navbar.displayName = "Navbar";
export default Navbar;
