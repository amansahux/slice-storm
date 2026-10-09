import app from "./src/app";
import { PORT } from "./src/config/config";
import connectDB from "./src/config/db";

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on Port ${PORT}`);
  });
});