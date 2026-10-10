import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;