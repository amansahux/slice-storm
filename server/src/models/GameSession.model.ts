import mongoose from "mongoose";
import { IGameSessionDocument } from "../types/gameSession.types";

const gameSessionSchema = new mongoose.Schema<IGameSessionDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mode: {
      type: String,
      required: true,
      enum: ["classic", "arcade"],
    },

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed", "expired", "abandoned"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const GameSession = mongoose.model(
  "GameSession",
  gameSessionSchema
);

export default GameSession;