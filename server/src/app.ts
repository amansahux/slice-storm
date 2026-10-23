import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from "./routes/user.routes";
import gameRoutes from "./routes/game.routes";
import gameSessionRoutes from "./routes/gameSession.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cookieParser());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/sessions", gameSessionRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 5. Public Frontend SPA fallback
app.get('{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Global Error Handler
app.use(errorHandler);

export default app;