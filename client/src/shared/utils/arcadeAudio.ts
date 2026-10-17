// ─── Unified Audio System ─────────────────────────────────────────────────────
// Single source of truth for ALL sounds — UI (navbar, clicks), game over, and BG music.
// Navbar toggleSound() → affects everything because it's the same flag.
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "slicestorm_sound_enabled";

let audioCtx: AudioContext | null = null;
let soundEnabled =
  typeof window !== "undefined"
    ? localStorage.getItem(STORAGE_KEY) !== "false"
    : true;

// ── Background Music Synth Engine ─────────────────────────────────────────────
let bgMusicMasterGain: GainNode | null = null;
let bgMusicIntervalId: number | null = null;
let isBgMusicRunning = false;

// ── Shared AudioContext (lazy) ────────────────────────────────────────────────
const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

// ── Public helpers ─────────────────────────────────────────────────────────────
export const isSoundEnabled = () => soundEnabled;

/** Toggle mute for everything; returns the new state. */
export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, String(soundEnabled));
  }
  if (soundEnabled) {
    playArcadeSound("click");
    if (bgMusicMasterGain && audioCtx) {
      bgMusicMasterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    }
  } else {
    if (bgMusicMasterGain && audioCtx) {
      bgMusicMasterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    }
  }
  return soundEnabled;
};

/**
 * Resume / create the AudioContext on user gesture (browser autoplay policy).
 */
export const initAudio = (): void => {
  getAudioContext();
};

// ── Background Music (Groovy Arcade Chiptune Loop) ───────────────────────────
export const startBackgroundMusic = (): void => {
  if (isBgMusicRunning) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  isBgMusicRunning = true;

  // Master Gain for background music
  if (!bgMusicMasterGain) {
    bgMusicMasterGain = ctx.createGain();
    bgMusicMasterGain.connect(ctx.destination);
  }

  // Set gain according to mute preference
  bgMusicMasterGain.gain.setValueAtTime(soundEnabled ? 0.15 : 0, ctx.currentTime);

  // Catchy arcade pentatonic bassline & melody steps (BPM: ~124, 16 steps)
  // Notes in Hz: C3 (130.81), Eb3 (155.56), F3 (174.61), G3 (196.00), Bb3 (233.08), C4 (261.63), Eb4 (311.13)
  const bassNotes = [130.81, 130.81, 155.56, 174.61, 130.81, 130.81, 196.00, 174.61, 116.54, 116.54, 130.81, 155.56, 174.61, 196.00, 233.08, 196.00];
  const leadNotes = [523.25, 0, 622.25, 0, 523.25, 587.33, 0, 659.25, 783.99, 0, 698.46, 0, 622.25, 523.25, 587.33, 0];

  let step = 0;
  const stepDuration = 0.125; // 16th notes at 120-125 bpm

  const scheduleStep = () => {
    if (!isBgMusicRunning) return;
    try {
      const now = ctx.currentTime;

      // 1. Bass synth voice
      const bassFreq = bassNotes[step % bassNotes.length];
      if (bassFreq > 0 && bgMusicMasterGain) {
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

      // 2. Lead chiptune voice (square wave with lowpass)
      const leadFreq = leadNotes[step % leadNotes.length];
      if (leadFreq > 0 && bgMusicMasterGain) {
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

      // 3. Subtle hi-hat / kick rhythm on 4 beats
      if (step % 4 === 0 && bgMusicMasterGain) {
        // Kick
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
      } else if (step % 2 === 1 && bgMusicMasterGain) {
        // Hi-hat noise tap
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

  bgMusicIntervalId = window.setInterval(scheduleStep, stepDuration * 1000);
};

export const stopBackgroundMusic = (): void => {
  isBgMusicRunning = false;
  if (bgMusicIntervalId !== null) {
    clearInterval(bgMusicIntervalId);
    bgMusicIntervalId = null;
  }
  if (bgMusicMasterGain && audioCtx) {
    try {
      bgMusicMasterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    } catch {}
  }
};

// ── UI Sounds ─────────────────────────────────────────────────────────────────
export const playArcadeSound = (
  type: "click" | "slash" | "error" | "success" | "blip" | "pop" | "bomb"
) => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === "click" || type === "blip") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
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
      gain.gain.setValueAtTime(0.25, now);
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
      gain.gain.setValueAtTime(0.3, now);
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
      gain.gain.setValueAtTime(0.4, now);
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
      gain.gain.setValueAtTime(0.18, now);
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
        noteGain.gain.setValueAtTime(0.18, now + delay);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.start(now + delay);
        noteOsc.stop(now + delay + dur);
      };
      playNote(523.25, 0, 0.14); // C5
      playNote(659.25, 0.12, 0.14); // E5
      playNote(783.99, 0.24, 0.3); // G5
    }
  } catch (err) {
    // Graceful fallback if audio is blocked by autoplay policy
    console.debug("Arcade audio playback suppressed:", err);
  }
};

// ── In-game Sounds (previously in audioSystem.ts) ────────────────────────────

/** Blade swoosh when a fruit is hit */
export const playSwoosh = (): void => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {}
};

/** Noise burst when juice splatters */
export const playSplat = (): void => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {}
};

/** Ascending arpeggio on combo */
export const playCombo = (): void => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + idx * 0.05 + 0.15
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.15);
    });
  } catch {}
};

/** Deep thud on bomb explosion */
export const playBombExplosion = (): void => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {}
};

/** Dramatic descending game over melody */
export const playGameOverSound = (): void => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Classic arcade descending sad flourish (Eb4 -> D4 -> Db4 -> C4)
    const notes = [
      { f: 311.13, delay: 0, dur: 0.22 },
      { f: 293.66, delay: 0.2, dur: 0.22 },
      { f: 277.18, delay: 0.4, dur: 0.22 },
      { f: 261.63, delay: 0.6, dur: 0.55 },
    ];

    notes.forEach(({ f, delay, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, now + delay);

      gain.gain.setValueAtTime(0.25, now + delay);
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
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.0);
  } catch {}
};
