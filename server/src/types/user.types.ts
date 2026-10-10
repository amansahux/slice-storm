import { Document, Model } from "mongoose";

export interface IUserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  avatar?: string | null;
  highestScore: number;
  totalGames: number;
  totalFruitsSliced: number;
  highestCombo: number;
  averageScore: number;
  settings: IUserSettings;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}
