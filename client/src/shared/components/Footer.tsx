import React, { memo } from "react";
import { Link } from "react-router";

interface FooterProps {
  variant?: "arcade" | "minimal";
}

export const Footer: React.FC<FooterProps> = memo(({ variant = "arcade" }) => {
  return (
    <footer
      className={`w-full border-t-4 border-[#1b1c1c] z-30 transition-all select-none ${
        variant === "arcade"
          ? "bg-[#eae7e7] shadow-[0_-4px_0_0_#1b1c1c]"
          : "bg-white"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-3.5 gap-3 max-w-7xl mx-auto">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="font-['Titan_One','Bricolage_Grotesque',sans-serif] text-base sm:text-lg font-black text-[#b61929] uppercase tracking-tight hover:opacity-90 transition-opacity"
          >
            SLICE STORM
          </Link>
          <span className="font-['Rubik',sans-serif] text-xs font-bold text-[#5b403f]">
            © 2024 SLICE STORM ARCADE. ALL RIGHTS RESERVED. JUICE RESPONSIBLY.
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 font-['Rubik',sans-serif] text-xs text-[#5b403f] uppercase font-bold tracking-wider">
          <a
            href="#terms"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#b61929] transition-colors"
          >
            TERMS OF SERVICE
          </a>
          <a
            href="#privacy"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#b61929] transition-colors"
          >
            PRIVACY POLICY
          </a>
          <a
            href="#safety"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#b61929] transition-colors"
          >
            ARCADE SAFETY
          </a>
          <a
            href="#support"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#b61929] transition-colors"
          >
            SUPPORT
          </a>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
