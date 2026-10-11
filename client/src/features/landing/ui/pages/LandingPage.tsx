import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router";
import {
  playArcadeSound,
  toggleSound,
  isSoundEnabled,
} from "../../../../shared/utils/arcadeAudio";
import Logo from "../../../../../public/logo.png"

const NAV_ITEMS = [
  { id: "arcade", label: "ARCADE" },
  { id: "leaderboard", label: "LEADERBOARDS" },
  { id: "modes", label: "GAME MODES" },
  { id: "how-to-play", label: "HOW TO PLAY" },
];

export const LandingPage: React.FC = () => {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [activeNav, setActiveNav] = useState<string>("arcade");
  const [score, setScore] = useState(8940);
  const [combo, setCombo] = useState(9);
  const [activeFrenzy, setActiveFrenzy] = useState(false);
  const [bombHit, setBombHit] = useState(false);
  const [slicedTargets, setSlicedTargets] = useState<Record<string, boolean>>(
    {},
  );

  // Sync active nav item on scroll using IntersectionObserver (Rule 03 & Rule 11)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      },
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = useCallback((id: string) => {
    playArcadeSound("blip");
    setActiveNav(id);
  }, []);

  const handleSoundToggle = useCallback(() => {
    const newState = toggleSound();
    setSoundOn(newState);
  }, []);

  const handleSliceFruit = useCallback((id: string, pts: number) => {
    playArcadeSound("pop");
    setScore((prev) => prev + pts);
    setCombo((prev) => prev + 1);
    setActiveFrenzy(true);

    setSlicedTargets((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSlicedTargets((prev) => ({ ...prev, [id]: false }));
    }, 200);
  }, []);

  const handleSliceBomb = useCallback(() => {
    playArcadeSound("bomb");
    setScore((prev) => Math.max(0, prev - 1000));
    setCombo(1);
    setActiveFrenzy(false);
    setBombHit(true);

    setTimeout(() => {
      setBombHit(false);
    }, 400);
  }, []);

  const handleResetArena = useCallback(() => {
    playArcadeSound("blip");
    setScore(8940);
    setCombo(9);
    setActiveFrenzy(false);
  }, []);

  return (
    <div className="text-[#1b1c1c] font-body bg-[#F7E8C3] antialiased selection:bg-[#FFE07E] selection:text-[#231B00] min-h-screen border-x-4 border-[#1b1c1c] mx-auto shadow-2xl relative">
      {/* ========================================================================= */}
      {/* 1. TOP APP BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-[#1b1c1c] shadow-[0_4px_0_0_#1b1c1c]">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 py-2.5 max-w-7xl mx-auto gap-4">
          {/* Brand Logo & Version Sticker */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              onClick={() => playArcadeSound("click")}
              className="flex items-center gap-2 group transition-transform active:translate-y-0.5"
            >
              <img
                alt="SLICE STORM Logo"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-[2px_2px_0px_#252525]"
                src={Logo}
              />
            </Link>
            <span className="hidden lg:inline-flex items-center px-2 py-0.5 bg-[#FFE07E] text-[#231B00] border-2 border-[#1b1c1c] rounded font-bold text-xs shadow-[2px_2px_0px_#252525] -rotate-2">
              V2.4 BLITZ EDITION
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8">
            {NAV_ITEMS.map(({ id, label }) => {
              const isActive = activeNav === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => handleNavClick(id)}
                  className={`font-bold text-sm tracking-wide transition-all pb-1 ${
                    isActive
                      ? "text-[#b61929] border-b-4 border-[#b61929] -translate-y-0.5"
                      : "text-[#1b1c1c] hover:text-[#b61929] border-b-4 border-transparent hover:-translate-y-0.5"
                  }`}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Right Trailing Actions: Audio FX + Login + Play Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio SFX Toggle Button */}
            <button
              onClick={handleSoundToggle}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#eae7e7] border-2 border-[#1b1c1c] rounded font-bold text-xs text-[#1b1c1c] shadow-paper-2 hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer"
              title="Toggle Sound FX"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {soundOn ? "volume_up" : "volume_off"}
              </span>
              <span className="hidden sm:inline">
                {soundOn ? "SFX: ON" : "SFX: OFF"}
              </span>
            </button>

            {/* Login Link */}
            <Link
              to="/login"
              onClick={() => playArcadeSound("click")}
              className="px-3.5 py-1.5 bg-white text-[#1b1c1c] border-2 border-[#1b1c1c] rounded font-bold text-sm shadow-paper-2 hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
            >
              LOGIN
            </Link>

            {/* Play Now CTA */}
            <Link
              to="/register"
              onClick={() => playArcadeSound("slash")}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#D9363E] text-white border-2 border-[#1b1c1c] rounded font-bold text-sm shadow-paper-4 arcade-btn-slam"
            >
              <span className="material-symbols-outlined text-[18px]">
                swords
              </span>
              <span>PLAY NOW</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION — THE FRUIT BATTLEFIELD */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Top Decorative Paper Banners */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FFE07E] text-[#231B00] border-2 border-[#1b1c1c] rounded-full shadow-paper-2 -rotate-1 font-bold text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b61929] animate-ping"></span>
            <span>SLICE • COMBO • SURVIVE</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[#b61929] font-bold text-xs border-2 border-[#1b1c1c] shadow-paper-2 rotate-1">
            <span className="material-symbols-outlined text-[18px]">
              local_fire_department
            </span>
            <span>HOW HIGH CAN YOU SCORE?</span>
          </div>
        </div>

        {/* Main Headline Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heavy Headline & CTAs */}
          <div className="lg:col-span-7 z-10">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#1b1c1c] leading-[0.95] mb-5 drop-shadow-[4px_4px_0px_#D9363E]">
              SLICE THE FRUIT. <br />
              <span className="inline-block bg-[#FFE07E] px-3 py-0.5 border-4 border-[#1b1c1c] text-[#1b1c1c] -rotate-1 shadow-paper-4 my-1">
                COMBO.
              </span>{" "}
              <span className="text-[#D9363E]">SURVIVE.</span> <br />
              SET THE HIGH SCORE.
            </h1>

            {/* Paper Blurb */}
            <div className="relative bg-white border-4 border-[#1b1c1c] p-4 sm:p-5 rounded-lg shadow-paper-6 mb-7 max-w-xl">
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 bg-[#FE893C] text-white border-2 border-[#1b1c1c] font-bold text-[11px] uppercase rounded shadow-paper-2 rotate-2">
                100% JUICE ACTION
              </div>
              <p className="text-base sm:text-lg text-[#1b1c1c] leading-snug font-medium">
                Step onto the tabletop cabinet battlefield! Draw your steel,
                unleash devastating multi-fruit blade chains, avoid volatile
                doom bombs, and blast your tag straight to the world arcade
                summit.
              </p>
            </div>

            {/* Physical Arcade Push Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/register"
                onClick={() => playArcadeSound("slash")}
                className="inline-flex items-center gap-3 px-7 py-4 bg-[#D9363E] text-white border-4 border-[#1b1c1c] rounded-lg font-display font-black text-lg uppercase tracking-wide shadow-paper-6 arcade-btn-slam"
              >
                <span className="material-symbols-outlined text-[28px]">
                  sports_kabaddi
                </span>
                <span>[ ⚔️ PLAY NOW ]</span>
              </Link>
              <a
                href="#how-to-play"
                onClick={() => playArcadeSound("blip")}
                className="inline-flex items-center gap-2 px-6 py-4 bg-[#FFE07E] text-[#231B00] border-4 border-[#1b1c1c] rounded-lg font-display font-black text-lg uppercase shadow-paper-4 arcade-btn-secondary"
              >
                <span className="material-symbols-outlined text-[24px]">
                  help
                </span>
                <span>HOW TO PLAY</span>
              </a>
            </div>

            {/* Quick Player Stats Micro-Bar */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[#1b1c1c] font-bold text-xs">
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 border-2 border-[#1b1c1c] shadow-paper-2 rounded">
                <span className="material-symbols-outlined text-[#b61929] text-[18px]">
                  verified
                </span>{" "}
                4.8M FRUITS SLICED TODAY
              </span>
              <span className="flex items-center gap-1 bg-white px-2.5 py-1 border-2 border-[#1b1c1c] shadow-paper-2 rounded">
                <span className="material-symbols-outlined text-[#725c00] text-[18px]">
                  electric_bolt
                </span>{" "}
                ZERO LATENCY ARCADE
              </span>
            </div>
          </div>

          {/* Right Column: Visual Fruit & Katana Paper Battlefield */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="w-full max-w-[440px] bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-2xl p-5 shadow-paper-8 relative overflow-hidden">
              {/* Top Accent Bar */}
              <div className="flex justify-between items-center bg-[#D9363E] text-white px-3.5 py-1.5 border-2 border-[#1b1c1c] rounded mb-4 shadow-paper-2">
                <span className="font-bold text-xs tracking-wider">
                  LIVE COIN-OP ARENA
                </span>
                <span className="flex items-center gap-1 text-[10px] bg-[#1b1c1c] text-white px-2 py-0.5 rounded font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>{" "}
                  READY
                </span>
              </div>

              {/* Central Play Arena Simulation */}
              <div
                onClick={() => handleSliceFruit("hero-arena", 300)}
                className="relative h-[340px] bg-[#F7E8C3] border-4 border-[#1b1c1c] rounded-xl overflow-hidden flex items-center justify-center group cursor-crosshair select-none"
              >
                {/* SVG Slash Trails */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
                  viewBox="0 0 300 300"
                >
                  <path
                    d="M 20 280 Q 150 150 280 20"
                    fill="none"
                    stroke="#FFF"
                    strokeDasharray="14 8"
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                  <path
                    d="M 20 280 Q 150 150 280 20"
                    fill="none"
                    stroke="#D9363E"
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                  <circle
                    cx="160"
                    cy="140"
                    fill="#FF8A3D"
                    r="18"
                    stroke="#252525"
                    strokeWidth="3"
                  />
                  <circle
                    cx="180"
                    cy="120"
                    fill="#FFD84D"
                    r="10"
                    stroke="#252525"
                    strokeWidth="2"
                  />
                </svg>

                {/* Splatter Juice Droplets */}
                <div className="absolute top-12 left-10 w-6 h-6 bg-[#D9363E] rounded-full border-2 border-[#1b1c1c] rotate-45 shadow-paper-2"></div>
                <div className="absolute bottom-16 right-12 w-8 h-8 bg-[#FE893C] rounded-full border-2 border-[#1b1c1c] -rotate-12 shadow-paper-2"></div>
                <div className="absolute top-20 right-8 w-5 h-5 bg-[#FFE07E] rounded-full border-2 border-[#1b1c1c] shadow-paper-2"></div>

                {/* Flying Fruit 1: Sliced Watermelon */}
                <div className="absolute top-8 left-6 animate-float-1">
                  <div className="relative w-20 h-12 bg-[#b61929] rounded-b-full shadow-paper-4 flex items-center justify-center overflow-hidden border-4 border-[#1b1c1c]">
                    <div className="w-full h-3 bg-[#5CB85C] absolute top-0 border-b-2 border-[#1b1c1c]"></div>
                    <div className="flex gap-1.5 mt-2">
                      <div className="w-1.5 h-2 bg-[#1b1c1c] rounded-full"></div>
                      <div className="w-1.5 h-2 bg-[#1b1c1c] rounded-full"></div>
                      <div className="w-1.5 h-2 bg-[#1b1c1c] rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Flying Fruit 2: Citrus */}
                <div className="absolute bottom-8 left-10 animate-float-2">
                  <div className="w-16 h-16 bg-[#FE893C] border-4 border-[#1b1c1c] rounded-full shadow-paper-4 flex items-center justify-center text-3xl">
                    🍊
                  </div>
                </div>

                {/* Flying Fruit 3: Banana */}
                <div className="absolute top-14 right-8 animate-float-1">
                  <div className="w-14 h-14 bg-[#FFE07E] border-4 border-[#1b1c1c] rounded-xl shadow-paper-4 rotate-12 flex items-center justify-center text-3xl">
                    🍌
                  </div>
                </div>

                {/* Katana Blade */}
                <div className="absolute z-20 animate-blade pointer-events-none">
                  <div className="w-56 h-4 bg-white border-2 border-[#1b1c1c] rounded-full shadow-[0_0_12px_#FFF] flex items-center">
                    <div className="w-14 h-6 bg-[#1b1c1c] border-2 border-[#FFE07E] rounded-l-md -ml-2"></div>
                    <div className="w-2 h-8 bg-[#FFE07E] border border-[#1b1c1c] -ml-1"></div>
                  </div>
                </div>

                {/* Combo Splash Toast */}
                <div className="absolute bottom-5 z-30 bg-[#FFE07E] text-[#231B00] border-3 border-[#1b1c1c] px-4 py-1.5 rounded-lg shadow-paper-4 rotate-3 animate-pulse">
                  <span className="font-display font-black text-sm">
                    COMBO ×12!
                  </span>
                </div>
              </div>

              {/* Score HUD */}
              <div className="mt-4 bg-white border-3 border-[#1b1c1c] p-3 rounded-lg shadow-paper-4 grid grid-cols-2 gap-2 text-[#1b1c1c]">
                <div className="bg-[#f0eded] px-2 py-1.5 rounded border border-[#1b1c1c]">
                  <div className="text-[10px] font-bold text-[#5b403f] uppercase">
                    HIGH SCORE
                  </div>
                  <div className="font-display font-black text-base text-[#b61929]">
                    12,480
                  </div>
                </div>
                <div className="bg-[#f0eded] px-2 py-1.5 rounded border border-[#1b1c1c]">
                  <div className="text-[10px] font-bold text-[#5b403f] uppercase">
                    BEST COMBO
                  </div>
                  <div className="font-display font-black text-base text-[#9a4600]">
                    ×24 FRENZY
                  </div>
                </div>
                <div className="bg-[#f0eded] px-2 py-1.5 rounded border border-[#1b1c1c]">
                  <div className="text-[10px] font-bold text-[#5b403f] uppercase">
                    LIVES
                  </div>
                  <div className="font-bold text-sm text-[#D9363E]">❤️❤️❤️</div>
                </div>
                <div className="bg-[#f0eded] px-2 py-1.5 rounded border border-[#1b1c1c]">
                  <div className="text-[10px] font-bold text-[#5b403f] uppercase">
                    BLADE MULTIPLIER
                  </div>
                  <div className="font-display font-black text-sm text-[#725c00]">
                    3X ACTIVE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW TO PLAY (3 Tactile Illustrated Step Cards) */}
      {/* ========================================================================= */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-[#1b1c1c]"
        id="how-to-play"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-[#FFE07E] border-3 border-[#1b1c1c] rounded font-bold text-xs uppercase shadow-paper-2 mb-3 -rotate-1">
            ARCADE SURVIVAL GUIDE
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#1b1c1c]">
            HOW TO SLICE LIKE A MASTER
          </h2>
          <p className="text-base sm:text-lg text-[#5b403f] mt-2 font-medium">
            Simple to learn, impossible to master. Three sacred rules of the
            SLICE STORM dojo.
          </p>
        </div>

        {/* 3 Asymmetrical Paper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* STEP 1 */}
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl p-6 shadow-paper-6 relative transition-transform hover:-translate-y-1.5">
            <div className="washi-tape absolute -top-3 left-8 px-4 py-1 text-xs text-[#1b1c1c] font-black border border-[#1b1c1c]">
              RULE #01
            </div>
            <div className="h-44 bg-white border-3 border-[#1b1c1c] rounded-lg mb-5 flex flex-col items-center justify-center relative overflow-hidden p-4">
              <div className="relative z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[64px] text-[#b61929]">
                  touch_app
                </span>
                <div className="w-24 h-1 border-t-4 border-dashed border-[#1b1c1c] -rotate-12 absolute -right-6"></div>
              </div>
              <span className="mt-3 px-3 py-1 bg-[#ffdbc9] text-[#763300] border border-[#1b1c1c] rounded font-bold text-xs">
                SWIPE OR DRAG MOUSE
              </span>
            </div>
            <h3 className="font-display font-black text-xl uppercase text-[#1b1c1c] mb-2">
              STEP 01 — GRAB YOUR BLADE
            </h3>
            <p className="text-sm text-[#1b1c1c]">
              Move your cursor or finger across the screen. Every swipe
              generates a razor-sharp Katana path with immediate kinetic tactile
              feedback.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl p-6 shadow-paper-6 relative transition-transform hover:-translate-y-1.5 md:-rotate-1">
            <div className="washi-tape absolute -top-3 left-8 px-4 py-1 text-xs text-[#1b1c1c] font-black border border-[#1b1c1c]">
              RULE #02
            </div>
            <div className="h-44 bg-white border-3 border-[#1b1c1c] rounded-lg mb-5 flex flex-col items-center justify-center relative overflow-hidden p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#D9363E] text-white rounded-full border-2 border-[#1b1c1c] flex items-center justify-center font-bold text-xl shadow-paper-2">
                  🍉
                </div>
                <span className="font-display font-black text-2xl text-[#b61929]">
                  +
                </span>
                <div className="w-12 h-12 bg-[#FE893C] text-white rounded-full border-2 border-[#1b1c1c] flex items-center justify-center font-bold text-xl shadow-paper-2">
                  🍍
                </div>
              </div>
              <div className="mt-4 px-3 py-1 bg-[#FFE07E] text-[#231B00] border border-[#1b1c1c] rounded text-xs uppercase font-black">
                +500 COMBO CHAIN
              </div>
            </div>
            <h3 className="font-display font-black text-xl uppercase text-[#1b1c1c] mb-2">
              STEP 02 — SLICE THE FRUIT
            </h3>
            <p className="text-sm text-[#1b1c1c]">
              Slice 3 or more fruits in a single blade stroke to trigger
              multiplier frenzy! Every fruit cut releases a satisfying cartoon
              splash sound and juice particles.
            </p>
          </div>

          {/* STEP 3 (Danger / Bomb) */}
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl p-6 shadow-paper-6 relative transition-transform hover:-translate-y-1.5 md:rotate-1">
            <div className="washi-tape absolute -top-3 left-8 px-4 py-1 text-xs bg-[#b61929] text-white font-black border border-[#1b1c1c]">
              CRITICAL DANGER!
            </div>
            <div className="h-44 bg-white border-3 border-[#1b1c1c] rounded-lg mb-5 flex flex-col items-center justify-center relative overflow-hidden p-4">
              <div className="relative animate-bounce">
                <div className="w-14 h-14 bg-[#1b1c1c] text-white rounded-full border-3 border-[#1b1c1c] flex items-center justify-center shadow-paper-4">
                  <span className="material-symbols-outlined text-[28px] text-[#ba1a1a]">
                    skull
                  </span>
                </div>
                <div className="absolute -top-3 right-1 w-2 h-4 border-r-2 border-t-2 border-[#1b1c1c]"></div>
                <div className="absolute -top-5 right-3 w-3 h-3 bg-[#FFE07E] rounded-full animate-ping"></div>
              </div>
              <span className="mt-4 px-3 py-1 bg-[#ffdad6] text-[#93000a] border border-[#1b1c1c] rounded text-xs uppercase font-black">
                INSTANT LIFE LOSS!
              </span>
            </div>
            <h3 className="font-display font-black text-xl uppercase text-[#ba1a1a] mb-2">
              STEP 03 — DODGE THE BOMBS
            </h3>
            <p className="text-sm text-[#1b1c1c]">
              Beware of ticking spiked bombs mixed in fruit clusters. Slicing
              even one bomb instantly detonates, wipes your combo counter, and
              costs you a precious heart.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE GAMEPLAY SHOWCASE (Arcade Cabinet Screen Viewport) */}
      {/* ========================================================================= */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        id="arcade"
      >
        <div className="bg-[#1b1c1c] text-white border-4 border-[#1b1c1c] rounded-2xl p-4 sm:p-8 shadow-paper-8 relative overflow-hidden">
          {/* Cabinet Marquee Header */}
          <div className="flex flex-wrap items-center justify-between border-b-4 border-gray-700 pb-4 mb-6 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-[#D9363E] animate-ping"></div>
              <h2 className="font-display text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                THE STORM IS COMING — LIVE ARENA
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#eae7e7] text-[#1b1c1c] font-black text-xs uppercase rounded">
                INSERT COIN / FREE PLAY
              </span>
              <span className="px-2.5 py-1 bg-[#b61929] text-white font-black text-xs uppercase rounded animate-pulse">
                LIVE 60 FPS
              </span>
            </div>
          </div>

          {/* CRT Monitor Simulation Window */}
          <div
            className={`crt-screen relative w-full h-[460px] bg-[#1a1c1d] border-4 border-gray-600 rounded-xl overflow-hidden cursor-crosshair select-none flex flex-col justify-between p-6 ${
              bombHit ? "shake-error ring-4 ring-[#ba1a1a]" : ""
            }`}
          >
            {/* Top HUD */}
            <div className="flex justify-between items-start z-20 pointer-events-none">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-xs text-[#FFE07E] tracking-widest uppercase">
                  CURRENT SCORE
                </span>
                <div className="font-display font-black text-4xl sm:text-5xl text-[#FFE07E] drop-shadow-[2px_2px_0px_#252525]">
                  {score.toLocaleString("en-US", { minimumIntegerDigits: 5 })}
                </div>
              </div>
              <div className="flex items-center gap-4 bg-[#303030] px-4 py-2 rounded-lg border-2 border-gray-600">
                <div className="text-right">
                  <span className="font-bold text-xs text-gray-300 uppercase block">
                    COMBO METER
                  </span>
                  <span className="font-display font-black text-lg text-[#FE893C]">
                    ×{combo} {activeFrenzy ? "FRENZY" : "STRIKE"}
                  </span>
                </div>
                <div className="text-2xl tracking-widest text-[#D9363E]">
                  ❤️❤️❤️
                </div>
              </div>
            </div>

            {/* Interactive Floating Targets */}
            <div className="relative w-full h-full flex items-center justify-around z-10">
              {/* Clickable Watermelon */}
              <button
                type="button"
                onClick={() => handleSliceFruit("target-wm", 150)}
                className={`transform transition-all bg-transparent p-2 group cursor-pointer ${
                  slicedTargets["target-wm"]
                    ? "rotate-45 scale-125 opacity-70"
                    : "hover:scale-110 active:scale-95"
                }`}
                title="Click or tap to slice!"
              >
                <div className="w-20 h-20 bg-[#D9363E] border-4 border-white rounded-full flex items-center justify-center text-4xl shadow-paper-4 group-hover:rotate-12 transition-transform">
                  🍉
                </div>
                <span className="block mt-1 font-bold text-xs bg-[#1b1c1c] text-white text-center py-0.5 rounded border border-gray-600">
                  +150 PTS
                </span>
              </button>

              {/* Combo Popup Center */}
              {activeFrenzy && (
                <div className="hidden sm:flex flex-col items-center bg-[#FFE07E] text-[#231B00] border-4 border-[#1b1c1c] px-6 py-2 rounded-xl shadow-paper-6 rotate-2 animate-bounce">
                  <span className="text-[10px] uppercase font-black tracking-widest">
                    FRENZY ACTIVE
                  </span>
                  <span className="font-display font-black text-xl">
                    +{combo * 100} POINTS!
                  </span>
                </div>
              )}

              {/* Clickable Pineapple */}
              <button
                type="button"
                onClick={() => handleSliceFruit("target-pa", 200)}
                className={`transform transition-all bg-transparent p-2 group cursor-pointer ${
                  slicedTargets["target-pa"]
                    ? "-rotate-45 scale-125 opacity-70"
                    : "hover:scale-110 active:scale-95"
                }`}
                title="Click or tap to slice!"
              >
                <div className="w-20 h-20 bg-[#FE893C] border-4 border-white rounded-full flex items-center justify-center text-4xl shadow-paper-4 group-hover:-rotate-12 transition-transform">
                  🍍
                </div>
                <span className="block mt-1 font-bold text-xs bg-[#1b1c1c] text-white text-center py-0.5 rounded border border-gray-600">
                  +200 PTS
                </span>
              </button>

              {/* Danger Target: Cartoon Bomb */}
              <button
                type="button"
                onClick={handleSliceBomb}
                className="transform transition-transform hover:scale-105 active:scale-90 bg-transparent p-2 group cursor-pointer"
                title="WARNING: DO NOT SLICE!"
              >
                <div className="w-20 h-20 bg-[#b61929] border-4 border-[#FFE07E] rounded-full flex items-center justify-center text-4xl shadow-paper-4 animate-pulse">
                  💣
                </div>
                <span className="block mt-1 font-bold text-xs bg-[#ba1a1a] text-white text-center py-0.5 rounded border border-gray-600">
                  DANGER!
                </span>
              </button>
            </div>

            {/* Instruction Bar */}
            <div className="flex justify-between items-center z-20 pointer-events-none text-gray-300 border-t border-gray-700/50 pt-3 text-xs">
              <span>
                💡 <strong className="text-white">TRY IT LIVE:</strong> Click or
                tap floating fruits to hear synthesized slice sounds & pump the
                score!
              </span>
              <span className="uppercase text-[#FFE07E] font-bold">
                BLADE SPEED: HYPER
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm uppercase tracking-wider text-gray-400">
                READY TO JUMP IN?
              </span>
              <span className="text-[#FFE07E] font-display font-black text-xl">
                PRESS START!
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetArena}
                className="px-4 py-2 bg-[#303030] text-white border-2 border-gray-600 rounded font-bold text-sm hover:bg-gray-700 transition-colors shadow-paper-2 cursor-pointer"
              >
                RESET ARENA
              </button>
              <Link
                to="/register"
                onClick={() => playArcadeSound("slash")}
                className="px-6 py-2.5 bg-[#D9363E] text-white border-3 border-white rounded font-display font-black text-base uppercase shadow-paper-4 arcade-btn-slam"
              >
                LAUNCH FULL GAME
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ARCADE GAME MODES (Choose Your Mode Bento) */}
      {/* ========================================================================= */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-[#1b1c1c]"
        id="modes"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-[#ffdbc9] text-[#763300] border-3 border-[#1b1c1c] rounded font-bold text-xs uppercase shadow-paper-2 mb-3 rotate-1">
            BATTLEFIELD PROTOCOLS
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#1b1c1c]">
            ARCADE GAME MODES
          </h2>
          <p className="text-base sm:text-lg text-[#5b403f] mt-2 font-medium">
            Pick your discipline. Whether you crave nerve-shredding survival or
            pure rhythm frenzy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* MODE 1: CLASSIC */}
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl overflow-hidden shadow-paper-6 flex flex-col justify-between group">
            <div>
              <div className="bg-[#D9363E] text-white px-5 py-3 border-b-4 border-[#1b1c1c] flex justify-between items-center">
                <span className="font-display font-black text-lg uppercase">
                  CLASSIC MODE
                </span>
                <span className="material-symbols-outlined text-2xl">
                  swords
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-white border-2 border-[#1b1c1c] font-bold text-xs rounded uppercase">
                    3 LIVES
                  </span>
                  <span className="px-2.5 py-1 bg-[#b61929] text-white border-2 border-[#1b1c1c] font-bold text-xs rounded uppercase">
                    BOMBS ACTIVE
                  </span>
                </div>
                <p className="text-sm text-[#1b1c1c] mb-6 font-medium">
                  The pure tabletop coin-op experience. Miss 3 fruits or trigger
                  a single bomb, and your run is permanently written into the
                  obituary ledger.
                </p>
                <ul className="space-y-2 text-[#1b1c1c] font-bold text-xs">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#b61929] text-[18px]">
                      check_circle
                    </span>{" "}
                    Unlimited run duration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#b61929] text-[18px]">
                      check_circle
                    </span>{" "}
                    Escalating spawn velocity
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#b61929] text-[18px]">
                      check_circle
                    </span>{" "}
                    Hall of Fame rank qualification
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Link
                to="/register"
                onClick={() => playArcadeSound("slash")}
                className="w-full py-3 bg-[#D9363E] text-white border-3 border-[#1b1c1c] rounded font-display font-black text-base uppercase text-center block arcade-btn-slam"
              >
                ENTER CLASSIC
              </Link>
            </div>
          </div>

          {/* MODE 2: ARCADE FRENZY */}
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl overflow-hidden shadow-paper-8 flex flex-col justify-between group md:-translate-y-2">
            <div>
              <div className="bg-[#FE893C] text-white px-5 py-3 border-b-4 border-[#1b1c1c] flex justify-between items-center">
                <span className="font-display font-black text-lg uppercase">
                  ARCADE BLITZ
                </span>
                <span className="material-symbols-outlined text-2xl">
                  timer
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-white border-2 border-[#1b1c1c] font-bold text-xs rounded uppercase">
                    60 SECONDS
                  </span>
                  <span className="px-2.5 py-1 bg-[#FFE07E] text-[#231B00] border-2 border-[#1b1c1c] font-bold text-xs rounded uppercase">
                    POWER-UP BANANAS
                  </span>
                </div>
                <p className="text-sm text-[#1b1c1c] mb-6 font-medium">
                  A high-octane race against the clock! Slice special Freeze,
                  Frenzy, and Double-Point Bananas to rack up dizzying six-digit
                  score cascades.
                </p>
                <ul className="space-y-2 text-[#1b1c1c] font-bold text-xs">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FE893C] text-[18px]">
                      check_circle
                    </span>{" "}
                    60-Second Blitz clock
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FE893C] text-[18px]">
                      check_circle
                    </span>{" "}
                    Special elemental fruits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#FE893C] text-[18px]">
                      check_circle
                    </span>{" "}
                    Explosive end-of-match bonus
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Link
                to="/register"
                onClick={() => playArcadeSound("slash")}
                className="w-full py-3 bg-[#FE893C] text-white border-3 border-[#1b1c1c] rounded font-display font-black text-base uppercase text-center block arcade-btn-slam"
              >
                ENTER BLITZ
              </Link>
            </div>
          </div>

          {/* MODE 3: ZEN SLICE */}
          <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-xl overflow-hidden shadow-paper-6 flex flex-col justify-between group relative">
            <div className="absolute top-14 right-4 z-20 px-3 py-1 bg-[#b61929] text-white border-3 border-[#1b1c1c] font-display font-black text-sm uppercase rotate-12 shadow-paper-4">
              COMING SOON!
            </div>
            <div>
              <div className="bg-[#e4e2e1] text-[#1b1c1c] px-5 py-3 border-b-4 border-[#1b1c1c] flex justify-between items-center">
                <span className="font-display font-black text-lg uppercase">
                  ZEN TRANQUILITY
                </span>
                <span className="material-symbols-outlined text-2xl">
                  self_improvement
                </span>
              </div>
              <div className="p-6 opacity-75">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-white border-2 border-[#1b1c1c] font-bold text-xs rounded uppercase">
                    ZERO BOMBS
                  </span>
                  <span className="px-2.5 py-1 bg-[#eae7e7] text-[#1b1c1c] border-2 border-[#1b1c1c] font-bold text-xs rounded uppercase">
                    NO TIME LIMIT
                  </span>
                </div>
                <p className="text-sm text-[#1b1c1c] mb-6 font-medium">
                  Just you, peaceful tranquil bamboo chimes, and an endless
                  waterfall of colorful fruit. The purest way to practice blade
                  choreography.
                </p>
                <ul className="space-y-2 text-[#1b1c1c] font-bold text-xs">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500 text-[18px]">
                      check_circle
                    </span>{" "}
                    Meditative slice flow
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500 text-[18px]">
                      check_circle
                    </span>{" "}
                    Infinite relaxed replay
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500 text-[18px]">
                      check_circle
                    </span>{" "}
                    Dojo warmup mode
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-6 pt-0">
              <button
                type="button"
                className="w-full py-3 bg-[#eae7e7] text-gray-500 border-3 border-[#1b1c1c] rounded font-display font-black text-base uppercase text-center block cursor-not-allowed"
                disabled
              >
                LOCKED (V2.5)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BUILD THE COMBO (Escalating Multiplier Showcase) */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-[#1b1c1c]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 bg-[#FFE07E] text-[#231B00] border-3 border-[#1b1c1c] rounded font-bold text-xs uppercase shadow-paper-2 mb-3 -rotate-2">
            MULTIPLIER SYSTEM
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#1b1c1c]">
            BUILD THE COMBO. UNLEASH THE STORM.
          </h2>
          <p className="text-base sm:text-lg text-[#5b403f] mt-2 font-medium">
            Chain slices without letting fruit drop to trigger explosive
            multiplier tiers!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tier 1 */}
          <div className="bg-white border-4 border-[#1b1c1c] rounded-xl p-5 shadow-paper-4 text-center group hover:-translate-y-1 transition-transform">
            <span className="inline-block px-3 py-0.5 bg-[#f0eded] border-2 border-[#1b1c1c] rounded font-bold text-xs uppercase mb-3">
              STAGE 01
            </span>
            <div className="font-display font-black text-4xl text-[#1b1c1c] mb-2">
              ×3
            </div>
            <h4 className="font-display font-black text-lg uppercase text-[#b61929] mb-2">
              JUICY START
            </h4>
            <div className="w-full bg-[#FFF4D6] border-2 border-[#1b1c1c] py-2 rounded font-bold text-xs mb-3 shadow-paper-2">
              SOUND: "SLASH!"
            </div>
            <p className="text-xs text-[#5b403f]">
              Slice 3 fruits in 1 stroke. Baseline score multiplier active.
            </p>
          </div>

          {/* Tier 2 */}
          <div className="bg-white border-4 border-[#1b1c1c] rounded-xl p-5 shadow-paper-4 text-center group hover:-translate-y-1 transition-transform">
            <span className="inline-block px-3 py-0.5 bg-[#ffdbc9] border-2 border-[#1b1c1c] rounded font-bold text-xs uppercase mb-3">
              STAGE 02
            </span>
            <div className="font-display font-black text-4xl text-[#9a4600] mb-2">
              ×5
            </div>
            <h4 className="font-display font-black text-lg uppercase text-[#9a4600] mb-2">
              BLADE FRENZY
            </h4>
            <div className="w-full bg-[#FFF4D6] border-2 border-[#1b1c1c] py-2 rounded font-bold text-xs mb-3 shadow-paper-2">
              SOUND: "SPLAT!"
            </div>
            <p className="text-xs text-[#5b403f]">
              Slice 5 consecutive fruits. Blade gains electric speed trail.
            </p>
          </div>

          {/* Tier 3 */}
          <div className="bg-white border-4 border-[#1b1c1c] rounded-xl p-5 shadow-paper-4 text-center group hover:-translate-y-1 transition-transform">
            <span className="inline-block px-3 py-0.5 bg-[#FFE07E] border-2 border-[#1b1c1c] rounded font-bold text-xs uppercase mb-3">
              STAGE 03
            </span>
            <div className="font-display font-black text-4xl text-[#725c00] mb-2">
              ×10
            </div>
            <h4 className="font-display font-black text-lg uppercase text-[#725c00] mb-2">
              STORM SURGE
            </h4>
            <div className="w-full bg-[#FFF4D6] border-2 border-[#1b1c1c] py-2 rounded font-bold text-xs mb-3 shadow-paper-2">
              SOUND: "CRUNCH!"
            </div>
            <p className="text-xs text-[#5b403f]">
              Screen flashes gold. Every fruit sliced drops double points.
            </p>
          </div>

          {/* Tier 4 */}
          <div className="bg-[#D9363E] text-white border-4 border-[#1b1c1c] rounded-xl p-5 shadow-paper-6 text-center group hover:-translate-y-1 transition-transform rotate-1">
            <span className="inline-block px-3 py-0.5 bg-[#1b1c1c] text-white border-2 border-white rounded font-bold text-xs uppercase mb-3">
              STAGE 04 (APEX)
            </span>
            <div className="font-display font-black text-4xl text-[#FFE07E] mb-2 drop-shadow-[2px_2px_0px_#252525]">
              ×20
            </div>
            <h4 className="font-display font-black text-lg uppercase text-white mb-2">
              MAX SLICE GOD
            </h4>
            <div className="w-full bg-[#1b1c1c] text-[#FFE07E] border-2 border-white py-2 rounded font-bold text-xs mb-3 shadow-paper-2">
              SOUND: "BOOM!!!"
            </div>
            <p className="text-xs text-white/90">
              Fruit fountain unlocked! Cabinet marquee enters full lightning
              frenzy.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TOP SLICERS (Arcade Leaderboard Ticket) */}
      {/* ========================================================================= */}
      <section
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t-4 border-[#1b1c1c]"
        id="leaderboard"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Leaderboard Intro */}
          <div className="lg:col-span-5">
            <div className="inline-block px-3 py-1 bg-[#FFE07E] text-[#231B00] border-3 border-[#1b1c1c] rounded font-bold text-xs uppercase shadow-paper-2 mb-3">
              HALL OF FAME
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#1b1c1c] mb-4">
              TOP SLICERS OF THE CABINET
            </h2>
            <p className="text-base sm:text-lg text-[#5b403f] mb-6 font-medium">
              Every slice is tallied live on the global distributed arcade
              ledger. Will your blade handle hold a spot among the immortals?
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-white border-3 border-[#1b1c1c] rounded-lg shadow-paper-2">
                <span className="material-symbols-outlined text-[#b61929] text-3xl">
                  military_tech
                </span>
                <div>
                  <div className="font-bold text-sm text-[#1b1c1c]">
                    WEEKLY LEADER REWARD
                  </div>
                  <div className="text-xs text-[#5b403f]">
                    Golden Damascus Blade Skin + 5,000 Arcade Coins
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border-3 border-[#1b1c1c] rounded-lg shadow-paper-2">
                <span className="material-symbols-outlined text-[#725c00] text-3xl">
                  verified_user
                </span>
                <div>
                  <div className="font-bold text-sm text-[#1b1c1c]">
                    ANTI-CHEAT ENGINE
                  </div>
                  <div className="text-xs text-[#5b403f]">
                    Frame-by-frame physics trajectory verification
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Ticket Ledger */}
          <div className="lg:col-span-7">
            <div className="bg-white border-4 border-[#1b1c1c] rounded-2xl p-6 sm:p-8 shadow-paper-8 relative">
              <div className="flex justify-between items-center border-b-4 border-dashed border-[#1b1c1c] pb-4 mb-6">
                <div>
                  <span className="text-xs text-[#5b403f] uppercase tracking-widest block font-bold">
                    TICKET #489201
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase text-[#1b1c1c]">
                    GLOBAL TOP SCORES
                  </h3>
                </div>
                <span className="px-3 py-1 bg-[#b61929] text-white border-2 border-[#1b1c1c] rounded font-bold text-xs uppercase -rotate-2 shadow-paper-2">
                  SEASON 04
                </span>
              </div>

              {/* Score Rows */}
              <div className="space-y-4">
                {/* Rank 1 */}
                <div className="flex items-center justify-between p-3.5 bg-[#FFF4D6] border-3 border-[#1b1c1c] rounded-xl shadow-paper-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#b61929] text-white font-display font-black text-base flex items-center justify-center border-2 border-[#1b1c1c]">
                      1
                    </span>
                    <div>
                      <div className="font-display font-black text-base uppercase text-[#1b1c1c]">
                        ALEX_BLADE
                      </div>
                      <div className="text-[11px] font-bold text-[#5b403f]">
                        KATANA MASTER • 84 COMBOS
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-base text-[#b61929]">
                      12,480 PTS
                    </div>
                    <span className="text-[10px] text-[#5b403f] uppercase font-bold">
                      ALL-TIME HIGH
                    </span>
                  </div>
                </div>

                {/* Rank 2 */}
                <div className="flex items-center justify-between p-3.5 bg-[#f6f3f2] border-3 border-[#1b1c1c] rounded-xl shadow-paper-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#FE893C] text-white font-display font-black text-base flex items-center justify-center border-2 border-[#1b1c1c]">
                      2
                    </span>
                    <div>
                      <div className="font-display font-black text-base uppercase text-[#1b1c1c]">
                        RILEY_STORM
                      </div>
                      <div className="text-[11px] font-bold text-[#5b403f]">
                        WATERMELON SLAYER • 71 COMBOS
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-base text-[#FE893C]">
                      10,920 PTS
                    </div>
                    <span className="text-[10px] text-[#5b403f] uppercase font-bold">
                      TODAY
                    </span>
                  </div>
                </div>

                {/* Rank 3 */}
                <div className="flex items-center justify-between p-3.5 bg-[#f6f3f2] border-3 border-[#1b1c1c] rounded-xl shadow-paper-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#FFE07E] text-[#231B00] font-display font-black text-base flex items-center justify-center border-2 border-[#1b1c1c]">
                      3
                    </span>
                    <div>
                      <div className="font-display font-black text-base uppercase text-[#1b1c1c]">
                        SAM_NINJA
                      </div>
                      <div className="text-[11px] font-bold text-[#5b403f]">
                        COMBO KING • 65 COMBOS
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-black text-base text-[#725c00]">
                      9,860 PTS
                    </div>
                    <span className="text-[10px] text-[#5b403f] uppercase font-bold">
                      THIS WEEK
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-6 pt-4 border-t-2 border-[#1b1c1c] flex flex-wrap justify-between items-center gap-4">
                <span className="text-xs text-[#5b403f]">
                  YOUR PERSONAL BEST:{" "}
                  <strong className="text-[#1b1c1c]">
                    4,210 PTS (RANK #842)
                  </strong>
                </span>
                <Link
                  to="/register"
                  onClick={() => playArcadeSound("blip")}
                  className="px-5 py-2.5 bg-[#FFE07E] text-[#231B00] border-3 border-[#1b1c1c] rounded font-bold text-xs uppercase shadow-paper-2 hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
                >
                  [ JOIN & CLIMB LEADERBOARD → ]
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. READY TO JOIN THE STORM & FINAL ARCADE CTA */}
      {/* ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#D9363E] text-white border-4 border-[#1b1c1c] rounded-2xl p-8 sm:p-12 shadow-paper-8 relative overflow-hidden text-center">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#FFE07E] border-4 border-[#1b1c1c] rounded-full shadow-paper-4 flex items-center justify-center text-4xl -rotate-12">
            💥
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#FE893C] border-4 border-[#1b1c1c] rounded-full shadow-paper-4 flex items-center justify-center text-4xl rotate-12">
            🍉
          </div>
          <div className="max-w-3xl mx-auto relative z-10">
            <span className="inline-block px-4 py-1 bg-[#1b1c1c] text-[#FFE07E] border-2 border-white font-bold text-xs uppercase rounded tracking-widest shadow-paper-2 mb-4 -rotate-1">
              CABINET READY • COIN INSERTED
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 drop-shadow-[3px_3px_0px_#252525]">
              YOUR BLADE IS WAITING. <br />
              HOW HIGH CAN YOU SCORE?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-8 max-w-xl mx-auto font-medium">
              No installation required. Slice instantly in any modern desktop or
              mobile browser. Compete against thousands of players worldwide.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a
                href="#arcade"
                onClick={() => playArcadeSound("slash")}
                className="px-8 py-4 bg-[#FFE07E] text-[#231B00] border-4 border-[#1b1c1c] rounded-xl font-display font-black text-lg uppercase tracking-wide shadow-paper-6 arcade-btn-slam"
              >
                ⚔️ PLAY DEMO FOR FREE
              </a>
              <Link
                to="/register"
                onClick={() => playArcadeSound("blip")}
                className="px-7 py-4 bg-white text-[#1b1c1c] border-4 border-[#1b1c1c] rounded-xl font-display font-black text-lg uppercase shadow-paper-4 arcade-btn-secondary"
              >
                CREATE PLAYER PROFILE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-[#eae7e7] border-t-4 border-[#1b1c1c] shadow-[0_-4px_0_0_#1b1c1c]">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-6 gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Link to="/" className="flex items-center gap-2">
              <img
                alt="SLICE STORM Logo"
                className="h-8 w-auto object-contain drop-shadow-[2px_2px_0px_#252525]"
                src="https://lh3.googleusercontent.com/aida/AEtjO1W_Ds8rOEhWI7qhd71xYfwcBqc58O_C8-io-tJ77q7XXevtydGqBT9qB3zKMTi_Jv7GNRKqG6jd4pyoWWs7PIVeUlM6_xruRO0VYLHFGVQwcWXUGNxL2Om3tiDwzntF9-oC2K0rQ5YnxyzHRyBUg8g48Vo3cdtjLQ-8iQqsS_8veMqa388NNoCVRuq2LaiNvLiXRceJLc32O4V01TNG4b9nCVqf5ffB3ie4rSZND4cZnrT9R2nllE_hoyg"
              />
            </Link>
            <div className="text-xs text-[#5b403f] font-bold">
              © 2025 SLICE STORM ARCADE. ALL RIGHTS RESERVED. JUICE RESPONSIBLY.
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-8 text-xs font-bold text-[#5b403f]">
            <span className="uppercase hover:text-[#b61929] transition-colors cursor-pointer">
              TERMS OF SERVICE
            </span>
            <span className="text-[#1b1c1c] font-black">•</span>
            <span className="uppercase hover:text-[#b61929] transition-colors cursor-pointer">
              PRIVACY POLICY
            </span>
            <span className="text-[#1b1c1c] font-black">•</span>
            <span className="uppercase hover:text-[#b61929] transition-colors cursor-pointer">
              ARCADE SAFETY
            </span>
            <span className="text-[#1b1c1c] font-black">•</span>
            <span className="uppercase hover:text-[#b61929] transition-colors cursor-pointer">
              SUPPORT
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
