import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUserDocument, IUserModel } from "../types/user.types";

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    highestScore: {
      type: Number,
      default: 0,
    },

    totalGames: {
      type: Number,
      default: 0,
    },

    totalFruitsSliced: {
      type: Number,
      default: 0,
    },

    highestCombo: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },

    settings: {
      soundEnabled: {
        type: Boolean,
        default: true,
      },

      musicEnabled: {
        type: Boolean,
        default: true,
      },
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password if modified
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export default User;