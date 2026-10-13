import mongoose from "mongoose";
import { IGameDocument } from "../types/game.types";

const gameSchema = new mongoose.Schema<IGameDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    mode: {
      type: String,
      required: true,
      enum: ["classic", "arcade", "zen"],
    },

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    fruitsSliced: {
      type: Number,
      default: 0,
      min: 0,
    },

    fruitsMissed: {
      type: Number,
      default: 0,
      min: 0,
    },

    bombsHit: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxCombo: {
      type: Number,
      default: 0,
      min: 0,
    },

    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    duration: {
      type: Number,
      required: true,
      min: 0,
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },

    status: {
      type: String,
      enum: ["completed", "invalid"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

// Player history
gameSchema.index({
  userId: 1,
  createdAt: -1,
});

// Global leaderboard
gameSchema.index({
  score: -1,
});

// Mode-specific leaderboard
gameSchema.index({
  mode: 1,
  score: -1,
});

const Game = mongoose.model("Game", gameSchema);

export default Game;