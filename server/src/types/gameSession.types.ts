import { Document, Types } from "mongoose";

export interface IGameSession {
  sessionId: string;
  userId: Types.ObjectId | string;
  mode: "classic" | "arcade";
  startedAt: Date;
  expiresAt: Date;
  status: "active" | "completed" | "expired" | "abandoned";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGameSessionDocument extends IGameSession, Document {}
