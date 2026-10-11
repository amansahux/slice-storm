import { PolicyLayout } from "../components/PolicyLayout";

const CustomerSupport = () => {
  return (
    <PolicyLayout
      title="CUSTOMER SUPPORT"
      subtitle="Need blade calibration, account assistance, or bug reports? The Dojo Senseis are on call."
      badge="HELP DESK"
    >
      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            01
          </span>
          DISCORD &amp; LIVE COMMUNITY
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          Connect with tournament champions, discuss optimal blade trails, and report glitches live in our community discord guild or email us at <strong>support@slicestorm.arcade</strong>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            02
          </span>
          COMMON CABIN TROUBLESHOOTING
        </h2>
        <div className="space-y-2 text-sm text-[#1b1c1c]">
          <p>
            • <strong>Audio Not Playing:</strong> Modern browsers require user interaction before playing audio. Click the <strong>SFX toggle</strong> in the header once to initialize the Web Audio API.
          </p>
          <p>
            • <strong>Swipe Lag / Stutter:</strong> Ensure Hardware Acceleration is enabled in your browser settings for smooth 60 FPS HTML5 Canvas rendering.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            03
          </span>
          SCORE DISPUTES &amp; BUG BOUNTY
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          If a score failed to sync to your profile after completing a survival match, include your Ninja ID and screenshot when filing a ticket.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default CustomerSupport;
