import { Document, Types } from "mongoose";

export interface IGame {
  userId: Types.ObjectId | string;
  sessionId: string;
  mode: "classic" | "arcade";
  score: number;
  fruitsSliced: number;
  fruitsMissed: number;
  bombsHit: number;
  maxCombo: number;
  accuracy: number;
  duration: number;
  level: number;
  status: "completed" | "invalid";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGameDocument extends IGame, Document {}
