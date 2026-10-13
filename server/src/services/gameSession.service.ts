import crypto from "crypto";
import GameSession from "../models/GameSession.model";
import { AppError } from "../utils/AppError";
import { GameMode, GameSessionStatus } from "../validators/common.validator";

interface CreateSessionInput {
  mode: GameMode;
  userId: string;
}

/**
 * Creates a validated game session with strict expiration window
 * Following Backend Optimization Rules:
 * - Lean query projection
 * - Reusable indexed session identifier
 */
export const createSession = async (data: CreateSessionInput) => {
  const { mode, userId } = data;

  if (!userId) {
    throw new AppError("Unauthorized: Player ID is required to start a game session", 401);
  }

  // 15 minutes TTL for game session validity
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + 15 * 60 * 1000);
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

/**
 * Updates game session status (e.g. active -> completed / abandoned)
 */
export const updateSessionStatus = async (
  sessionId: string,
  status: GameSessionStatus
) => {
  if (!sessionId) {
    throw new AppError("Session ID is required", 400);
  }

  const session = await GameSession.findOneAndUpdate(
    { sessionId },
    { $set: { status } },
    { new: true, runValidators: true }
  ).select("sessionId mode status startedAt expiresAt");

  if (!session) {
    throw new AppError("Game session not found", 404);
  }

  return session;
};
