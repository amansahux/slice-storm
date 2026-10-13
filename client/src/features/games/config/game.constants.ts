import type { FruitTypeConfig, BladeTheme, LeaderboardEntry } from "./game.types";

export const FRUIT_TYPES: readonly FruitTypeConfig[] = [
  { name: "Watermelon", shape: "watermelon", radius: 46, skin: "#27AE60", flesh: "#EB5757", seeds: true, points: 20 },
  { name: "Apple", shape: "apple", radius: 36, skin: "#E63946", flesh: "#FFF3B0", seeds: false, points: 15 },
  { name: "Orange", shape: "orange", radius: 38, skin: "#F77F00", flesh: "#FCBF49", segments: true, points: 15 },
  { name: "Banana", shape: "banana", radius: 38, skin: "#FFD166", flesh: "#FFFBE6", points: 20 },
  { name: "Strawberry", shape: "strawberry", radius: 32, skin: "#D62828", flesh: "#F77F00", seeds: true, points: 25 },
  { name: "Pineapple", shape: "pineapple", radius: 46, skin: "#DDA15E", flesh: "#FFD166", points: 30 },
  { name: "Kiwi", shape: "kiwi", radius: 34, skin: "#8C564B", flesh: "#2ECC71", seeds: true, points: 20 },
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
  MAX_BOMB_CHANCE: 0.28, // Bomb chance gradually rises with score
  BASE_SPAWN_INTERVAL: 75,
  MIN_SPAWN_INTERVAL: 55, // Wave spawn speed quickens as score grows
  MAX_LIVES: 3,
  BLITZ_DURATION: 60,
  COMBO_TIMEOUT_MS: 700,
} as const;
