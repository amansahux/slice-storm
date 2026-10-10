import { Document, Types } from "mongoose";
import { GameMode, GameStatus } from "../validators/common.validator";

export interface IGame {
  userId: Types.ObjectId | string;
  sessionId: string;
  mode: GameMode;
  score: number;
  fruitsSliced: number;
  fruitsMissed: number;
  bombsHit: number;
  maxCombo: number;
  accuracy: number;
  duration: number;
  level: number;
  status: GameStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGameDocument extends IGame, Document {}
