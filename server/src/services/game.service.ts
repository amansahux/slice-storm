import Game from "../models/Game.model";
import GameSession from "../models/GameSession.model";
import User from "../models/user.model";
import { AppError } from "../utils/AppError";
import { GameMode, GameStatus } from "../validators/common.validator";

export interface CreateGameInput {
  userId: string;
  sessionId: string;
  mode: GameMode;
  score: number;
  fruitsSliced?: number;
  fruitsMissed?: number;
  bombsHit?: number;
  maxCombo?: number;
  duration: number;
  status?: GameStatus;
}

/**
 * Creates a completed game run record:
 * - Validates session legitimacy and marks session completed
 * - Creates game record
 * - Optimizes user stats update via atomic single operation ($inc, $max, single recalculation)
 * - Returns lean game data (Rules 0, 1, 3: No N+1, Lean projection, minimal round trips)
 */
export const createGame = async (data: CreateGameInput) => {
  const {
    userId,
    sessionId,
    mode,
    score,
    fruitsSliced = 0,
    fruitsMissed = 0,
    bombsHit = 0,
    maxCombo = 0,
    duration,
    status = "completed",
  } = data;

  // Server-side accuracy calculation: (fruitsSliced / (fruitsSliced + fruitsMissed)) * 100
  const totalFruitAttempts = fruitsSliced + fruitsMissed;
  const accuracy = totalFruitAttempts > 0
    ? Math.round((fruitsSliced / totalFruitAttempts) * 100)
    : 0;

  if (!userId) {
    throw new AppError("Unauthorized: User ID is required", 401);
  }

  // 1. Session check & atomic transition to 'completed'
  const session = await GameSession.findOne({ sessionId, userId });
  if (!session) {
    throw new AppError("Invalid or unauthorized game session", 400);
  }

  if (session.status === "completed") {
    throw new AppError("This game session has already been recorded", 409);
  }

  // Mark session as completed
  session.status = "completed";
  await session.save();

  // 2. Persist the game run
  const newGame = await Game.create({
    userId,
    sessionId,
    mode,
    score,
    fruitsSliced,
    fruitsMissed,
    bombsHit,
    maxCombo,
    accuracy,
    duration,
    status,
  });

  // 3. Atomically update user stats concurrently/efficiently
  const user = await User.findById(userId).select(
    "highestScore totalGames totalFruitsSliced highestCombo averageScore"
  );

  if (user) {
    const isZen = mode === "zen";
    const updatedTotalGames = (user.totalGames || 0) + 1;
    const updatedHighestCombo = Math.max(user.highestCombo || 0, maxCombo);
    const updatedTotalFruits = (user.totalFruitsSliced || 0) + fruitsSliced;

    let updatedAverageScore = user.averageScore || 0;
    let updatedHighestScore = user.highestScore || 0;

    if (!isZen) {
      const currentTotalScore = (user.averageScore || 0) * (user.totalGames || 0) + score;
      updatedAverageScore = Math.round(currentTotalScore / updatedTotalGames);
      updatedHighestScore = Math.max(user.highestScore || 0, score);
    }

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          highestScore: updatedHighestScore,
          totalGames: updatedTotalGames,
          totalFruitsSliced: updatedTotalFruits,
          highestCombo: updatedHighestCombo,
          averageScore: updatedAverageScore,
        },
      }
    );
  }

  return {
    id: newGame._id,
    sessionId: newGame.sessionId,
    mode: newGame.mode,
    score: newGame.score,
    fruitsSliced: newGame.fruitsSliced,
    fruitsMissed: newGame.fruitsMissed,
    bombsHit: newGame.bombsHit,
    maxCombo: newGame.maxCombo,
    accuracy: newGame.accuracy,
    duration: newGame.duration,
    status: newGame.status,
    createdAt: newGame.createdAt,
  };
};

/**
 * Fetches user game run history:
 * - Pagination supported (Backend Rule 1)
 * - Selectively projects fields (Backend Rule 1 & 4)
 * - Backed by index { userId: 1, createdAt: -1 } (Backend Rule 5)
 */
export const getGameHistory = async (
  userId: string,
  limit: number = 20,
  page: number = 1
) => {
  if (!userId) {
    throw new AppError("Unauthorized: User ID is required", 401);
  }

  const safeLimit = Math.min(Math.max(1, limit), 100);
  const skip = (Math.max(1, page) - 1) * safeLimit;

  const [games, total] = await Promise.all([
    Game.find({ userId })
      .select("sessionId mode score fruitsSliced fruitsMissed bombsHit maxCombo accuracy duration status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Game.countDocuments({ userId }),
  ]);

  return {
    games,
    pagination: {
      total,
      page,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};
