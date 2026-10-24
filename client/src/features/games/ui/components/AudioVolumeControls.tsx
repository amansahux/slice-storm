import React, { memo, useState, useCallback } from "react";
import { Volume2, VolumeX, Music, Zap } from "lucide-react";
import {
  getMusicVolume,
  setMusicVolume,
  getSfxVolume,
  setSfxVolume,
  isSoundEnabled,
  setSoundEnabled,
} from "../../../../shared/utils/arcadeAudio";

interface AudioVolumeControlsProps {
  className?: string;
  compact?: boolean;
}

export const AudioVolumeControls: React.FC<AudioVolumeControlsProps> = memo(
  ({ className = "", compact = false }) => {
    const [enabled, setEnabledState] = useState<boolean>(() => isSoundEnabled());
    const [musicVol, setMusicVolState] = useState<number>(() =>
      Math.round(getMusicVolume() * 100)
    );
    const [sfxVol, setSfxVolState] = useState<number>(() =>
      Math.round(getSfxVolume() * 100)
    );

    const handleToggleMute = useCallback(() => {
      const next = !enabled;
      setSoundEnabled(next);
      setEnabledState(next);
    }, [enabled]);

    const handleMusicChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setMusicVolState(val);
        setMusicVolume(val / 100);
      },
      []
    );

    const handleSfxChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        setSfxVolState(val);
        setSfxVolume(val / 100);
      },
      []
    );

    return (
      <div
        className={`bg-white/95 border-2 border-[#1b1c1c] rounded-lg p-2.5 sm:p-3 shadow-[2px_2px_0px_#1b1c1c] text-left select-none ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleMute}
              className={`p-1 rounded border border-[#1b1c1c] cursor-pointer transition-colors ${
                enabled
                  ? "bg-[#34C759] text-white shadow-[1px_1px_0px_#1b1c1c]"
                  : "bg-gray-200 text-gray-500"
              }`}
              title={enabled ? "Mute All Audio" : "Unmute Audio"}
            >
              {enabled ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              )}
            </button>
            <span className="font-['Rubik',sans-serif] text-[11px] sm:text-xs font-black uppercase text-[#1b1c1c]">
              Audio Controls
            </span>
          </div>

          <span
            className={`text-[10px] font-['Rubik',sans-serif] font-black uppercase px-1.5 py-0.5 rounded border border-[#1b1c1c] ${
              enabled
                ? "bg-[#ffe07e] text-[#231b00]"
                : "bg-red-100 text-red-600"
            }`}
          >
            {enabled ? "ACTIVE" : "MUTED"}
          </span>
        </div>

        <div className={`space-y-2 text-[10px] sm:text-xs font-['Rubik',sans-serif] font-bold ${compact ? "space-y-1.5" : ""}`}>
          {/* Music Volume Slider */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[#5b403f] w-16 shrink-0">
              <Music className="w-3 h-3 text-[#b61929]" />
              <span>Music:</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVol}
              onChange={handleMusicChange}
              disabled={!enabled}
              className="w-full accent-[#b61929] cursor-pointer h-2 bg-[#FFF4D6] rounded border border-[#1b1c1c] disabled:opacity-40"
            />
            <span className="w-7 text-right text-[10px] font-mono font-bold text-[#1b1c1c]">
              {musicVol}%
            </span>
          </div>

          {/* SFX Volume Slider */}
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[#5b403f] w-16 shrink-0">
              <Zap className="w-3 h-3 text-[#fe893c]" />
              <span>SFX:</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVol}
              onChange={handleSfxChange}
              disabled={!enabled}
              className="w-full accent-[#fe893c] cursor-pointer h-2 bg-[#FFF4D6] rounded border border-[#1b1c1c] disabled:opacity-40"
            />
            <span className="w-7 text-right text-[10px] font-mono font-bold text-[#1b1c1c]">
              {sfxVol}%
            </span>
          </div>
        </div>
      </div>
    );
  }
);

AudioVolumeControls.displayName = "AudioVolumeControls";
