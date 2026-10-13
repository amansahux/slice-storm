import Game from "../models/Game.model";
import { GameMode } from "../validators/common.validator";

/**
 * Global Leaderboard:
 * - Aggregates top scores per player across all modes
 * - Uses indexed fields { score: -1 } (ESR backend rule)
 * - Returns lean projected player & score objects (Backend Rules 1, 4)
 */
export const getGlobalLeaderboard = async (limit: number = 20) => {
  const safeLimit = Math.min(Math.max(1, limit), 100);

  const leaderboard = await Game.find({ status: "completed" })
    .select("score mode fruitsSliced maxCombo accuracy createdAt userId")
    .populate("userId", "name avatar highestScore")
    .sort({ score: -1 })
    .limit(safeLimit)
    .lean();

  return leaderboard.map((entry, index) => {
    const user = entry.userId as any;
    return {
      rank: index + 1,
      id: entry._id,
      name: user?.name || "ANONYMOUS SAMURAI",
      avatar: user?.avatar || null,
      score: entry.score,
      mode: entry.mode,
      fruitsSliced: entry.fruitsSliced,
      maxCombo: entry.maxCombo,
      createdAt: entry.createdAt,
    };
  });
};

/**
 * Mode-specific Leaderboard:
 * - Backed by compound index { mode: 1, score: -1 } (ESR heuristic)
 */
export const getModeLeaderboard = async (mode: GameMode, limit: number = 20) => {
  const safeLimit = Math.min(Math.max(1, limit), 100);

  const leaderboard = await Game.find({ mode, status: "completed" })
    .select("score mode fruitsSliced maxCombo accuracy createdAt userId")
    .populate("userId", "name avatar highestScore")
    .sort({ score: -1 })
    .limit(safeLimit)
    .lean();

  return leaderboard.map((entry, index) => {
    const user = entry.userId as any;
    return {
      rank: index + 1,
      id: entry._id,
      name: user?.name || "ANONYMOUS SAMURAI",
      avatar: user?.avatar || null,
      score: entry.score,
      mode: entry.mode,
      fruitsSliced: entry.fruitsSliced,
      maxCombo: entry.maxCombo,
      createdAt: entry.createdAt,
    };
  });
};
