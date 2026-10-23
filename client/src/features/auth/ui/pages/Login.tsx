import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useLoginForm } from "../../hooks/useAuth";
import {
  playArcadeSound,
  toggleSound,
  isSoundEnabled,
} from "../../../../shared/utils/arcadeAudio";
import Logo from "/logo.png"

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successProgress, setSuccessProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
    }>
  >([]);

  // Hook-form and mutation logic fully abstracted in hook layer
  const {
    register,
    onSubmit,
    isSubmitting,
    formError,
    formState: { errors },
    fillNinjaDemo,
  } = useLoginForm({
    onSuccess: () => {
      setShowSuccessModal(true);
      triggerCanvasBurst(window.innerWidth / 2, window.innerHeight / 2);
    },
  });

  // Handle countdown & progress for celebration modal
  useEffect(() => {
    if (!showSuccessModal) return;

    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setSuccessProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        navigate("/dashboard");
      }
    }, 40);

    return () => clearInterval(interval);
  }, [showSuccessModal, navigate]);

  // Particle Canvas for Slice FX
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = "#252525";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const triggerCanvasBurst = (x: number, y: number) => {
    const colors = [
      "#D9363E",
      "#FF8A3D",
      "#FFD84D",
      "#5CB85C",
      "#FFFFFF",
      "#252525",
    ];
    for (let i = 0; i < 26; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.03 + 0.02,
      });
    }
  };

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleSliceClick = (e: React.MouseEvent) => {
    playArcadeSound("slash");
    triggerCanvasBurst(e.clientX, e.clientY);
  };

  return (
    <div className="paper-pattern text-[#252525] min-h-screen relative overflow-x-hidden selection:bg-[#FFD84D] selection:text-[#252525] font-body flex flex-col justify-between">
      {/* Particle overlay canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-40"
      />

      {/* Background Doodles & Speedlines */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-80 select-none">
        <svg
          className="absolute -top-10 -left-10 w-96 h-96 text-[#252525]/10"
          viewBox="0 0 200 200"
        >
          <path
            d="M10,10 L190,90 M10,40 L180,140 M10,80 L160,190 M10,120 L120,200"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <svg
          className="absolute -bottom-16 -right-16 w-96 h-96 text-[#252525]/10"
          viewBox="0 0 200 200"
        >
          <path
            d="M190,190 L10,110 M190,160 L20,60 M190,120 L40,10 M190,80 L80,0"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>

        {/* Floating juice drops & arcade shapes */}
        <div className="absolute top-[18%] left-[7%] animate-float-1">
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="#FF8A3D"
            className="filter drop-shadow-[2px_2px_0px_#252525]"
          >
            <path
              d="M17 2 C17 2 6 18 6 25 C6 30 11 34 17 34 C23 34 28 30 28 25 C28 18 17 2 Z"
              stroke="#252525"
              strokeWidth="2.5"
            />
          </svg>
        </div>
        <div className="absolute top-[68%] left-[4%] animate-float-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="#FFD84D"
            className="filter drop-shadow-[2px_2px_0px_#252525]"
          >
            <path
              d="M14 0 L17.5 10.5 L28 14 L17.5 17.5 L14 28 L10.5 17.5 L0 14 L10.5 10.5 Z"
              stroke="#252525"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="absolute top-[12%] right-[12%] animate-float-2">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="#D9363E"
            className="filter drop-shadow-[2px_2px_0px_#252525]"
          >
            <circle cx="16" cy="16" r="13" stroke="#252525" strokeWidth="2.5" />
            <path
              d="M11 11 L13 13 M19 11 L21 13"
              stroke="#FFF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="absolute bottom-[10%] right-[38%] animate-float-1">
          <svg
            width="26"
            height="26"
            viewBox="0 0 28 28"
            fill="#5CB85C"
            className="filter drop-shadow-[2px_2px_0px_#252525]"
          >
            <path
              d="M14 0 L17.5 10.5 L28 14 L17.5 17.5 L14 28 L10.5 17.5 L0 14 L10.5 10.5 Z"
              stroke="#252525"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* TOP HEADER */}
        <header className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD84D] font-arcade text-xs text-[#252525] comic-border shadow-pop-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5CB85C] border border-[#252525] animate-pulse"></span>
              Arcade Server Online
            </span>
            <span className="hidden sm:inline-block font-display font-black text-xs uppercase tracking-widest text-[#524B40] bg-[#F7E8C3]/80 px-2.5 py-1 rounded-md border border-[#252525]/20">
              v2.4 Blitz Edition
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSoundToggle}
              aria-label="Toggle sound effects"
              className="px-3 py-1.5 rounded-xl bg-[#FFF4D6] hover:bg-white comic-border shadow-pop-sm flex items-center gap-2 font-display font-bold text-xs text-[#252525] transition-transform active:translate-y-0.5 cursor-pointer"
            >
              <svg
                className={`w-4 h-4 ${soundOn ? "text-[#D9363E]" : "text-gray-400"}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77zm-2.5-1.23L6.5 6.5H2v11h4.5l5 4.5V2z" />
              </svg>
              <span className="hidden md:inline">
                {soundOn ? "FX: ON" : "FX: OFF"}
              </span>
            </button>
            <Link
              to="/register"
              onClick={() => playArcadeSound("click")}
              className="px-3.5 py-1.5 rounded-xl bg-[#FF8A3D] hover:bg-orange-400 font-arcade text-xs text-[#FFF4D6] comic-border shadow-pop-sm tracking-wide transition-all hover:-translate-y-0.5"
            >
              NEW PLAYER?
            </Link>
          </div>
        </header>

        {/* CORE TWO-COLUMN GAME WORKSPACE */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
          {/* LEFT COLUMN: GAME WORLD & ILLUSTRATION */}
          <section className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left relative">
            {/* PROMINENT OFFICIAL SLICE STORM LOGO */}
            <div className="relative w-full max-w-[480px] lg:max-w-[520px] mb-3 transform hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -top-3 left-10 z-30 bg-white/70 border border-[#252525]/40 w-16 h-6 rotate-[-7deg] shadow-sm pointer-events-none"></div>
              <div className="absolute -top-2 right-12 z-30 bg-white/70 border border-[#252525]/40 w-14 h-5 rotate-[12deg] shadow-sm pointer-events-none"></div>

              <img
                src={Logo}
                alt="SLICE STORM Arcade Logo"
                className="w-full h-auto drop-shadow-[5px_6px_0px_#252525] select-none pointer-events-none"
              />
            </div>

            {/* Tagline Banner */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-6">
              <div className="px-4 py-1.5 bg-[#252525] text-[#FFD84D] font-arcade text-sm rounded-lg shadow-pop-sm uppercase tracking-wider rotate-[-1deg]">
                SLICE • COMBO • SURVIVE
              </div>
              <div className="px-3 py-1.5 bg-[#5CB85C] text-white font-display font-extrabold text-xs rounded-lg comic-border shadow-pop-sm uppercase rotate-[1.5deg]">
                3x Multiplier Active!
              </div>
            </div>

{/* CARTOON FRUIT & BLADE COMPOSITION */}
<div
  onClick={handleSliceClick}
  className="relative w-full max-w-[460px] h-[290px] sm:h-[320px] my-2 select-none cursor-pointer group"
  title="Click to slice!"
>
  {/* Smooth animations: movement lives on an INNER group, position lives on
      an OUTER group, so CSS animation never overrides the placement. */}
  <style>{`
    .fx-float-a, .fx-float-b, .fx-blade {
      transform-box: fill-box;
      transform-origin: center;
      will-change: transform;
    }
    .fx-float-a { animation: fx-float-a 4.2s ease-in-out infinite; }
    .fx-float-b { animation: fx-float-b 5s ease-in-out infinite; }
    .fx-blade   { animation: fx-blade 3.6s ease-in-out infinite; }

    @keyframes fx-float-a {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-7px) rotate(2.5deg); }
    }
    @keyframes fx-float-b {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(6px) rotate(-3deg); }
    }
    @keyframes fx-blade {
      0%, 100% { transform: translate(0, 0); }
      50%      { transform: translate(-10px, 4px); }
    }
    .group:hover .fx-blade { animation-duration: 1.6s; }

    @media (prefers-reduced-motion: reduce) {
      .fx-float-a, .fx-float-b, .fx-blade { animation: none; }
    }
  `}</style>

  {/* Comic burst backdrop (unchanged) */}
  <svg
    className="absolute inset-0 w-full h-full text-[#EBD4A6]/60 filter drop-shadow-[4px_5px_0px_#252525]"
    viewBox="0 0 460 320"
    fill="none"
  >
    <path
      d="M 40,160 L 15,90 L 85,75 L 75,15 L 150,30 L 180,5 L 235,28 L 305,10 L 360,35 L 430,20 L 415,80 L 450,140 L 410,190 L 445,250 L 380,265 L 350,305 L 285,280 L 225,310 L 160,285 L 100,308 L 65,260 L 20,230 Z"
      fill="#FFE5A3"
      stroke="#252525"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>

  <svg
    className="absolute inset-0 w-full h-full overflow-visible"
    viewBox="0 0 460 320"
    fill="none"
  >
    <defs>
      <linearGradient id="blade-shine-login" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="45%" stopColor="#F1F5F9" />
        <stop offset="70%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="watermelon-grad-login" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF5A65" />
        <stop offset="100%" stopColor="#D9363E" />
      </linearGradient>
      <linearGradient id="orange-grad-login" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFB347" />
        <stop offset="100%" stopColor="#FF8A3D" />
      </linearGradient>
    </defs>

    {/* ===== Slash trail (behind fruits' lower half, in front of backdrop) ===== */}
    <path d="M 50,235 Q 220,170 400,135" stroke="#252525" strokeWidth="14" strokeLinecap="round" />
    <path d="M 50,235 Q 220,170 400,135" stroke="#FFE066" strokeWidth="9" strokeLinecap="round" />
    <path d="M 60,231 Q 220,172 390,138" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />

    {/* ===== Apple — top left (centre ≈ 120,92) ===== */}
    <g transform="translate(120, 92) rotate(-12) translate(-45, -65)">
      <g className="fx-float-a">
        <path
          d="M 45,25 C 20,20 10,45 10,65 C 10,95 32,105 45,105 C 58,105 80,95 80,65 C 80,45 70,20 45,25 Z"
          fill="#FF4757" stroke="#252525" strokeWidth="4.5"
        />
        <path
          d="M 45,34 C 28,30 20,48 20,65 C 20,88 36,96 45,96 C 54,96 70,88 70,65 C 70,48 62,30 45,34 Z"
          fill="#FFFDEB"
        />
        <ellipse cx="40" cy="65" rx="3" ry="5" fill="#4A2810" transform="rotate(-10 40 65)" />
        <ellipse cx="50" cy="65" rx="3" ry="5" fill="#4A2810" transform="rotate(10 50 65)" />
      </g>
    </g>

    {/* ===== Orange — top right (centre ≈ 345,82) ===== */}
    <g transform="translate(345, 82) rotate(12) translate(-55, -55)">
      <g className="fx-float-b">
        <circle cx="55" cy="55" r="46" fill="url(#orange-grad-login)" stroke="#252525" strokeWidth="4.5" />
        <path d="M 55,9 Q 70,-8 90,0 Q 75,18 55,9 Z" fill="#5CB85C" stroke="#252525" strokeWidth="3" />
        <path d="M 55,14 L 55,5" stroke="#7A4F23" strokeWidth="4" strokeLinecap="round" />
        <path d="M 32,32 A 32 32 0 0 1 78 30" stroke="#FFE7BA" strokeWidth="6" strokeLinecap="round" />
        <circle cx="28" cy="46" r="3" fill="#FFF" />
      </g>
    </g>

    {/* ===== Watermelon slice — bottom left (centre ≈ 125,232) ===== */}
    <g transform="translate(125, 232) rotate(-8) translate(-75, -42)">
      <g className="fx-float-b">
        <defs>
          <radialGradient id="melon-flesh-login" cx="50%" cy="0%" r="100%">
            <stop offset="0%" stopColor="#FF8A92" />
            <stop offset="55%" stopColor="#F2414F" />
            <stop offset="100%" stopColor="#D12A38" />
          </radialGradient>
          <linearGradient id="melon-rind-login" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2F8A3A" />
            <stop offset="50%" stopColor="#4DB35A" />
            <stop offset="100%" stopColor="#2F8A3A" />
          </linearGradient>
        </defs>

        {/* rind (outer half-disc) */}
        <path d="M 10,10 A 65 65 0 0 0 140,10 Z" fill="url(#melon-rind-login)" stroke="#252525" strokeWidth="4.5" strokeLinejoin="round" />
        {/* rind stripes */}
        <path d="M 15,16 A 60 60 0 0 0 135,16" stroke="#1F6B2C" strokeWidth="3" strokeDasharray="12 8" strokeLinecap="round" opacity="0.65" />
        {/* white pith */}
        <path d="M 17,10 A 58 58 0 0 0 133,10 Z" fill="#F4FCE3" />
        {/* red flesh */}
        <path d="M 22,10 A 53 53 0 0 0 128,10 Z" fill="url(#melon-flesh-login)" />
        {/* flesh sheen */}
        <path d="M 30,18 Q 44,44 70,52" stroke="#FFC2C7" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        {/* flat cut edge */}
        <path d="M 10,10 L 140,10" stroke="#252525" strokeWidth="4.5" strokeLinecap="round" />

        {/* teardrop seeds */}
        <g fill="#252525">
          <path d="M 0,-7 C 5,-2 5,4 0,7 C -5,4 -5,-2 0,-7 Z" transform="translate(42,26) rotate(35)" />
          <path d="M 0,-7 C 5,-2 5,4 0,7 C -5,4 -5,-2 0,-7 Z" transform="translate(60,40) rotate(15)" />
          <path d="M 0,-7 C 5,-2 5,4 0,7 C -5,4 -5,-2 0,-7 Z" transform="translate(90,40) rotate(-15)" />
          <path d="M 0,-7 C 5,-2 5,4 0,7 C -5,4 -5,-2 0,-7 Z" transform="translate(108,26) rotate(-35)" />
          <path d="M 0,-7 C 5,-2 5,4 0,7 C -5,4 -5,-2 0,-7 Z" transform="translate(75,26)" />
        </g>
        {/* seed highlights */}
        <g fill="#FFFFFF" opacity="0.75">
          <ellipse cx="41" cy="24" rx="1.2" ry="2.2" />
          <ellipse cx="59" cy="38" rx="1.2" ry="2.2" />
          <ellipse cx="89" cy="38" rx="1.2" ry="2.2" />
          <ellipse cx="107" cy="24" rx="1.2" ry="2.2" />
          <ellipse cx="74" cy="24" rx="1.2" ry="2.2" />
        </g>

        {/* juice droplets */}
        <path d="M 126,-4 C 131,2 131,8 126,10 C 121,8 121,2 126,-4 Z" fill="#F2414F" stroke="#252525" strokeWidth="2" />
        <path d="M 144,22 C 147,26 147,30 144,32 C 141,30 141,26 144,22 Z" fill="#F2414F" stroke="#252525" strokeWidth="1.5" />
      </g>
    </g>

    {/* ===== Banana — bottom centre-right (centre ≈ 292,222) ===== */}
    <g transform="translate(292, 222) rotate(8) translate(-66, -45)">
      <g className="fx-float-a">
        <defs>
          <linearGradient id="banana-grad-login" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF08A" />
            <stop offset="50%" stopColor="#FFD93D" />
            <stop offset="100%" stopColor="#F2A81D" />
          </linearGradient>
          <clipPath id="banana-clip-login">
            <path d="M 20,20 C 30,86 80,112 118,76 C 86,76 48,58 32,16 Z" />
          </clipPath>
        </defs>

        {/* stem */}
        <path d="M 20,22 L 15,6 Q 21,1 28,5 L 33,18 Z" fill="#8A9A3B" stroke="#252525" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M 16,8 L 27,6" stroke="#252525" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

        {/* body */}
        <path
          d="M 20,20 C 30,86 80,112 118,76 C 86,76 48,58 32,16 Z"
          fill="url(#banana-grad-login)" stroke="#252525" strokeWidth="4.5" strokeLinejoin="round"
        />

        {/* ridges, shading and sheen — clipped inside the body */}
        <g clipPath="url(#banana-clip-login)" fill="none" strokeLinecap="round">
          <path d="M 28,28 C 42,72 84,96 114,78" stroke="#D99A12" strokeWidth="2" opacity="0.8" />
          <path d="M 26,40 C 40,82 84,104 116,80" stroke="#C98A0E" strokeWidth="2.5" opacity="0.55" />
          <path d="M 36,24 C 52,58 86,72 112,72" stroke="#FFF6B8" strokeWidth="4" opacity="0.8" />
        </g>

        {/* brown ripeness specks */}
        <g fill="#8A5A1E" opacity="0.8">
          <circle cx="58" cy="62" r="1.6" />
          <circle cx="76" cy="76" r="1.3" />
          <circle cx="46" cy="46" r="1.2" />
        </g>

        {/* dark tip */}
        <path d="M 112,72 Q 122,70 121,80 Q 117,82 112,78 Z" fill="#5A3A1A" stroke="#252525" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </g>

    {/* ===== Katana — rides the slash trail, drawn last so it sits on top ===== */}
    <g transform="translate(325, 150) rotate(-11)">
      <g className="fx-blade">
        <path
          d="M -90,-8 L 30,-5 L 55,0 L 30,5 L -90,4 Z"
          fill="url(#blade-shine-login)" stroke="#252525" strokeWidth="3.5" strokeLinejoin="round"
        />
        <rect x="30" y="-12" width="6" height="24" rx="3" fill="#D9363E" stroke="#252525" strokeWidth="2.5" />
        <rect x="36" y="-7" width="46" height="14" rx="2" fill="#252525" />
        <path
          d="M 44,-7 L 49,7 M 55,-7 L 60,7 M 66,-7 L 71,7"
          stroke="#FF8A3D" strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx="82" cy="0" r="4.5" fill="#FFD84D" stroke="#252525" strokeWidth="2" />
      </g>
    </g>
  </svg>

  {/* Click to slice tooltip */}
  <div className="absolute bottom-2 right-3 bg-white/95 px-2.5 py-1 rounded border-2 border-[#252525] shadow-pop-sm text-xs font-bold uppercase tracking-wider flex items-center gap-1">
    ⚔️ CLICK TO SLICE!
  </div>
</div>

            {/* Flavor Text */}
            <div className="mt-2 text-center lg:text-left">
              <p className="font-display font-black text-xl text-[#252525] uppercase tracking-wide">
                "YOUR BLADE IS WAITING. GRAB IT & SLICE!"
              </p>
              <p className="text-sm text-[#524B40] mt-1 max-w-md font-medium">
                Jump straight into High Score Arena, Blitz Tournaments, and
                seasonal blade master leaderboards.
              </p>
            </div>

            {/* Mini stats pill */}
            <div className="mt-4 flex items-center gap-4 bg-[#FFF4D6] px-4 py-2 rounded-xl comic-border shadow-pop-sm">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block w-6 h-6 rounded-full bg-[#D9363E] border-2 border-[#252525] text-[10px] text-white font-black text-center leading-5">
                  ⚔
                </span>
                <span className="inline-block w-6 h-6 rounded-full bg-[#FF8A3D] border-2 border-[#252525] text-[10px] text-white font-black text-center leading-5">
                  🍉
                </span>
                <span className="inline-block w-6 h-6 rounded-full bg-[#5CB85C] border-2 border-[#252525] text-[10px] text-white font-black text-center leading-5">
                  ⚡
                </span>
              </div>
              <p className="text-xs font-bold text-[#252525]">
                <span className="text-[#D9363E] font-black">14,290</span> fruit
                sliced in the last 10 minutes
              </p>
            </div>
          </section>

          {/* RIGHT COLUMN: PHYSICAL PAPER LOGIN CARD */}
          <section className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px]">
              {/* Back Kraft Sheet */}
              <div className="absolute inset-0 bg-[#E5CCA0] rounded-2xl comic-border-thick transform rotate-[-2.5deg] translate-y-3 translate-x-2 shadow-pop-lg pointer-events-none">
                <div className="absolute top-4 left-3 w-3 h-3 rounded-full bg-[#252525]/20"></div>
                <div className="absolute bottom-4 left-3 w-3 h-3 rounded-full bg-[#252525]/20"></div>
              </div>

              {/* Tape Sticker */}
              <div className="absolute -top-4 right-10 z-30 bg-[#FFD84D] border-2 border-[#252525] px-5 py-1 rotate-[6deg] shadow-pop-sm flex items-center gap-1.5 pointer-events-none">
                <span className="text-xs font-arcade text-[#252525] tracking-widest">
                  PLAYER ENTRY // 01
                </span>
              </div>

              {/* PRIMARY PAPER CARD */}
              <div className="relative paper-card-bg rounded-2xl comic-border-thick p-6 sm:p-8 shadow-pop-lg z-20">
                {/* Header */}
                <div className="border-b-4 border-[#252525]/20 pb-5 mb-6 text-center">
                  <div className="inline-block mb-1.5">
                    <span className="bg-[#D9363E] text-white text-[11px] font-arcade px-3 py-1 rounded-md uppercase tracking-wider shadow-pop-sm inline-block rotate-[-1deg]">
                      ARCADE ACCESS CARD
                    </span>
                  </div>
                  <h1 className="font-arcade text-3xl sm:text-4xl text-[#252525] uppercase tracking-tight mt-1">
                    ENTER THE STORM
                  </h1>
                  <p className="font-display font-semibold text-sm text-[#524B40] mt-1">
                    Log in to resume your combo streak & sharpen your blade.
                  </p>
                </div>

                {/* Form Error Banner */}
                {formError && (
                  <div
                    className="mb-5 p-3 rounded-xl bg-red-100 border-2 border-[#D9363E] text-[#D9363E] flex items-start gap-2.5 text-xs font-bold"
                    role="alert"
                  >
                    <svg
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{formError}</span>
                  </div>
                )}

                {/* FORM */}
                <form onSubmit={onSubmit} noValidate className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="playerEmail"
                        className="block font-arcade text-xs uppercase tracking-wider text-[#252525]"
                      >
                        PLAYER EMAIL
                      </label>
                      <span className="text-[10px] font-bold text-[#524B40] uppercase">
                        Arcade ID
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="playerEmail"
                        type="email"
                        autoComplete="username"
                        placeholder="player@slicestorm.com"
                        {...register("email")}
                        className="game-input w-full px-4 py-3 bg-[#FFFDF7] comic-border rounded-xl font-body font-bold text-sm text-[#252525] placeholder:text-stone-400 shadow-pop-sm transition-all"
                      />
                      <div className="absolute right-3.5 top-3.5 pointer-events-none text-[#252525]/40">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.email && (
                      <p className="text-xs font-bold text-[#D9363E] flex items-center gap-1 mt-1">
                        <span>⚠️</span> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="playerPassword"
                        className="block font-arcade text-xs uppercase tracking-wider text-[#252525]"
                      >
                        BLADE PASSWORD
                      </label>
                      <span className="font-display font-extrabold text-xs text-[#D9363E] tracking-tight">
                        Min 6 characters
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="playerPassword"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your secret combo..."
                        {...register("password")}
                        className="game-input w-full px-4 py-3 bg-[#FFFDF7] comic-border rounded-xl font-body font-bold text-sm text-[#252525] placeholder:text-stone-400 shadow-pop-sm transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowPassword(!showPassword);
                          playArcadeSound("click");
                        }}
                        aria-label="Toggle password visibility"
                        className="absolute right-3 top-2.5 p-1 text-[#252525]/60 hover:text-[#252525] focus:outline-none transition-colors cursor-pointer"
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs font-bold text-[#D9363E] flex items-center gap-1 mt-1">
                        <span>⚠️</span> {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={() => playArcadeSound("click")}
                      className="arcade-btn w-full py-4 px-6 bg-[#D9363E] text-[#FFF4D6] rounded-xl comic-border-thick shadow-pop font-arcade text-lg sm:text-xl tracking-wider uppercase flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer disabled:opacity-75"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none"></div>

                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className="animate-spin w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>UNSHEATHING BLADE...</span>
                        </div>
                      ) : (
                        <>
                          <span className="text-xl sm:text-2xl transform group-hover:rotate-12 transition-transform">
                            ⚔️
                          </span>
                          <span className="relative z-10">START SLICING</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Demo Auto-fill Button */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={fillNinjaDemo}
                      className="text-[11px] font-bold text-[#524B40] hover:text-[#252525] underline decoration-dashed underline-offset-4 transition-colors cursor-pointer"
                    >
                      ⚡ Quick Demo: Autofill Ninja Credentials
                    </button>
                  </div>
                </form>

                {/* Switch to Register */}
                <div className="mt-6 pt-5 border-t-4 border-[#252525]/20 text-center space-y-3">
                  <p className="font-display font-bold text-xs text-[#524B40] uppercase tracking-wider">
                    NEW TO THE STORM?
                  </p>
                  <Link
                    to="/register"
                    onClick={() => playArcadeSound("click")}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD84D] hover:bg-[#FFE066] text-[#252525] font-arcade text-sm uppercase tracking-wider comic-border shadow-pop-sm transition-all hover:-translate-y-0.5 active:translate-y-0.5"
                  >
                    <span>CREATE PLAYER PROFILE</span>
                    <span className="text-[#D9363E]">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* CELEBRATION MODAL */}
        {showSuccessModal && (
          <div
            className="fixed inset-0 bg-[#252525]/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
          >
            <div className="paper-card-bg rounded-3xl comic-border-thick p-8 max-w-md w-full text-center shadow-pop-lg transform transition-all animate-float-1">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#FFD84D] rounded-2xl comic-border shadow-pop flex items-center justify-center text-4xl rotate-3">
                ⚔️
              </div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#5CB85C] text-white font-arcade text-xs comic-border shadow-pop-sm uppercase mb-2">
                PLAYER AUTHENTICATED
              </span>
              <h2 className="font-arcade text-3xl sm:text-4xl text-[#252525] uppercase">
                WELCOME BACK!
              </h2>
              <p className="font-display font-bold text-sm text-[#524B40] mt-2">
                Your blade is unsheathed. Loading Dojo Arena...
              </p>

              {/* Progress bar */}
              <div className="mt-6 bg-[#EBD4A6] rounded-full h-4 comic-border overflow-hidden p-0.5 shadow-inset-pop">
                <div
                  className="bg-[#D9363E] h-full rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${successProgress}%` }}
                ></div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="arcade-btn inline-block w-full py-3 px-6 bg-[#FF8A3D] text-white font-arcade text-base rounded-xl comic-border shadow-pop uppercase tracking-wider cursor-pointer"
                >
                  ENTER ARENA NOW →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="mt-6 pt-4 border-t-2 border-[#252525]/15 flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-[#524B40] gap-2">
          <div className="flex items-center gap-2">
            <span className="font-arcade text-[#D9363E]">SLICE STORM ARCADE</span>
            <span>•</span>
            <span>High-Speed Fruit Action</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#252525] transition-colors cursor-pointer">
              Leaderboards
            </span>
            <span className="hover:text-[#252525] transition-colors cursor-pointer">
              Blade Controls
            </span>
            <span className="text-stone-400">© 2025 SLICE STORM</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;