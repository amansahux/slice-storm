// ─── Unified Audio System ─────────────────────────────────────────────────────
// Single source of truth for ALL sounds — UI (navbar, clicks), game over, and BG music.
// Navbar toggleSound() → affects everything because it's the master mute flag.
// Dedicated volume sliders for Music and SFX provide granular player control.
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "slicestorm_sound_enabled";
const MUSIC_VOL_KEY = "slicestorm_music_volume";
const SFX_VOL_KEY = "slicestorm_sfx_volume";

let audioCtx: AudioContext | null = null;
let soundEnabled =
  typeof window !== "undefined"
    ? localStorage.getItem(STORAGE_KEY) !== "false"
    : true;

let musicVolume =
  typeof window !== "undefined"
    ? Math.max(0, Math.min(1, parseFloat(localStorage.getItem(MUSIC_VOL_KEY) ?? "0.65")))
    : 0.65;

let sfxVolume =
  typeof window !== "undefined"
    ? Math.max(0, Math.min(1, parseFloat(localStorage.getItem(SFX_VOL_KEY) ?? "0.75")))
    : 0.75;

// ── Background Music Synth Engine ─────────────────────────────────────────────
let bgMusicMasterGain: GainNode | null = null;
let bgMusicIntervalId: number | null = null;
let isBgMusicRunning = false;
let currentBgMusicMode: "classic" | "arcade" | "zen" = "arcade";
let userHasInteracted = false;
let autoUnlockAttached = false;

// ── Unlock Audio Context on ANY user interaction ─────────────────────────────
const unlockAudio = (): void => {
  if (userHasInteracted && audioCtx && audioCtx.state === "running") return;
  userHasInteracted = true;

  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  } else if (!audioCtx && typeof window !== "undefined") {
    getAudioContext();
  }
};

const attachAutoUnlockListeners = (): void => {
  if (typeof window === "undefined" || autoUnlockAttached) return;
  autoUnlockAttached = true;

  const events: (keyof WindowEventMap)[] = [
    "pointerdown",
    "touchstart",
    "mousedown",
    "keydown",
    "click",
    "pointermove",
  ];

  const handler = () => {
    unlockAudio();
    if (audioCtx && audioCtx.state === "running") {
      events.forEach((evt) => window.removeEventListener(evt, handler, { capture: true }));
    }
  };

  events.forEach((evt) => {
    window.addEventListener(evt, handler, { capture: true, passive: true });
  });
};

if (typeof window !== "undefined") {
  attachAutoUnlockListeners();
}

// ── Shared AudioContext (lazy & safe) ────────────────────────────────────────
const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      try {
        audioCtx = new AudioContextClass();
      } catch {
        return null;
      }
    }
  }

  if (audioCtx && audioCtx.state === "suspended" && userHasInteracted) {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
};

// ── Volume & Mute Public Helpers ──────────────────────────────────────────────
export const isSoundEnabled = () => soundEnabled;

export const getMusicVolume = (): number => musicVolume;
export const getSfxVolume = (): number => sfxVolume;

const updateMusicMasterGain = (targetModeVolume = 0.15) => {
  if (bgMusicMasterGain && audioCtx && audioCtx.state === "running") {
    try {
      const effectiveGain = soundEnabled ? targetModeVolume * musicVolume : 0;
      bgMusicMasterGain.gain.setValueAtTime(effectiveGain, audioCtx.currentTime);
    } catch {}
  }
};

export const AUDIO_CHANGE_EVENT = "slicestorm_audio_change";

export interface AudioSettingsState {
  soundEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export const getAudioSettings = (): AudioSettingsState => ({
  soundEnabled,
  musicVolume,
  sfxVolume,
});

const notifyAudioChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUDIO_CHANGE_EVENT, {
        detail: getAudioSettings(),
      })
    );
  }
};

export const setMusicVolume = (vol: number): void => {
  musicVolume = Math.max(0, Math.min(1, vol));
  if (typeof window !== "undefined") {
    localStorage.setItem(MUSIC_VOL_KEY, String(musicVolume));
  }
  updateMusicMasterGain(currentBgMusicMode === "zen" ? 0.22 : 0.15);
  notifyAudioChange();
};

export const setSfxVolume = (vol: number): void => {
  sfxVolume = Math.max(0, Math.min(1, vol));
  if (typeof window !== "undefined") {
    localStorage.setItem(SFX_VOL_KEY, String(sfxVolume));
  }
  notifyAudioChange();
};

export const setSoundEnabled = (val: boolean): void => {
  soundEnabled = val;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(soundEnabled));
  }
  updateMusicMasterGain(currentBgMusicMode === "zen" ? 0.22 : 0.15);
  notifyAudioChange();
};

/** Toggle master mute; returns the new state. */
export const toggleSound = (): boolean => {
  const next = !soundEnabled;
  setSoundEnabled(next);
  if (next) {
    playArcadeSound("click");
  }
  return next;
};

/** Resume / create AudioContext on user gesture */
export const initAudio = (): void => {
  unlockAudio();
};

// ── Background Music Synth Engine (Zen & Arcade Modes) ────────────────────────
export const startBackgroundMusic = (mode: "classic" | "arcade" | "zen" = "arcade"): void => {
  // If already running the requested mode, no need to recreate
  if (isBgMusicRunning && currentBgMusicMode === mode) return;

  // If running a different mode, stop it first
  if (isBgMusicRunning) {
    stopBackgroundMusic();
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  isBgMusicRunning = true;
  currentBgMusicMode = mode;

  // Master Gain for background music
  if (!bgMusicMasterGain) {
    try {
      bgMusicMasterGain = ctx.createGain();
      bgMusicMasterGain.connect(ctx.destination);
    } catch {
      return;
    }
  }

  const baseTrackGain = mode === "zen" ? 0.22 : 0.15;
  updateMusicMasterGain(baseTrackGain);

  if (mode === "zen") {
    // ── ZEN AMBIENT SYNTH ENGINE (Slow, soothing meditative loops) ─────────────
    // Pentatonic scale notes across octaves: C3, G3, C4, D4, E4, G4, A4, C5, E5
    const ambientChords = [
      [130.81, 196.00, 261.63, 329.63], // C-maj9
      [174.61, 220.00, 261.63, 349.23], // F-maj7
      [196.00, 246.94, 293.66, 392.00], // G-sus4
      [220.00, 261.63, 329.63, 440.00], // A-min7
    ];

    const chimeMelody = [523.25, 0, 659.25, 0, 783.99, 0, 587.33, 880.00, 0, 659.25, 0, 523.25, 0, 783.99, 659.25, 0];

    let zenStep = 0;
    const zenStepDuration = 0.32; // ~52 BPM peaceful tempo

    const scheduleZenStep = () => {
      if (!isBgMusicRunning || currentBgMusicMode !== "zen") return;
      if (!ctx || ctx.state !== "running" || !bgMusicMasterGain) {
        zenStep = (zenStep + 1) % 16;
        return;
      }

      try {
        const now = ctx.currentTime;
        updateMusicMasterGain(0.22);

        // 1. Soft Warm Pad chord every 4 steps
        if (zenStep % 4 === 0) {
          const chordIndex = Math.floor(zenStep / 4) % ambientChords.length;
          const notes = ambientChords[chordIndex];

          notes.forEach((freq) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(480, now);

            // Gentle attack and slow fade
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.045, now + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.001, now + zenStepDuration * 3.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(bgMusicMasterGain!);

            osc.start(now);
            osc.stop(now + zenStepDuration * 4);
          });
        }

        // 2. Gentle Singing Bowl / Bamboo Chime
        const chimeFreq = chimeMelody[zenStep % chimeMelody.length];
        if (chimeFreq > 0) {
          const chimeOsc = ctx.createOscillator();
          const chimeHarmonic = ctx.createOscillator();
          const chimeGain = ctx.createGain();

          chimeOsc.type = "sine";
          chimeOsc.frequency.setValueAtTime(chimeFreq, now);

          chimeHarmonic.type = "sine";
          chimeHarmonic.frequency.setValueAtTime(chimeFreq * 2.76, now); // Metallic chime overtone

          chimeGain.gain.setValueAtTime(0.001, now);
          chimeGain.gain.linearRampToValueAtTime(0.05, now + 0.04);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + zenStepDuration * 2.4);

          chimeOsc.connect(chimeGain);
          chimeHarmonic.connect(chimeGain);
          chimeGain.connect(bgMusicMasterGain);

          chimeOsc.start(now);
          chimeHarmonic.start(now);
          chimeOsc.stop(now + zenStepDuration * 2.5);
          chimeHarmonic.stop(now + zenStepDuration * 2.5);
        }

        zenStep = (zenStep + 1) % 16;
      } catch {}
    };

    bgMusicIntervalId = window.setInterval(scheduleZenStep, zenStepDuration * 1000);
  } else {
    // ── ARCADE / CLASSIC CHIPTUNE ENGINE (124 BPM) ───────────────────────────
    const bassNotes = [130.81, 130.81, 155.56, 174.61, 130.81, 130.81, 196.00, 174.61, 116.54, 116.54, 130.81, 155.56, 174.61, 196.00, 233.08, 196.00];
    const leadNotes = [523.25, 0, 622.25, 0, 523.25, 587.33, 0, 659.25, 783.99, 0, 698.46, 0, 622.25, 523.25, 587.33, 0];

    let step = 0;
    const stepDuration = 0.125;

    const scheduleArcadeStep = () => {
      if (!isBgMusicRunning || currentBgMusicMode === "zen") return;
      if (!ctx || ctx.state !== "running" || !bgMusicMasterGain) {
        step = (step + 1) % 16;
        return;
      }

      try {
        const now = ctx.currentTime;
        updateMusicMasterGain(0.15);

        // 1. Bass synth
        const bassFreq = bassNotes[step % bassNotes.length];
        if (bassFreq > 0) {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = "triangle";
          bassOsc.frequency.setValueAtTime(bassFreq, now);

          bassGain.gain.setValueAtTime(0.7, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.95);

          bassOsc.connect(bassGain);
          bassGain.connect(bgMusicMasterGain);

          bassOsc.start(now);
          bassOsc.stop(now + stepDuration);
        }

        // 2. Lead chiptune
        const leadFreq = leadNotes[step % leadNotes.length];
        if (leadFreq > 0) {
          const leadOsc = ctx.createOscillator();
          const leadGain = ctx.createGain();
          const leadFilter = ctx.createBiquadFilter();

          leadOsc.type = "square";
          leadOsc.frequency.setValueAtTime(leadFreq, now);

          leadFilter.type = "lowpass";
          leadFilter.frequency.setValueAtTime(1600, now);

          leadGain.gain.setValueAtTime(0.35, now);
          leadGain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);

          leadOsc.connect(leadFilter);
          leadFilter.connect(leadGain);
          leadGain.connect(bgMusicMasterGain);

          leadOsc.start(now);
          leadOsc.stop(now + stepDuration);
        }

        // 3. Kick / Hi-hat
        if (step % 4 === 0) {
          const kickOsc = ctx.createOscillator();
          const kickGain = ctx.createGain();
          kickOsc.type = "sine";
          kickOsc.frequency.setValueAtTime(120, now);
          kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);
          kickGain.gain.setValueAtTime(0.8, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          kickOsc.connect(kickGain);
          kickGain.connect(bgMusicMasterGain);
          kickOsc.start(now);
          kickOsc.stop(now + 0.09);
        } else if (step % 2 === 1) {
          const hatBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.03), ctx.sampleRate);
          const data = hatBuffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.2;
          const hat = ctx.createBufferSource();
          hat.buffer = hatBuffer;
          const hatFilter = ctx.createBiquadFilter();
          hatFilter.type = "highpass";
          hatFilter.frequency.setValueAtTime(5000, now);
          const hatGain = ctx.createGain();
          hatGain.gain.setValueAtTime(0.25, now);
          hatGain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
          hat.connect(hatFilter);
          hatFilter.connect(hatGain);
          hatGain.connect(bgMusicMasterGain);
          hat.start(now);
        }

        step = (step + 1) % 16;
      } catch {}
    };

    bgMusicIntervalId = window.setInterval(scheduleArcadeStep, stepDuration * 1000);
  }
};

export const stopBackgroundMusic = (): void => {
  isBgMusicRunning = false;
  if (bgMusicIntervalId !== null) {
    clearInterval(bgMusicIntervalId);
    bgMusicIntervalId = null;
  }
  if (bgMusicMasterGain && audioCtx && audioCtx.state === "running") {
    try {
      bgMusicMasterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    } catch {}
  }
};

// ── UI Sounds ─────────────────────────────────────────────────────────────────
export const playArcadeSound = (
  type: "click" | "slash" | "error" | "success" | "blip" | "pop" | "bomb"
) => {
  if (!soundEnabled || sfxVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const vol = sfxVolume;

    if (type === "click" || type === "blip") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.15 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "slash") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.2);
      gain.gain.setValueAtTime(0.25 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
      gain.gain.setValueAtTime(0.3 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "bomb") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.25);
      gain.gain.setValueAtTime(0.4 * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } else if (type === "error") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(110, now + 0.08);
      gain.gain.setValueAtTime(0.18 * vol, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "success") {
      const playNote = (freq: number, delay: number, dur: number) => {
        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        noteOsc.type = "triangle";
        noteOsc.frequency.setValueAtTime(freq, now + delay);
        noteGain.gain.setValueAtTime(0.18 * vol, now + delay);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.start(now + delay);
        noteOsc.stop(now + delay + dur);
      };
      playNote(523.25, 0, 0.14);
      playNote(659.25, 0.12, 0.14);
      playNote(783.99, 0.24, 0.3);
    }
  } catch (err) {
    console.debug("Arcade audio playback suppressed:", err);
  }
};

// ── In-game Gameplay Sounds ───────────────────────────────────────────────────

/** Blade swoosh when a fruit is hit */
export const playSwoosh = (isZen = false): void => {
  if (!soundEnabled || sfxVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (isZen) {
      // Soft gentle breeze whoosh
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.16);
      gain.gain.setValueAtTime(0.09 * sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.17);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);
      gain.gain.setValueAtTime(0.15 * sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.12);
    }
  } catch {}
};

/** Splash / splat when fruit is sliced */
export const playSplat = (isZen = false): void => {
  if (!soundEnabled || sfxVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;

    if (isZen) {
      // Gentle musical waterdrop / soft juicy chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(940, now + 0.08);

      gain.gain.setValueAtTime(0.12 * sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.11);
    } else {
      const bufferSize = Math.floor(ctx.sampleRate * 0.1);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3 * sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
};

/** Ascending chord / chime on combo */
export const playCombo = (isZen = false): void => {
  if (!soundEnabled || sfxVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;

    if (isZen) {
      // Ethereal wind chime chord (D-maj harmonic chord)
      const zenNotes = [587.33, 739.99, 880.00, 1174.66];
      zenNotes.forEach((freq, idx) => {
        if (!ctx || ctx.state !== "running") return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.11 * sfxVolume, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.29);
      });
    } else {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        if (!ctx || ctx.state !== "running") return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.2 * sfxVolume, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.15);
      });
    }
  } catch {}
};

/** Deep thud on bomb explosion (Arcade/Classic only) */
export const playBombExplosion = (): void => {
  if (!soundEnabled || sfxVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
    gain.gain.setValueAtTime(0.6 * sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.45);
  } catch {}
};

/** Game Over or Zen Session Completed sound */
export const playGameOverSound = (isZen = false): void => {
  if (!soundEnabled || sfxVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;

    if (isZen) {
      // Peaceful temple bell / meditation gong chime progression
      const bellFrequencies = [523.25, 659.25, 783.99, 1046.50];
      bellFrequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const harmonic = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        harmonic.type = "sine";
        harmonic.frequency.setValueAtTime(freq * 2.02, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.12 * sfxVolume, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.85);

        osc.connect(gain);
        harmonic.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        harmonic.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.9);
        harmonic.stop(now + idx * 0.12 + 0.9);
      });
    } else {
      const notes = [
        { f: 311.13, delay: 0, dur: 0.22 },
        { f: 293.66, delay: 0.2, dur: 0.22 },
        { f: 277.18, delay: 0.4, dur: 0.22 },
        { f: 261.63, delay: 0.6, dur: 0.55 },
      ];

      notes.forEach(({ f, delay, dur }) => {
        if (!ctx || ctx.state !== "running") return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(f, now + delay);

        gain.gain.setValueAtTime(0.25 * sfxVolume, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + dur);
      });

      // Low sub rumble
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.9);
      subGain.gain.setValueAtTime(0.35 * sfxVolume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 1.0);
    }
  } catch {}
};
