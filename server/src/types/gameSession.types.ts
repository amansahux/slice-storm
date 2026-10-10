import { Document, Types } from "mongoose";
import { GameMode, GameSessionStatus } from "../validators/common.validator";

export interface IGameSession {
  sessionId: string;
  userId: Types.ObjectId | string;
  mode: GameMode;
  startedAt: Date;
  expiresAt: Date;
  status: GameSessionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGameSessionDocument extends IGameSession, Document {}
