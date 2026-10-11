import { PolicyLayout } from "../components/PolicyLayout";

const PrivacyPolicy = () => {
  return (
    <PolicyLayout
      title="PRIVACY POLICY"
      subtitle="How your Ninja profile, match scores, and slicing telemetry are secured."
      badge="DATA PROTECTION"
    >
      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            01
          </span>
          INFORMATION WE COLLECT
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          We collect your Ninja Name, email address, password hashes (secured with bcrypt), and gameplay performance records including total score, max combo streaks, and fruit slicing count.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            02
          </span>
          LOCAL DEVICE STORAGE &amp; AUDIO
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          Your sound effects preference (SFX ON/OFF) is saved locally in your browser’s localStorage. Audio synthesis runs entirely in your client memory using the native Web Audio API without uploading microphone or audio input.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            03
          </span>
          ZERO THIRD-PARTY TRACKERS
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          SLICE STORM does not sell, rent, or trade your player logs to ad brokers. Your gameplay stays between you and the high score cabinet.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default PrivacyPolicy;
