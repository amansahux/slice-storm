import React, { memo, useState, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  isSoundEnabled,
  toggleSound,
  playArcadeSound,
} from "../utils/arcadeAudio";
import {
  Volume2,
  VolumeX,
  Gamepad2,
  HeartCrack,
  X,
  Swords,
  Scroll,
  Trophy,
  History,
  Home,
  Hand,
  Flag,
} from "lucide-react";
import Logo from "/logo.png";

type Props = {
  customMessage?: string;
};

const Errorpage: React.FC<Props> = memo(({ customMessage }) => {
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [sfxOn, setSfxOn] = useState<boolean>(isSoundEnabled());
  const [isSlashing, setIsSlashing] = useState<boolean>(false);
  const flashTimeoutRef = useRef<number | null>(null);

  // Synthesized blade sound effect with Web Audio API (falls back to unified audio system)
  const triggerBladeSlash = useCallback(() => {
    // Visual flash animation
    setIsSlashing(false);
    requestAnimationFrame(() => {
      setIsSlashing(true);
      if (flashTimeoutRef.current) {
        window.clearTimeout(flashTimeoutRef.current);
      }
      flashTimeoutRef.current = window.setTimeout(() => {
        setIsSlashing(false);
      }, 400);
    });

    // Play arcade blade sound
    if (sfxOn) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          if (ctx.state === "suspended") {
            ctx.resume().catch(() => {});
          }
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(850, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);

          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.18);
        } else {
          playArcadeSound("slash");
        }
      } catch {
        playArcadeSound("slash");
      }
    }
  }, [sfxOn]);

  const handleSoundToggle = useCallback(() => {
    const newState = toggleSound();
    setSfxOn(newState);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between text-[#1b1c1c] antialiased selection:bg-[#d9363e] selection:text-white bg-[#F7E8C3] bg-[radial-gradient(#252525_11%,transparent_12%)] [background-size:16px_16px]">
      {/* ================= TOP APP BAR ================= */}
      <header className="w-full bg-[#ffffff] border-b-4 border-[#1b1c1c] shadow-[0_4px_0_0_#1b1c1c] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 max-w-7xl mx-auto">
          {/* Brand & Version Sticker */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              onClick={() => playArcadeSound("blip")}
              className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#b61929] uppercase hover:-translate-y-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              <img
                src={Logo}
                alt="SLICE STORM Logo"
                className="h-8 sm:h-9 w-auto object-contain drop-shadow-[2px_2px_0_#1b1c1c]"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
              <span className="hidden xs:inline">SLICE STORM</span>
            </Link>
            <span className="hidden sm:inline-flex items-center font-['Rubik',sans-serif] text-[10px] tracking-wider bg-[#ffe07e] text-[#231b00] px-2.5 py-0.5 rounded border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] font-black uppercase rotate-[-2deg]">
              ARCADE EDITION (V4.2)
            </span>
          </div>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 font-['Rubik',sans-serif] text-sm font-bold">
            <Link
              to="/arcade"
              onClick={() => playArcadeSound("blip")}
              className="text-[#1b1c1c] hover:text-[#b61929] transition-colors"
            >
              ARCADE
            </Link>
            <Link
              to="/leaderboard"
              onClick={() => playArcadeSound("blip")}
              className="text-[#1b1c1c] hover:text-[#b61929] transition-colors"
            >
              LEADERBOARDS
            </Link>
            <Link
              to="/history"
              onClick={() => playArcadeSound("blip")}
              className="text-[#1b1c1c] hover:text-[#b61929] transition-colors"
            >
              SCOREBOOK
            </Link>
            <Link
              to="/dashboard"
              onClick={() => playArcadeSound("blip")}
              className="text-[#1b1c1c] hover:text-[#b61929] transition-colors"
            >
              DASHBOARD
            </Link>
          </nav>

          {/* Trailing Controls: SFX Audio Switch + Player VIP Chip + Login / Play Action */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* SFX Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-[#fcf9f8] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] font-['Rubik',sans-serif] text-xs font-black hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                !sfxOn ? "opacity-70 bg-gray-200" : ""
              }`}
              title="Toggle Cabinet Audio"
            >
              {sfxOn ? (
                <Volume2 className="w-4 h-4 text-[#1b1c1c]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#1b1c1c]" />
              )}
              <span>{sfxOn ? "SFX: ON" : "SFX: MUTED"}</span>
            </button>

            {/* Player VIP Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-[#FFF4D6] px-3 py-1 border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c]">
              <Gamepad2 className="w-4 h-4 text-[#b61929]" />
              <span className="font-['Rubik',sans-serif] text-xs font-black tracking-wide text-[#1b1c1c]">
                {authUser?.name ? `${authUser.name.toUpperCase()} VIP` : "PLAYER #01 VIP"}
              </span>
            </div>

            {/* Trailing Primary Action */}
            {authUser ? (
              <button
                onClick={() => {
                  playArcadeSound("click");
                  navigate("/arcade");
                }}
                className="bg-[#d9363e] text-white font-['Rubik',sans-serif] text-xs sm:text-sm font-black px-3.5 sm:px-4 py-2 border-2 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#1b1c1c] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>PLAY</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => playArcadeSound("click")}
                className="bg-[#d9363e] text-white font-['Rubik',sans-serif] text-xs sm:text-sm font-black px-3.5 sm:px-4 py-2 border-2 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#1b1c1c] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>LOGIN</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN 404 EXPERIENCE ================= */}
      <main className="flex-grow flex items-center justify-center p-3 sm:p-6 md:p-10 my-4">
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
          {/* TOP INCIDENT TAPE (Washi Tape Style) */}
          <div className="relative z-20 mb-[-14px] rotate-[-1.5deg] hover:rotate-0 transition-transform">
            <div className="bg-[#ffe07e] text-[#231b00] px-4 sm:px-5 py-1.5 sm:py-2 border-3 sm:border-4 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c] flex items-center gap-2 uppercase tracking-wider font-['Rubik',sans-serif] text-xs sm:text-sm font-extrabold">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#b61929] animate-ping"></span>
              <span>INCIDENT REPORT: ROUTE_NOT_FOUND (ERR #404-SLASH)</span>
            </div>
          </div>

          {/* MAIN RETRO-ARCADE 404 CARD */}
          <section className="w-full bg-[#FFF4D6] border-4 border-[#1b1c1c] shadow-[8px_8px_0px_#1b1c1c] relative overflow-hidden p-6 sm:p-10 md:p-12 text-center flex flex-col items-center">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[#d9363e] border-b-4 border-[#1b1c1c] flex items-center justify-around px-4">
              <div className="w-2 h-2 rounded-full bg-[#ffe07e]"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-[#fe893c]"></div>
              <div className="w-2 h-2 rounded-full bg-[#ffe07e]"></div>
            </div>

            {/* Decorative Stamps Left & Right */}
            <div className="absolute top-6 left-6 hidden md:block">
              <div className="bg-[#fe893c] text-white border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] px-2.5 py-1 font-['Rubik',sans-serif] text-[10px] font-black uppercase rotate-[-6deg]">
                JUICE OVERLOAD: 0%
              </div>
            </div>
            <div className="absolute top-6 right-6 hidden md:block">
              <div className="bg-[#5CB85C] text-[#252525] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] px-2.5 py-1 font-['Rubik',sans-serif] text-[10px] font-black uppercase rotate-[4deg]">
                SWIPE MISSED
              </div>
            </div>

            {/* Centerpiece: Sliced-In-Half 404 Graphic (Interactive) */}
            <div
              className="relative my-4 sm:my-6 select-none cursor-pointer group"
              onClick={triggerBladeSlash}
              title="Click anywhere on the graphic to slash!"
            >
              {/* Interactive Blade Trail Flash Layer */}
              <div
                className={`absolute inset-0 pointer-events-none z-30 flex items-center justify-center transition-opacity duration-200 ${
                  isSlashing ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-[140%] h-3 bg-white border-y-2 border-[#b61929] shadow-[0_0_16px_#fff] rotate-[-15deg] transform scale-x-125 transition-transform duration-300"></div>
              </div>

              {/* Splash Splatters Backing */}
              <div className="absolute -top-6 -left-8 text-[#fe893c] opacity-40 -z-0 pointer-events-none">
                <svg fill="currentColor" height="80" viewBox="0 0 100 100" width="80">
                  <path d="M50 0 C60 30 90 20 85 50 C80 80 50 70 45 95 C40 70 10 80 15 50 C20 20 40 30 50 0 Z"></path>
                </svg>
              </div>
              <div className="absolute -bottom-6 -right-8 text-[#d9363e] opacity-30 -z-0 pointer-events-none">
                <svg fill="currentColor" height="90" viewBox="0 0 100 100" width="90">
                  <path d="M40 5 C75 15 70 45 95 60 C80 85 55 75 40 95 C25 80 5 85 10 55 C15 30 10 20 40 5 Z"></path>
                </svg>
              </div>

              {/* 404 Cut Visual Construction */}
              <div className="relative z-10 flex flex-col items-center">
                {/* Top Halved Block (Tilted Left) */}
                <div className="transform -translate-x-3 -translate-y-1 rotate-[-3deg] group-hover:-translate-x-5 group-hover:-translate-y-2 transition-transform duration-200">
                  <div
                    className="font-['Bricolage_Grotesque',sans-serif] text-[78px] sm:text-[110px] md:text-[130px] leading-none font-extrabold tracking-tight text-[#d9363e] select-none drop-shadow-[4px_4px_0_#1b1c1c]"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 55%, 0 25%)",
                    }}
                  >
                    404
                  </div>
                </div>

                {/* The Diagonal Neon Cut Seam */}
                <div className="w-full flex items-center justify-center relative -my-4 z-20">
                  <div className="h-1.5 w-64 sm:w-80 md:w-96 bg-white border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] rotate-[-8deg] transform scale-105"></div>
                  <span className="absolute right-6 -top-3 text-[#ffe07e] text-2xl font-black drop-shadow-[2px_2px_0_#1b1c1c] animate-bounce">
                    ⚡
                  </span>
                </div>

                {/* Bottom Halved Block (Tilted Right) */}
                <div className="transform translate-x-3 translate-y-1 rotate-[3deg] group-hover:translate-x-5 group-hover:translate-y-2 transition-transform duration-200">
                  <div
                    className="font-['Bricolage_Grotesque',sans-serif] text-[78px] sm:text-[110px] md:text-[130px] leading-none font-extrabold tracking-tight text-[#fe893c] select-none drop-shadow-[4px_4px_0_#1b1c1c]"
                    style={{
                      clipPath: "polygon(0 26%, 100% 56%, 100% 100%, 0 100%)",
                    }}
                  >
                    404
                  </div>
                </div>

                {/* Cleaved Watermelon / Cut Citrus Comic Mascot */}
                <div className="mt-2 flex items-center justify-center gap-3">
                  {/* Left Sliced Half */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#5CB85C] border-3 border-[#1b1c1c] rounded-l-full relative flex items-center justify-end p-1.5 shadow-[2px_2px_0px_#1b1c1c] -rotate-12 group-hover:-rotate-16 transition-transform">
                    <div className="w-8 h-10 bg-[#d9363e] rounded-l-full relative flex flex-col items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#1b1c1c] rounded-full mb-1"></div>
                      <div className="w-1.5 h-1.5 bg-[#1b1c1c] rounded-full"></div>
                    </div>
                  </div>

                  {/* Slash Juice Splat */}
                  <div className="text-[#d9363e] font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black italic tracking-wide">
                    *WHIFF!*
                  </div>

                  {/* Right Sliced Half */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#5CB85C] border-3 border-[#1b1c1c] rounded-r-full relative flex items-center justify-start p-1.5 shadow-[2px_2px_0px_#1b1c1c] rotate-12 group-hover:rotate-16 transition-transform">
                    <div className="w-8 h-10 bg-[#d9363e] rounded-r-full relative flex flex-col items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#1b1c1c] rounded-full mb-1"></div>
                      <div className="w-1.5 h-1.5 bg-[#1b1c1c] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Headline & Subtitle */}
            <h1 className="font-['Bricolage_Grotesque',sans-serif] text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase text-[#1b1c1c] tracking-tight mt-2 mb-3">
              404 // TOTAL WHIFF!
            </h1>
            <p className="font-['Rubik',sans-serif] text-sm sm:text-base md:text-lg text-[#5b403f] max-w-xl mx-auto leading-relaxed mb-6 font-medium">
              {customMessage ||
                "Your blade sliced right through empty air. The screen you're hunting for was diced, dropped, or never existed in this arcade cabinet."}
            </p>

            {/* Blade Accuracy Penalty Card */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-[#ffffff] border-3 border-[#1b1c1c] shadow-[4px_4px_0px_#1b1c1c] px-3 sm:px-4 py-2 sm:py-2.5 mb-8 rotate-[0.5deg]">
              <div className="flex items-center gap-1.5 font-['Rubik',sans-serif] text-xs sm:text-sm font-extrabold text-[#b61929] uppercase">
                <HeartCrack className="w-4 h-4 sm:w-5 sm:h-5 text-[#b61929]" />
                <span>DAMAGE TAKEN: 1 HEART</span>
              </div>
              <span className="text-[#1b1c1c] font-black hidden xs:inline">|</span>
              <div className="flex items-center gap-1.5 font-['Rubik',sans-serif] text-xs sm:text-sm font-extrabold text-[#9a4600] uppercase">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#9a4600]" />
                <span>COMBO BROKEN: 0x</span>
              </div>
              <span className="text-[#1b1c1c] font-black hidden sm:inline">|</span>
              <div className="flex items-center gap-1 font-['Rubik',sans-serif] text-xs sm:text-sm font-extrabold text-[#1b1c1c] uppercase">
                <span>BLADE ACCURACY: 00.0%</span>
              </div>
            </div>

            {/* Recovery CTA Arcade Push Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mb-8">
              {/* Primary CTA Button (Red Slam Button) */}
              <Link
                to="/arcade"
                onClick={() => playArcadeSound("click")}
                className="w-full sm:w-auto flex-1 bg-[#d9363e] text-white font-['Rubik',sans-serif] text-sm sm:text-base font-extrabold py-3.5 px-6 border-3 border-[#1b1c1c] shadow-[6px_6px_0px_#1b1c1c] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1b1c1c] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-center flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <Swords className="w-5 h-5" />
                <span>INSERT COIN &amp; PLAY</span>
              </Link>
              {/* Secondary CTA Button (Yellow Coin Return) */}
              <Link
                to="/dashboard"
                onClick={() => playArcadeSound("click")}
                className="w-full sm:w-auto flex-1 bg-[#ffe07e] text-[#231b00] font-['Rubik',sans-serif] text-sm sm:text-base font-extrabold py-3.5 px-6 border-3 border-[#1b1c1c] shadow-[6px_6px_0px_#1b1c1c] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1b1c1c] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-center flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
              >
                <Scroll className="w-5 h-5" />
                <span>CABINET DASHBOARD</span>
              </Link>
            </div>

            {/* Quick Jump Paper Ticket Strip */}
            <div className="w-full max-w-2xl border-t-2 border-dashed border-[#8f706e] pt-6 flex flex-col items-center">
              <span className="font-['Rubik',sans-serif] text-[11px] font-black uppercase tracking-widest text-[#5b403f] mb-3">
                CABINET WAYPOINTS // RAPID TELEPORT
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-['Rubik',sans-serif] text-xs sm:text-sm font-bold">
                <Link
                  to="/leaderboard"
                  onClick={() => playArcadeSound("blip")}
                  className="bg-[#fcf9f8] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] px-3 py-1 text-[#1b1c1c] hover:text-[#b61929] hover:-translate-y-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <Trophy className="w-4 h-4 text-[#b61929]" />
                  <span>HIGH SCORES</span>
                </Link>
                <Link
                  to="/history"
                  onClick={() => playArcadeSound("blip")}
                  className="bg-[#fcf9f8] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] px-3 py-1 text-[#1b1c1c] hover:text-[#b61929] hover:-translate-y-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <History className="w-4 h-4 text-[#b61929]" />
                  <span>RUN HISTORY</span>
                </Link>
                <Link
                  to="/arcade"
                  onClick={() => playArcadeSound("blip")}
                  className="bg-[#fcf9f8] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] px-3 py-1 text-[#1b1c1c] hover:text-[#b61929] hover:-translate-y-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <Gamepad2 className="w-4 h-4 text-[#b61929]" />
                  <span>ARCADE CABIN</span>
                </Link>
                <Link
                  to="/"
                  onClick={() => playArcadeSound("blip")}
                  className="bg-[#fcf9f8] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] px-3 py-1 text-[#1b1c1c] hover:text-[#b61929] hover:-translate-y-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <Home className="w-4 h-4 text-[#b61929]" />
                  <span>HOME LANDING</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Bottom Interactive Micro-Badge & Link Reporter */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 px-2">
            {/* Interactive Tester Badge */}
            <button
              id="test-blade-btn"
              onClick={triggerBladeSlash}
              className="bg-[#fcf9f8] border-2 border-[#1b1c1c] shadow-[2px_2px_0px_#1b1c1c] px-3.5 py-1.5 font-['Rubik',sans-serif] text-xs font-extrabold uppercase text-[#1b1c1c] hover:bg-[#ffe07e] hover:-translate-y-0.5 active:translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Hand className="w-4 h-4 text-[#b61929]" />
              <span>TAP TO TEST BLADE SOUND</span>
            </button>
            {/* Feedback & Report Broken Link */}
            <Link
              to="/support"
              onClick={() => playArcadeSound("blip")}
              className="text-[#5b403f] hover:text-[#b61929] font-['Rubik',sans-serif] text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-[#5b403f]" />
              <span>REPORT BROKEN CABINET LINK (TICKET #404)</span>
            </Link>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-[#eae7e7] border-t-4 border-[#1b1c1c] shadow-[0_-4px_0_0_#1b1c1c] mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-5 gap-4 max-w-7xl mx-auto">
          {/* Brand & Copyright Statement */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-['Bricolage_Grotesque',sans-serif] text-xl font-black text-[#b61929] tracking-tight">
              SLICE STORM
            </span>
            <span className="hidden sm:inline text-[#1b1c1c] font-bold">•</span>
            <p className="font-['Rubik',sans-serif] text-xs font-medium text-[#5b403f]">
              © 2024 SLICE STORM ARCADE. ALL RIGHTS RESERVED. JUICE RESPONSIBLY.
            </p>
          </div>
          {/* Footer Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-['Rubik',sans-serif] text-xs font-bold">
            <Link
              to="/terms"
              onClick={() => playArcadeSound("blip")}
              className="text-[#5b403f] uppercase font-bold tracking-wider hover:text-[#b61929] transition-colors active:translate-y-0.5"
            >
              TERMS OF SERVICE
            </Link>
            <Link
              to="/privacy"
              onClick={() => playArcadeSound("blip")}
              className="text-[#5b403f] uppercase font-bold tracking-wider hover:text-[#b61929] transition-colors active:translate-y-0.5"
            >
              PRIVACY POLICY
            </Link>
            <Link
              to="/safety"
              onClick={() => playArcadeSound("blip")}
              className="text-[#5b403f] uppercase font-bold tracking-wider hover:text-[#b61929] transition-colors active:translate-y-0.5"
            >
              ARCADE SAFETY
            </Link>
            <Link
              to="/support"
              onClick={() => playArcadeSound("blip")}
              className="text-[#5b403f] uppercase font-bold tracking-wider hover:text-[#b61929] transition-colors active:translate-y-0.5"
            >
              SUPPORT
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
});

Errorpage.displayName = "Errorpage";
export default Errorpage;