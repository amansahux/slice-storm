// ─── audioSystem.ts — thin compatibility shim ─────────────────────────────────
// All actual sound logic now lives in shared/utils/arcadeAudio.ts so that the
// navbar mute toggle controls BOTH UI sounds AND in-game sounds via one flag.
// ─────────────────────────────────────────────────────────────────────────────
import {
  isSoundEnabled,
  initAudio,
  playSwoosh,
  playSplat,
  playCombo,
  playBombExplosion,
} from "../../../shared/utils/arcadeAudio";

/** Drop-in replacement for the old ArcadeAudioEngine class API */
export const arcadeAudioEngine = {
  get enabled() {
    return isSoundEnabled();
  },
  /** No-op setter — enable/disable via toggleSound() in arcadeAudio instead */
  setEnabled(_val: boolean) {
    // intentionally empty: state is managed by the unified module
  },
  init: initAudio,
  playSwoosh,
  playSplat,
  playCombo,
  playBomb: playBombExplosion,
};

