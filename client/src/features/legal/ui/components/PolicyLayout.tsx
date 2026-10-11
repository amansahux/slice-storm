import React, { memo } from "react";
import { Link } from "react-router";

interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  badge: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export const PolicyLayout: React.FC<PolicyLayoutProps> = memo(({
  title,
  subtitle,
  badge,
  lastUpdated = "OCTOBER 2024",
  children,
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 md:px-8 bg-[#F7E8C3] paper-pattern">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-['Rubik',sans-serif] font-black uppercase text-[#5b403f]">
          <Link to="/" className="hover:text-[#b61929] transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-[#b61929]">{title}</span>
        </div>

        {/* Header Hero Box */}
        <div className="bg-[#FFF4D6] border-4 border-[#1b1c1c] rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_#1b1c1c] relative outline outline-4 outline-white">
          <div className="inline-flex items-center gap-1.5 bg-[#ffe07e] text-[#231b00] border-2 border-[#1b1c1c] px-3 py-1 rounded-md text-xs font-black uppercase shadow-[2px_2px_0px_#1b1c1c] mb-3">
            <span>🛡️</span>
            <span>{badge}</span>
          </div>

          <h1 className="font-['Titan_One','Bricolage_Grotesque',sans-serif] text-3xl sm:text-5xl text-[#b61929] uppercase tracking-tight drop-shadow-[1px_1px_0px_#1b1c1c]">
            {title}
          </h1>

          <p className="font-['Rubik',sans-serif] text-sm sm:text-base text-[#5b403f] font-bold mt-2 max-w-2xl leading-relaxed">
            {subtitle}
          </p>

          <div className="mt-4 pt-3 border-t-2 border-[#1b1c1c]/15 flex items-center justify-between text-xs font-['Rubik',sans-serif] font-bold text-[#5b403f]">
            <span>LAST REVISED: {lastUpdated}</span>
            <span>SLICE STORM ARCADE CORP</span>
          </div>
        </div>

        {/* Policy Content Card */}
        <div className="bg-white border-4 border-[#1b1c1c] rounded-2xl p-6 sm:p-10 shadow-[6px_6px_0px_#1b1c1c] font-['Rubik',sans-serif] text-[#1b1c1c] space-y-8 leading-relaxed">
          {children}
        </div>

        {/* Bottom CTA Back to Arena */}
        <div className="bg-[#FFF4D6] border-3 border-[#1b1c1c] p-4 rounded-xl shadow-[4px_4px_0px_#1b1c1c] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-['Bricolage_Grotesque',sans-serif] text-lg font-black uppercase text-[#1b1c1c]">
              READY TO SLICE INSTEAD?
            </div>
            <div className="text-xs text-[#5b403f] font-bold">
              Test your reflexes with zero latency in the fruit arena.
            </div>
          </div>
          <Link
            to="/arcade"
            className="w-full sm:w-auto bg-[#d9363e] hover:bg-[#b61929] text-white border-2 border-[#1b1c1c] px-6 py-2.5 rounded-lg shadow-[3px_3px_0px_#1b1c1c] active:translate-x-[1px] active:translate-y-[1px] font-black uppercase text-sm text-center transition-all"
          >
            PLAY ARCADE NOW ⚔️
          </Link>
        </div>
      </div>
    </div>
  );
});

PolicyLayout.displayName = "PolicyLayout";
