
import crypto from "crypto";
import GameSession from "../models/GameSession.model";
import { AppError } from "../utils/AppError";
import { GameMode } from "../validators/common.validator";

interface CreateSessionInput {
  mode: GameMode;
  userId: string;
}

export const createSession = async (data: CreateSessionInput) => {
  const { mode, userId } = data;

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const startedAt = new Date();
  const expiresAt = new Date(
    startedAt.getTime() + 15 * 60 * 1000
  );

  const sessionId = `sess_${crypto.randomUUID()}`;

  const session = await GameSession.create({
    sessionId,
    userId,
    mode,
    startedAt,
    expiresAt,
    status: "active",
  });

  return {
    sessionId: session.sessionId,
    mode: session.mode,
    startedAt: session.startedAt,
    expiresAt: session.expiresAt,
    status: session.status,
  };
};

export const updateSessionStatus = async (
  sessionId: string,
  userId: string,
  status: string
) => {
  if (!sessionId) {
    throw new AppError("Session ID is required", 400);
  }

  // This endpoint is only for abandoning a game.
  // Completion is handled by the game completion service.
  if (status !== "abandoned") {
    throw new AppError(
      "Only abandonment is allowed through this endpoint",
      400
    );
  }

  const now = new Date();

  const existingSession = await GameSession.findOne({
    sessionId,
    userId,
  });

  if (!existingSession) {
    throw new AppError("Game session not found", 404);
  }

  if (existingSession.status !== "active") {
    throw new AppError("Game session is no longer active", 409);
  }

  if (existingSession.expiresAt <= now) {
    await GameSession.updateOne(
      { _id: existingSession._id, status: "active" },
      { $set: { status: "expired" } }
    );

    throw new AppError("Game session has expired", 410);
  }

  // Atomic condition prevents two requests from changing
  // the same active session at the same time.
  const session = await GameSession.findOneAndUpdate(
    {
      _id: existingSession._id,
      userId,
      status: "active",
      expiresAt: { $gt: now },
    },
    {
      $set: { status: "abandoned" },
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("sessionId mode status startedAt expiresAt");

  if (!session) {
    throw new AppError(
      "Game session is no longer active",
      409
    );
  }

  return session;
};
