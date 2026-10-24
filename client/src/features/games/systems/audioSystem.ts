// ─── audioSystem.ts — Compatibility Shim ─────────────────────────────────────
// All actual sound logic lives in shared/utils/arcadeAudio.ts
// Exposes mode-aware playback, volume adjustments, and background music controls.
// ─────────────────────────────────────────────────────────────────────────────
import {
  isSoundEnabled,
  initAudio,
  playSwoosh,
  playSplat,
  playCombo,
  playBombExplosion,
  playGameOverSound,
  startBackgroundMusic,
  stopBackgroundMusic,
  getMusicVolume,
  setMusicVolume,
  getSfxVolume,
  setSfxVolume,
  toggleSound,
  setSoundEnabled,
} from "../../../shared/utils/arcadeAudio";

/** Drop-in replacement for the ArcadeAudioEngine API */
export const arcadeAudioEngine = {
  get enabled() {
    return isSoundEnabled();
  },
  setEnabled(val: boolean) {
    setSoundEnabled(val);
  },
  toggleSound,
  init: initAudio,
  playSwoosh,
  playSplat,
  playCombo,
  playBomb: playBombExplosion,
  playGameOver: playGameOverSound,
  startBackgroundMusic,
  stopBackgroundMusic,
  getMusicVolume,
  setMusicVolume,
  getSfxVolume,
  setSfxVolume,
};
