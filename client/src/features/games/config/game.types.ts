export type GameMode = "classic" | "blitz";
export type GameState = "START" | "COUNTDOWN" | "PLAYING" | "PAUSED" | "GAMEOVER";

export interface FruitTypeConfig {
  name: string;
  radius: number;
  skin: string;
  flesh: string;
  seeds?: boolean;
  segments?: boolean;
  points: number;
}

export interface BladeTheme {
  name: string;
  primary: string;
  accent: string;
}

export interface FlyingEntity {
  id: number;
  type: "fruit" | "bomb" | "half";
  sub?: FruitTypeConfig;
  side?: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  radius: number;
  sliceAngle?: number;
  sliced: boolean;
  fuseTick?: number;
}

export interface JuiceParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  decay: number;
}

export interface TextPopup {
  text: string;
  x: number;
  y: number;
  color: string;
  scale: number;
  vy: number;
  life: number;
}

export interface BladePoint {
  x: number;
  y: number;
  life: number;
}

export interface GameStats {
  score: number;
  lives: number;
  fruitsSliced: number;
  combo: number;
  maxCombo: number;
  timeRemaining: number;
  elapsedSeconds: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}
