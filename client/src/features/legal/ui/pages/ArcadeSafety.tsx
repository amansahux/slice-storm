import { PolicyLayout } from "../components/PolicyLayout";

const ArcadeSafety = () => {
  return (
    <PolicyLayout
      title="ARCADE SAFETY"
      subtitle="Sensory guidelines, ergonomic hygiene, and digital fruit-slashing wellness."
      badge="PLAYER SAFETY"
    >
      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            01
          </span>
          PHOTOSENSITIVITY &amp; SCREEN SHAKE NOTICE
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          SLICE STORM features fast particle animations, dynamic juice splatter, and minor camera shake upon bomb detonation. Players with light sensitivity or vestibular conditions should take frequent breaks.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            02
          </span>
          ERGONOMIC SWIPE TECHNIQUE
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          When playing on touchscreens, use relaxed finger strokes. Avoid excessive downward screen pressure. Rest your wrists every 15 minutes of continuous survival gameplay.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-['Bricolage_Grotesque',sans-serif] text-xl sm:text-2xl font-black text-[#b61929] uppercase flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#ffe07e] border border-[#1b1c1c] text-[#1b1c1c] flex items-center justify-center text-xs">
            03
          </span>
          COMMUNITY RESPECT &amp; NICKNAMES
        </h2>
        <p className="text-sm sm:text-base text-[#1b1c1c]">
          Hate speech, harassment, profanity, or defamatory player usernames on the global arcade leaderboard will result in immediate banishment from the dojo.
        </p>
      </section>
    </PolicyLayout>
  );
};

export default ArcadeSafety;
