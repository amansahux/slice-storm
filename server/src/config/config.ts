import dotenv from "dotenv";
dotenv.config();

// List of required environment variables
const requiredEnvVars = [
  "MONGO_URI",
  "PORT",
  "CLIENT_URL",
  "SERVER_URL",
  "NODE_ENV",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
] as const;

// Check for missing environment variables, log each one, and exit if any are missing
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  missingVars.forEach((varName) => {
    console.error(`❌ Missing required environment variable: ${varName}`);
  });
  console.error(
    "\n⚠️  Please add the missing variables to your .env file and restart the server."
  );
  process.exit(1);
}

// Export validated environment variables
export const MONGO_URI = process.env.MONGO_URI as string;
export const PORT = process.env.PORT || 3000;
export const CLIENT_URL = process.env.CLIENT_URL as string;
export const SERVER_URL = process.env.SERVER_URL as string;
export const NODE_ENV = process.env.NODE_ENV as string;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
