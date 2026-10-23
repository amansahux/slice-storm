import User from "../models/user.model";
import Game from "../models/Game.model";
import { getGlobalLeaderboard } from "./leaderboard.service";
import { AppError } from "../utils/AppError";

export interface DailyBounty {
  id: string;
  title: string;
  description: string;
  rewardTokens: number;
  current: number;
  target: number;
  progressPercent: number;
  completed: boolean;
  icon: string;
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: string;
  unlockedAt?: string | null;
}

export interface DashboardSummaryData {
  profile: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    tokens: number;
    bladeTheme: string;
    bladeSharpness: number;
    rank: number | null;
    gapToNextRank: number;
    nextRivalName: string | null;
  };
  stats: {
    highestScore: number;
    highestScoreMode: string;
    highestCombo: number;
    totalGames: number;
    totalFruitsSliced: number;
    averageScore: number;
    estimatedPlayTimeHours: number;
    accuracy: number;
  };
  recentRuns: Array<{
    id: string;
    sessionId: string;
    mode: string;
    score: number;
    fruitsSliced: number;
    fruitsMissed: number;
    bombsHit: number;
    maxCombo: number;
    accuracy: number;
    duration: number;
    status: string;
    createdAt: Date;
  }>;
  leaderboardPreview: Array<{
    rank: number;
    userId: string;
    name: string;
    avatar: string | null;
    score: number;
    mode: string;
    maxCombo: number;
    isCurrentPlayer: boolean;
  }>;
  dailyBounties: DailyBounty[];
  trophies: Trophy[];
  resetsInHours: number;
}

export const getDashboardSummary = async (userId: string): Promise<DashboardSummaryData> => {
  if (!userId) {
    throw new AppError("Unauthorized: User ID is required", 401);
  }

  // 1. Fetch user profile
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // 2. Start of today for daily stats
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // 3. Parallel fetch of user's best game, today's games, recent runs, and global top 10 leaderboard
  const [bestGame, todayGames, recentGames, globalLeaderboard] = await Promise.all([
    Game.findOne({ userId, status: "completed" }).sort({ score: -1 }).lean(),
    Game.find({ userId, status: "completed", createdAt: { $gte: startOfToday } })
      .select("score fruitsSliced maxCombo bombsHit")
      .lean(),
    Game.find({ userId, status: "completed" })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("sessionId mode score fruitsSliced fruitsMissed bombsHit maxCombo accuracy duration status createdAt")
      .lean(),
    getGlobalLeaderboard(10),
  ]);

  // Daily Bounties computation from real user data today
  const fruitsSlicedToday = todayGames.reduce((acc, g) => acc + (g.fruitsSliced || 0), 0);
  const maxComboToday = todayGames.reduce((acc, g) => Math.max(acc, g.maxCombo || 0), 0);
  const totalGamesCount = user.totalGames || 0;

  const bounty1Target = 100;
  const bounty1Current = Math.min(fruitsSlicedToday, bounty1Target);

  const bounty2Target = 10;
  const bounty2Current = Math.min(maxComboToday, bounty2Target);

  const bounty3Target = 50;
  const bounty3Current = Math.min(totalGamesCount, bounty3Target);

  const dailyBounties: DailyBounty[] = [
    {
      id: "bounty-1",
      title: "SLICE 100 FRUITS TODAY",
      description: "Slice juicy targets across any arcade mode today.",
      rewardTokens: 120,
      current: bounty1Current,
      target: bounty1Target,
      progressPercent: Math.min(100, Math.round((bounty1Current / bounty1Target) * 100)),
      completed: bounty1Current >= bounty1Target,
      icon: "nutrition",
    },
    {
      id: "bounty-2",
      title: "REACH ×10 COMBO IN A RUN",
      description: "Keep blade momentum without touching bombs.",
      rewardTokens: 200,
      current: bounty2Current,
      target: bounty2Target,
      progressPercent: Math.min(100, Math.round((bounty2Current / bounty2Target) * 100)),
      completed: bounty2Current >= bounty2Target,
      icon: "bolt",
    },
    {
      id: "bounty-3",
      title: "SURVIVE 50 ARCADE GAMES",
      description: "Play and complete 50 career arcade sessions.",
      rewardTokens: 350,
      current: bounty3Current,
      target: bounty3Target,
      progressPercent: Math.min(100, Math.round((bounty3Current / bounty3Target) * 100)),
      completed: bounty3Current >= bounty3Target,
      icon: "timer",
    },
  ];

  // Trophies / Achievements computation based on user stats
  const totalFruits = user.totalFruitsSliced || 0;
  const highestCombo = user.highestCombo || 0;
  const highestScore = user.highestScore || 0;

  // Check if player has 3 consecutive bomb-free runs in recent games
  const last3Runs = recentGames.slice(0, 3);
  const hasBombFreeStreak = last3Runs.length >= 3 && last3Runs.every((r) => (r.bombsHit || 0) === 0);

  const trophies: Trophy[] = [
    {
      id: "trophy-1",
      title: "FIRST SLICE",
      description: "Sliced your first fruit in any session",
      unlocked: totalFruits >= 1,
      icon: "sports_martial_arts",
    },
    {
      id: "trophy-2",
      title: "COMBO KING",
      description: "Reached a ×15 streak multiplier",
      unlocked: highestCombo >= 15,
      icon: "bolt",
    },
    {
      id: "trophy-3",
      title: "FRUIT FRENZY",
      description: "Sliced 2,500 total fruits",
      unlocked: totalFruits >= 2500,
      icon: "nutrition",
    },
    {
      id: "trophy-4",
      title: "BOMB DODGER",
      description: "0 bombs across 3 consecutive runs",
      unlocked: hasBombFreeStreak,
      icon: "security",
    },
    {
      id: "trophy-5",
      title: "SLICE GOD",
      description: "Reach 20,000 points in a single run",
      unlocked: highestScore >= 20000,
      icon: "lock",
    },
  ];

  // Leaderboard formatting and user ranking context
  let playerRank: number | null = null;
  let gapToNextRank = 0;
  let nextRivalName: string | null = null;

  const leaderboardPreview = globalLeaderboard.map((entry) => {
    const isCurrentPlayer = entry.userId?.toString() === userId.toString();
    if (isCurrentPlayer) {
      playerRank = entry.rank;
    }
    return {
      rank: entry.rank,
      userId: entry.userId?.toString() || "",
      name: entry.name,
      avatar: entry.avatar || null,
      score: entry.score,
      mode: entry.mode,
      maxCombo: entry.maxCombo,
      isCurrentPlayer,
    };
  });

  if (playerRank && playerRank > 1) {
    const rivalEntry = leaderboardPreview.find((e) => e.rank === playerRank! - 1);
    if (rivalEntry) {
      gapToNextRank = Math.max(0, rivalEntry.score - highestScore);
      nextRivalName = rivalEntry.name;
    }
  }

  // Estimated playtime hours based on average 90s per game
  const estimatedPlayTimeHours = Number(((totalGamesCount * 90) / 3600).toFixed(1));

  // Overall accuracy estimation from recent games
  const accuracy = recentGames.length > 0
    ? Math.round(recentGames.reduce((acc, r) => acc + (r.accuracy || 0), 0) / recentGames.length)
    : 0;

  // Calculate hours until midnight reset
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const resetsInHours = Math.max(1, Math.round((midnight.getTime() - Date.now()) / (1000 * 60 * 60)));

  return {
    profile: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      tokens: Math.max(100, (user.totalGames || 0) * 15 + Math.floor((user.highestScore || 0) / 50)),
      bladeTheme: "Katana Master",
      bladeSharpness: Math.min(100, Math.max(40, Math.round(((user.highestScore || 0) / 15000) * 100))),
      rank: playerRank,
      gapToNextRank,
      nextRivalName,
    },
    stats: {
      highestScore: user.highestScore || 0,
      highestScoreMode: bestGame?.mode || "classic",
      highestCombo: user.highestCombo || 0,
      totalGames: user.totalGames || 0,
      totalFruitsSliced: user.totalFruitsSliced || 0,
      averageScore: user.averageScore || 0,
      estimatedPlayTimeHours,
      accuracy,
    },
    recentRuns: recentGames.map((g) => ({
      id: g._id.toString(),
      sessionId: g.sessionId,
      mode: g.mode,
      score: g.score,
      fruitsSliced: g.fruitsSliced,
      fruitsMissed: g.fruitsMissed,
      bombsHit: g.bombsHit,
      maxCombo: g.maxCombo,
      accuracy: g.accuracy,
      duration: g.duration,
      status: g.status,
      createdAt: g.createdAt || new Date(),
    })),
    leaderboardPreview,
    dailyBounties,
    trophies,
    resetsInHours,
  };
};
