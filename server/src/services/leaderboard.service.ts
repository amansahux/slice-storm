import Game from "../models/Game.model";
import { GameMode } from "../validators/common.validator";

/**
 * Global Leaderboard:
 * - Aggregates top scores per player across all modes
 * - Uses indexed fields { score: -1 } (ESR backend rule)
 * - Returns lean projected player & score objects (Backend Rules 1, 4)
 */

export const getGlobalLeaderboard = async (limit = 20) => {
  const safeLimit = Math.min(Math.max(1, limit), 100);

  const leaderboard = await Game.aggregate([
    // Only valid completed games
    {
      $match: {
        status: "completed",
      },
    },

    // Sort highest score first for each user
    {
      $sort: {
        score: -1,
        createdAt: 1,
        _id: 1,
      },
    },

    // Keep only each player's best game
    {
      $group: {
        _id: "$userId",
        bestGame: { $first: "$$ROOT" },
      },
    },

    // Rank all players by their best score
    {
      $sort: {
        "bestGame.score": -1,
        "bestGame.createdAt": 1,
        "_id": 1,
      },
    },

    { $limit: safeLimit },

    // Get player profile information
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 0,
        id: "$bestGame._id",
        userId: "$_id",
        name: {
          $ifNull: ["$user.name", "ANONYMOUS SAMURAI"],
        },
        avatar: {
          $ifNull: ["$user.avatar", null],
        },
        score: "$bestGame.score",
        mode: "$bestGame.mode",
        fruitsSliced: "$bestGame.fruitsSliced",
        maxCombo: "$bestGame.maxCombo",
        createdAt: "$bestGame.createdAt",
      },
    },
  ]);

  return leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};


/**
 * Mode-specific Leaderboard:
 * - Backed by compound index { mode: 1, score: -1 } (ESR heuristic)
 */

export const getModeLeaderboard = async (
  mode: GameMode,
  limit: number = 20
) => {
  const safeLimit = Math.min(Math.max(1, limit), 100);

  const leaderboard = await Game.aggregate([
    // 1. Filter completed games for the selected mode
    {
      $match: {
        mode,
        status: "completed",
      },
    },

    // 2. Put each player's highest score first
    {
      $sort: {
        score: -1,
        createdAt: 1,
        _id: 1,
      },
    },

    // 3. Keep only the best game for each player
    {
      $group: {
        _id: "$userId",
        bestGame: {
          $first: "$$ROOT",
        },
      },
    },

    // 4. Rank players by their best score
    {
      $sort: {
        "bestGame.score": -1,
        "bestGame.createdAt": 1,
        _id: 1,
      },
    },

    // 5. Return only the top players
    {
      $limit: safeLimit,
    },

    // 6. Fetch player profile details
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },

    // 7. Shape the response
    {
      $project: {
        _id: 0,
        id: "$bestGame._id",
        userId: "$_id",

        name: {
          $ifNull: ["$user.name", "ANONYMOUS SAMURAI"],
        },

        avatar: {
          $ifNull: ["$user.avatar", null],
        },

        score: "$bestGame.score",
        mode: "$bestGame.mode",
        fruitsSliced: "$bestGame.fruitsSliced",
        maxCombo: "$bestGame.maxCombo",
        accuracy: "$bestGame.accuracy",
        createdAt: "$bestGame.createdAt",
      },
    },
  ]);

  return leaderboard.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};

