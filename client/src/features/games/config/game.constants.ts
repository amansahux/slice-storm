import type { FruitTypeConfig, BladeTheme, LeaderboardEntry } from "./game.types";

export const FRUIT_TYPES: readonly FruitTypeConfig[] = [
  { name: "Watermelon", radius: 46, skin: "#27AE60", flesh: "#EB5757", seeds: true, points: 10 },
  { name: "Apple", radius: 36, skin: "#E63946", flesh: "#FFF3B0", seeds: false, points: 15 },
  { name: "Orange", radius: 38, skin: "#F77F00", flesh: "#FCBF49", segments: true, points: 15 },
  { name: "Banana", radius: 34, skin: "#FFD166", flesh: "#FFFBE6", points: 20 },
  { name: "Strawberry", radius: 30, skin: "#D62828", flesh: "#F77F00", seeds: true, points: 25 },
  { name: "Pineapple", radius: 44, skin: "#DDA15E", flesh: "#FFD166", points: 30 },
  { name: "Kiwi", radius: 32, skin: "#8C564B", flesh: "#2ECC71", seeds: true, points: 20 },
];

export const BLADE_THEMES: readonly BladeTheme[] = [
  { name: "Crimson", primary: "#FF3B30", accent: "#FF9500" },
  { name: "Juice Green", primary: "#34C759", accent: "#30D158" },
  { name: "Electric Lemon", primary: "#FFCC00", accent: "#FF9500" },
  { name: "Katana Frost", primary: "#007AFF", accent: "#5AC8FA" },
];

export const INITIAL_LEADERBOARD: readonly LeaderboardEntry[] = [
  { rank: 1, name: "BLADE_MASTER_99", score: 12480 },
  { rank: 2, name: "JUICE_VIPER", score: 9850 },
  { rank: 3, name: "CITRUS_SAMURAI", score: 7420 },
  { rank: 4, name: "SLICE_GOD", score: 5900 },
];

export const GAME_CONSTANTS = {
  GRAVITY: 0.32,
  MAX_BLADE_POINTS: 16,
  BOMB_CHANCE: 0.18,
  BASE_SPAWN_INTERVAL: 75,
  MAX_LIVES: 3,
  BLITZ_DURATION: 60,
  COMBO_TIMEOUT_MS: 1000,
} as const;
