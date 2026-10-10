import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import userRoutes from "./routes/user.routes";
import gameRoutes from "./routes/game.routes";
import gameSessionRoutes from "./routes/gameSession.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import settingRoutes from "./routes/setting.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/sessions", gameSessionRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/settings", settingRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;