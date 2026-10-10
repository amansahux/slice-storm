import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterForm } from "../../hooks/useAuth";
import {
  playArcadeSound,
  toggleSound,
  isSoundEnabled,
} from "../../../../shared/utils/arcadeAudio";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const {
    register,
    onSubmit,
    isSubmitting,
    formError,
    formState: { errors },
    generateRandomCallsign,
    watch,
  } = useRegisterForm({
    onSuccess: () => {
      setShowSuccessModal(true);
      playArcadeSound("success");
    },
  });

  const passwordValue = watch("password") || "";
  const emailValue = watch("email") || "";
  const playerNameValue = watch("name") || "";

  // Password Sharpness Calculation
  const getSharpness = (pwd: string) => {
    if (!pwd || pwd.length < 5) return { rank: "BLUNT", level: 1, color: "#D9363E" };
    if (pwd.length < 9) return { rank: "SHARP", level: 2, color: "#FF8A3D" };
    return { rank: "RAZOR BLADE ★", level: 3, color: "#5CB85C" };
  };

  const sharpness = getSharpness(passwordValue);

  // Email format check for live checkmark
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.trim());

  // Countdown timer for celebration modal
  useEffect(() => {
    if (!showSuccessModal) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showSuccessModal, navigate]);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleFruitClick = (e: React.MouseEvent) => {
    playArcadeSound("slash");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newSpark = { id: Date.now(), x, y };
    setSparks((prev) => [...prev, newSpark]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
    }, 800);
  };

  return (
    <div className="paper-pattern text-[#252525] min-h-screen relative overflow-x-hidden selection:bg-[#FF8A3D] selection:text-white font-body flex flex-col justify-between">
      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* TOP HEADER / CORNER ACTIONS */}
        <header className="flex items-center justify-between pb-4 w-full">
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
            {/* Sound FX Toggle Button */}
            <button
              onClick={handleSoundToggle}
              aria-label="Toggle sound effects"
              className="px-3 py-1.5 rounded-xl bg-[#FFF4D6] hover:bg-white comic-border shadow-pop-sm flex items-center gap-2 font-display font-bold text-xs text-[#252525] transition-transform active:translate-y-0.5 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {soundOn ? "volume_up" : "volume_off"}
              </span>
              <span className="hidden sm:inline">
                {soundOn ? "FX: ON" : "FX: OFF"}
              </span>
            </button>

            <Link
              to="/login"
              onClick={() => playArcadeSound("click")}
              className="px-3.5 py-1.5 rounded-xl bg-[#FFD84D] hover:bg-yellow-400 font-arcade text-xs text-[#252525] comic-border shadow-pop-sm tracking-wide transition-all hover:-translate-y-0.5"
            >
              ALREADY REGISTERED?
            </Link>
          </div>
        </header>

        {/* ================= MAIN ARCADE ARENA ================= */}
        <main className="my-auto py-4">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* ================= LEFT COLUMN: THE GAME WORLD ================= */}
            <section className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 relative">
              <div className="absolute -top-4 -left-6 hidden xl:block animate-drift pointer-events-none">
                <span className="inline-block px-3 py-1 bg-[#5CB85C] text-white font-bold text-xs uppercase border-2 border-[#252525] shadow-[3px_3px_0_0_#252525] rounded-full rotate-[-6deg]">
                  ★ CRISP ARCADE PHYSICS
                </span>
              </div>

            {/* Logo Marquee */}
            <div className="animate-bobble flex flex-col items-center lg:items-start">
              <img
                alt="SLICE STORM Hero Marquee"
                className="w-full max-w-[420px] h-auto drop-shadow-[5px_5px_0_0_#252525] mb-2"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WUw9lRDvhi-UhWzlX8T0Nc0xAWYblN7QH7-5o7Mv73IPZ7qFY0KD-nrkyDCwKEQuhMZCzJo0f2t6H1g68n5XWWPIgZBqklKhPcsBwU6M4OKyymDlXE0pPiGpcklBOE_kyy3IpRTpELlPRex0pygwgAqW66VvHzN3RA7G2EOM_6wj3rKW-MTyTrAmC5EPnxZzDhmd1vnLVCcJKbOqOEfWHAsHLG44izuG-IRgbgAzg8kus1U8jLmozJYg0"
              />
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#FF8A3D] text-white border-[3px] border-[#252525] shadow-[4px_4px_0_0_#252525] rounded-md font-display font-black text-lg tracking-wide uppercase rotate-[-1.5deg]">
                <span className="material-symbols-outlined text-[24px]">
                  sports_esports
                </span>
                <span>SLICE • COMBO • SURVIVE</span>
              </div>
            </div>

            {/* Tactile Cartoon Fruit Canvas Box */}
            <div
              onClick={handleFruitClick}
              className="w-full max-w-[480px] h-[280px] sm:h-[320px] bg-[#FFF4D6] rounded-xl border-4 border-[#252525] shadow-[6px_6px_0_0_#252525] relative overflow-hidden flex items-center justify-center select-none group cursor-pointer"
              title="Click fruit to slice!"
            >
              <div className="absolute inset-0 opacity-20 bg-[repeating-conic-gradient(#252525_0deg_15deg,#FFF4D6_15deg_30deg)]"></div>

              {/* Floating Sparks */}
              {sparks.map((s) => (
                <span
                  key={s.id}
                  style={{ left: s.x, top: s.y }}
                  className="absolute text-[#D9363E] font-black animate-ping pointer-events-none text-sm z-30"
                >
                  +100 JUICE!
                </span>
              ))}

              <svg
                className="w-full h-full p-4 relative z-10"
                fill="none"
                viewBox="0 0 500 320"
              >
                {/* Watermelon Slice */}
                <g transform="translate(60, 110) rotate(-18)">
                  <path
                    d="M 0 100 A 90 90 0 0 0 160 100 Z"
                    fill="#5CB85C"
                    stroke="#252525"
                    strokeLinejoin="round"
                    strokeWidth="5"
                  />
                  <path
                    d="M 12 96 A 75 75 0 0 0 148 96 Z"
                    fill="#D9363E"
                    stroke="#252525"
                    strokeWidth="4"
                  />
                  <circle cx="50" cy="85" fill="#252525" r="4" />
                  <circle cx="80" cy="88" fill="#252525" r="4" />
                  <circle cx="110" cy="85" fill="#252525" r="4" />
                </g>

                {/* Citrus Wedge */}
                <g transform="translate(210, 45) rotate(15)">
                  <path
                    d="M 10 90 A 80 80 0 0 1 150 90 Z"
                    fill="#FF8A3D"
                    stroke="#252525"
                    strokeWidth="5"
                  />
                  <path
                    d="M 22 84 A 65 65 0 0 1 138 84 Z"
                    fill="#FFE066"
                    stroke="#252525"
                    strokeWidth="3"
                  />
                  <path
                    d="M 35 80 L 80 35 L 75 80 Z"
                    fill="#FF8A3D"
                    stroke="#252525"
                    strokeWidth="2"
                  />
                  <path
                    d="M 85 80 L 80 35 L 125 80 Z"
                    fill="#FF8A3D"
                    stroke="#252525"
                    strokeWidth="2"
                  />
                </g>

                {/* Banana */}
                <g transform="translate(190, 175) rotate(-8)">
                  <path
                    d="M 20 40 C 60 70, 120 70, 170 30 C 130 50, 70 50, 20 40 Z"
                    fill="#FFD84D"
                    stroke="#252525"
                    strokeLinejoin="round"
                    strokeWidth="5"
                  />
                  <path
                    d="M 170 30 L 180 25 L 175 35 Z"
                    fill="#5CB85C"
                    stroke="#252525"
                    strokeWidth="3"
                  />
                </g>

                {/* Pineapple */}
                <g transform="translate(320, 80) rotate(12)">
                  <polygon
                    fill="#5CB85C"
                    points="40,30 20,0 50,20 60,-10 70,20 100,0 80,30"
                    stroke="#252525"
                    strokeWidth="4"
                  />
                  <ellipse
                    cx="60"
                    cy="85"
                    fill="#FFD84D"
                    rx="42"
                    ry="55"
                    stroke="#252525"
                    strokeWidth="5"
                  />
                  <path
                    d="M 30 60 L 90 110 M 30 110 L 90 60 M 25 85 L 95 85"
                    stroke="#252525"
                    strokeWidth="3"
                  />
                </g>

                {/* Katana Slash streak */}
                <path
                  d="M 0 310 Q 250 180 500 20"
                  opacity="0.9"
                  stroke="#FFFFFF"
                  strokeLinecap="round"
                  strokeWidth="18"
                />
                <path
                  d="M 10 315 Q 250 185 490 25"
                  stroke="#FFD84D"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <g transform="translate(180, 70) rotate(-34)">
                  <path
                    d="M 0 0 L 220 0 C 235 0, 245 4, 250 12 L 0 12 Z"
                    fill="#E2E8F0"
                    stroke="#252525"
                    strokeWidth="4"
                  />
                  <rect
                    fill="#FFD84D"
                    height="28"
                    rx="2"
                    stroke="#252525"
                    strokeWidth="4"
                    width="12"
                    x="-10"
                    y="-8"
                  />
                  <rect
                    fill="#D9363E"
                    height="18"
                    rx="3"
                    stroke="#252525"
                    strokeWidth="4"
                    width="55"
                    x="-65"
                    y="-3"
                  />
                </g>
              </svg>

              <div className="absolute bottom-2 right-3 bg-white/95 px-2.5 py-1 rounded border-2 border-[#252525] shadow-[2px_2px_0_0_#252525] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#D9363E]">
                  swords
                </span>{" "}
                CLICK TO SLICE!
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="px-3.5 py-1.5 bg-[#FFD84D] text-[#252525] border-[3px] border-[#252525] shadow-[3px_3px_0_0_#252525] rounded font-bold text-xs uppercase flex items-center gap-1.5 rotate-[-1deg]">
                <span className="material-symbols-outlined text-[18px]">
                  bolt
                </span>
                <span>5X COMBO BONUS</span>
              </div>
              <div className="px-3.5 py-1.5 bg-[#5CB85C] text-white border-[3px] border-[#252525] shadow-[3px_3px_0_0_#252525] rounded font-bold text-xs uppercase flex items-center gap-1.5 rotate-[1.5deg]">
                <span className="material-symbols-outlined text-[18px]">
                  redeem
                </span>
                <span>DAILY BLADE REWARD</span>
              </div>
              <div className="px-3.5 py-1.5 bg-[#FF8A3D] text-white border-[3px] border-[#252525] shadow-[3px_3px_0_0_#252525] rounded font-bold text-xs uppercase flex items-center gap-1.5 rotate-[-2deg]">
                <span className="material-symbols-outlined text-[18px]">
                  speed
                </span>
                <span>INSTANT MATCHMAKING</span>
              </div>
            </div>
          </section>

          {/* ================= RIGHT COLUMN: PLAYER REGISTRATION CARD ================= */}
          <section className="lg:col-span-6 w-full max-w-xl mx-auto">
            <div className="relative bg-[#FFFDF7] rounded-2xl border-4 border-[#252525] shadow-[8px_8px_0_0_#252525] p-6 sm:p-8">
              {/* Sticker */}
              <div className="absolute -top-4 right-6 bg-[#FFD84D] border-2 border-dashed border-[#252525] shadow-[3px_3px_0_0_#252525] px-3 py-1 font-bold text-xs uppercase tracking-wider rotate-[3deg] select-none">
                ★ PLAYER CARD #01 ★
              </div>

              {/* Accent Strip */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-dashed border-[#252525]">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full bg-[#D9363E] border-2 border-[#252525]"></span>
                  <span className="inline-block w-4 h-4 rounded-full bg-[#FF8A3D] border-2 border-[#252525]"></span>
                  <span className="inline-block w-4 h-4 rounded-full bg-[#5CB85C] border-2 border-[#252525]"></span>
                  <span className="font-bold text-xs text-[#524B40] uppercase ml-1">
                    REGISTRATION DOCK
                  </span>
                </div>
                <span className="font-bold text-xs text-[#252525] uppercase bg-[#E4E2E1] px-2 py-0.5 rounded border border-[#252525]">
                  CREDITS: 00
                </span>
              </div>

              {/* Header Titles */}
              <div className="text-left mb-6">
                <h1 className="text-2xl sm:text-3xl font-display font-black text-[#252525] uppercase tracking-tight flex items-center gap-2">
                  <span>CREATE YOUR PLAYER</span>
                  <span className="material-symbols-outlined text-[#D9363E] text-3xl">
                    sports_martial_arts
                  </span>
                </h1>
                <p className="text-sm text-[#524B40] mt-1 font-medium">
                  Step into the storm, carve your gamer legacy, and start slicing.
                </p>
              </div>

              {/* Form Error */}
              {formError && (
                <div
                  className="mb-4 p-3 rounded-xl bg-red-100 border-2 border-[#D9363E] text-[#D9363E] flex items-start gap-2.5 text-xs font-bold"
                  role="alert"
                >
                  <span className="material-symbols-outlined text-lg">error</span>
                  <span>{formError}</span>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={onSubmit} noValidate className="space-y-4">
                {/* Field 1: PLAYER NAME */}
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="playerName"
                      className="block font-bold text-xs text-[#252525] uppercase"
                    >
                      PLAYER NAME / CALLSIGN <span className="text-[#D9363E]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomCallsign}
                      className="font-bold text-xs text-[#D9363E] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        casino
                      </span>{" "}
                      RANDOMIZE
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]">
                      <span className="material-symbols-outlined text-xl">
                        badge
                      </span>
                    </div>
                    <input
                      id="playerName"
                      type="text"
                      placeholder="e.g. NinjaSlice99"
                      {...register("name")}
                      className="arcade-input w-full pl-11 pr-4 py-3 bg-white border-[3px] border-[#252525] rounded-xl font-bold text-sm text-[#252525] placeholder:text-gray-400 shadow-[2px_2px_0_0_#252525] transition-all"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs font-bold text-[#D9363E] pt-0.5">
                      ⚠️ {errors.name.message}
                    </p>
                  )}
                  <p className="text-[11px] font-bold text-[#FF8A3D] tracking-wide uppercase pt-0.5">
                    Popular: FruitBreaker, StormKatana, BerrySlayer
                  </p>
                </div>

                {/* Field 2: EMAIL */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="playerEmail"
                    className="block font-bold text-xs text-[#252525] uppercase"
                  >
                    PLAYER EMAIL <span className="text-[#D9363E]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]">
                      <span className="material-symbols-outlined text-xl">
                        mail
                      </span>
                    </div>
                    <input
                      id="playerEmail"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className="arcade-input w-full pl-11 pr-10 py-3 bg-white border-[3px] border-[#252525] rounded-xl font-bold text-sm text-[#252525] placeholder:text-gray-400 shadow-[2px_2px_0_0_#252525] transition-all"
                    />
                    {isEmailValid && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-[#5CB85C] font-bold text-xl">
                          check_circle
                        </span>
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-xs font-bold text-[#D9363E] pt-0.5">
                      ⚠️ {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Field 3: PASSWORD */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="playerPassword"
                    className="block font-bold text-xs text-[#252525] uppercase"
                  >
                    BLADE PASSWORD <span className="text-[#D9363E]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]">
                      <span className="material-symbols-outlined text-xl">
                        lock
                      </span>
                    </div>
                    <input
                      id="playerPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      {...register("password")}
                      className="arcade-input w-full pl-11 pr-12 py-3 bg-white border-[3px] border-[#252525] rounded-xl font-bold text-sm text-[#252525] placeholder:text-gray-400 shadow-[2px_2px_0_0_#252525] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword(!showPassword);
                        playArcadeSound("click");
                      }}
                      aria-label="Toggle password view"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#252525] hover:text-[#D9363E] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-bold text-[#D9363E] pt-0.5">
                      ⚠️ {errors.password.message}
                    </p>
                  )}

                  {/* Blade Sharpness Meter */}
                  <div className="pt-1 space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold uppercase">
                      <span className="text-[#524B40]">SHARPNESS METER:</span>
                      <span
                        style={{ color: sharpness.color }}
                        className="font-black"
                      >
                        {sharpness.rank}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-[#E4E2E1] border-2 border-[#252525] rounded-full overflow-hidden flex">
                      <div
                        className={`h-full w-1/3 border-r border-[#252525] transition-all duration-300 ${sharpness.level >= 1 ? "bg-[#D9363E]" : "bg-transparent"}`}
                      ></div>
                      <div
                        className={`h-full w-1/3 border-r border-[#252525] transition-all duration-300 ${sharpness.level >= 2 ? "bg-[#FF8A3D]" : "bg-transparent"}`}
                      ></div>
                      <div
                        className={`h-full w-1/3 transition-all duration-300 ${sharpness.level >= 3 ? "bg-[#5CB85C]" : "bg-transparent"}`}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Field 4: CONFIRM PASSWORD */}
                <div className="space-y-1 text-left">
                  <label
                    htmlFor="confirmPassword"
                    className="block font-bold text-xs text-[#252525] uppercase"
                  >
                    CONFIRM BLADE PASSWORD <span className="text-[#D9363E]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#252525]">
                      <span className="material-symbols-outlined text-xl">
                        verified_user
                      </span>
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      {...register("confirmPassword")}
                      className="arcade-input w-full pl-11 pr-12 py-3 bg-white border-[3px] border-[#252525] rounded-xl font-bold text-sm text-[#252525] placeholder:text-gray-400 shadow-[2px_2px_0_0_#252525] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                        playArcadeSound("click");
                      }}
                      aria-label="Toggle confirm password view"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#252525] hover:text-[#D9363E] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs font-bold text-[#D9363E] pt-0.5">
                      ⚠️ {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => playArcadeSound("click")}
                    className="w-full py-4 px-6 bg-gradient-to-b from-[#FF5A65] via-[#D9363E] to-[#A81C23] text-white border-4 border-[#252525] shadow-[0_6px_0_0_#80141A,0_10px_0_0_#252525] rounded-xl font-display font-black text-lg sm:text-xl uppercase tracking-wider hover:-translate-y-1 hover:shadow-[0_8px_0_0_#80141A,0_12px_0_0_#252525] active:translate-y-1 active:shadow-[0_2px_0_0_#80141A,0_4px_0_0_#252525] transition-all flex items-center justify-center gap-3 group relative overflow-hidden cursor-pointer disabled:opacity-75"
                  >
                    <div className="absolute inset-0 w-1/3 bg-white/25 skew-x-[-30deg] animate-shimmer pointer-events-none"></div>
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined animate-spin-blade text-2xl">
                          swords
                        </span>
                        <span>FORGING BLADE...</span>
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
                          bolt
                        </span>
                        <span>JOIN THE STORM</span>
                        <span className="material-symbols-outlined text-2xl group-hover:-rotate-12 transition-transform">
                          swords
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Sub-footer Switch to Login */}
              <div className="mt-6 pt-5 border-t-2 border-dashed border-[#252525] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <span className="text-xs font-bold text-[#524B40] uppercase">
                  Already have a player account?
                </span>
                <Link
                  to="/login"
                  onClick={() => playArcadeSound("click")}
                  className="px-4 py-1.5 bg-[#FFD84D] text-[#252525] border-2 border-[#252525] shadow-[2px_2px_0_0_#252525] rounded font-bold text-xs uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0.5 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    key
                  </span>
                  <span>[ LOGIN ]</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ================= CELEBRATION MODAL ================= */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 bg-[#252525]/85 flex items-center justify-center p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#FFFDF7] border-4 border-[#252525] shadow-[12px_12px_0_0_#FFD84D] rounded-2xl max-w-md w-full p-6 text-center relative overflow-hidden animate-bobble">
            <div className="bg-[#D9363E] text-white border-b-4 border-[#252525] -mx-6 -mt-6 py-3 px-4 mb-6 shadow-[0_4px_0_0_#252525]">
              <h2 className="font-display font-black text-lg tracking-wide uppercase">
                ★ LEVEL 1 ENTERED ★
              </h2>
            </div>

            <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#FFD84D] rounded-full border-4 border-[#252525] shadow-[4px_4px_0_0_#252525] animate-ping opacity-30"></div>
              <div className="w-20 h-20 bg-[#5CB85C] rounded-full border-4 border-[#252525] shadow-[4px_4px_0_0_#252525] flex items-center justify-center text-white text-4xl animate-spin-blade">
                <span className="material-symbols-outlined text-[44px]">
                  sports_martial_arts
                </span>
              </div>
            </div>

            <h3 className="font-display font-black text-2xl text-[#252525] uppercase tracking-tight mb-2">
              JOINED THE STORM!
            </h3>
            <p className="text-sm text-[#524B40] font-semibold mb-6">
              Welcome, {playerNameValue || "Ninja"}! Blade forged and loaded
              into the queue.
            </p>

            <div className="p-3 bg-[#FFF4D6] border-2 border-[#252525] rounded-xl font-bold text-xs text-[#252525] mb-6 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[#D9363E]">
                timer
              </span>
              <span>
                REDIRECTING TO PLAYFIELD IN{" "}
                <span className="text-[#D9363E] font-black text-base">
                  {countdown}
                </span>
                s...
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 bg-[#5CB85C] text-white font-display font-black text-base uppercase border-[3px] border-[#252525] shadow-[4px_4px_0_0_#252525] rounded-lg hover:-translate-y-0.5 active:translate-y-0.5 cursor-pointer"
            >
              START SLICING NOW!
            </button>
          </div>
        </div>
      )}

      {/* ARCADE PAGE FOOTER */}
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

export default Register;