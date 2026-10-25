import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { AppError } from "./utils/AppError";
import { NODE_ENV } from "./config/config";
import userRoutes from "./routes/user.routes";
import gameRoutes from "./routes/game.routes";
import gameSessionRoutes from "./routes/gameSession.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import dashboardRoutes from "./routes/dashboard.routes";

const app = express();

app.get("/api/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "success", message: "Welcome to SLICE STORM Backend API" });
});

// 1. Trust proxy headers in production (reverse proxy / load balancer support)
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// 2. Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// 3. Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});
app.use(globalLimiter);

// 4. Stricter Rate Limiter for Authentication Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many authentication attempts, please try again after 15 minutes.",
  },
});

// 5. Request Parsers & Body Size Limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// 6. Request Logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

/* 7. Static Files */
const publicPath = path.resolve(process.cwd(), "public");

app.use(express.static(publicPath));

// 8. Application Routes
app.use("/api/auth", authLimiter, userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/sessions", gameSessionRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 9. Centralized 404 Handler for Unhandled API Routes
app.all("/api/*splat", (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

// 10. Public Frontend SPA Fallback
app.get("{*splat}", (_req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, "index.html"));
});
// 11. Centralized Global Error Handler
app.use(errorHandler);

export default app;