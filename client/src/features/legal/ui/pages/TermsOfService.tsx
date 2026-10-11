import { PolicyLayout } from "../components/PolicyLayout";

const TermsOfService = () => {
  return (
    <PolicyLayout
      title="TERMS OF SERVICE"
      subtitle="The official rules of combat and sportsmanship inside the SLICE STORM arcade arena."
      badge="ARCADE CODE"
    >
      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            01
          </span>
          ACCEPTANCE OF THE ARENA RULES
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          By entering SLICE STORM, clicking <strong>INSERT COIN &amp; SLICE</strong>, or registering your Dojo Ninja ID, you agree to abide by all operational terms, fair play directives, and high-score validation algorithms governed by the Arcade Guild.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            02
          </span>
          FAIR BLADE PROTOCOL &amp; ANTI-CHEAT
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          Automated bot scripts, simulated pointer injectors, and memory modification of the HTML5 physics canvas are strictly prohibited. Slicing telemetry is monitored by our cryptographic server ledger. Violators forfeit their rank on the Global Leaderboard.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            03
          </span>
          VIRTUAL DOJO TOKENS &amp; BLADES
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          Any cosmetic blades, custom katana trails, or pulp splash textures earned or unlocked in the Arcade Store are strictly for game entertainment and hold no monetary exchange value outside the SLICE STORM ecosystem.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default TermsOfService;
