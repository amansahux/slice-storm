import React, { memo } from "react";
import { Link } from "react-router";
import Logo from "../../../public/logo.png";
import { playArcadeSound } from "../utils/arcadeAudio";

interface FooterProps {
  variant?: "arcade" | "minimal";
}

const FOOTER_LINKS = [
  { label: "TERMS OF SERVICE", path: "/terms" },
  { label: "PRIVACY POLICY", path: "/privacy" },
  { label: "ARCADE SAFETY", path: "/safety" },
  { label: "CUSTOMER SUPPORT", path: "/support" },
] as const;

export const Footer: React.FC<FooterProps> = memo(({ variant = "arcade" }) => {
  return (
    <footer
      className={`w-full border-t-4 border-[#1b1c1c] z-30 transition-all select-none ${
        variant === "arcade"
          ? "bg-[#eae7e7] shadow-[0_-4px_0_0_#1b1c1c]"
          : "bg-white"
      }`}
    >
      <div className="w-full px-4 sm:px-6 py-4 md:py-5 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6 text-center lg:text-left">
          {/* Brand, Logo & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link
              to="/"
              onClick={() => playArcadeSound("blip")}
              className="flex items-center active:scale-95 transition-transform"
            >
              <img
                src={Logo}
                alt="SLICE STORM Logo"
                className="w-28 sm:w-36 h-auto object-contain drop-shadow-[1px_1px_0_#1b1c1c]"
              />
            </Link>

            <div className="hidden sm:block h-6 w-0.5 bg-[#1b1c1c]/20" />

            <span className="font-['Rubik',sans-serif] text-[11px] sm:text-xs font-bold text-[#5b403f] max-w-xs sm:max-w-none leading-relaxed">
              © 2024 SLICE STORM ARCADE. ALL RIGHTS RESERVED. JUICE RESPONSIBLY.
            </span>
          </div>

          {/* Fully Responsive Neo-Brutalist Policy Links */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => playArcadeSound("blip")}
                className="cursor-pointer font-['Rubik',sans-serif] text-[11px] sm:text-xs font-black uppercase text-[#1b1c1c] hover:text-[#b61929] bg-white sm:bg-transparent px-2.5 py-1 sm:p-0 rounded border sm:border-0 border-[#1b1c1c] shadow-[1px_1px_0px_#1b1c1c] sm:shadow-none hover:underline underline-offset-4 tracking-wider transition-all active:translate-y-[1px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Small screen cabinet status disclaimer */}
        <div className="mt-3 pt-3 border-t border-[#1b1c1c]/10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-['Rubik',sans-serif] font-bold text-[#5b403f] gap-1 text-center sm:text-left">
          <span>HIGH-SCORE TOURNAMENT ENGINE • 60 FPS HTML5 CANVAS</span>
          <span>ONLINE CABIN SERVER: STATUS HEALTHY 🟢</span>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
