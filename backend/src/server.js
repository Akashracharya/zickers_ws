import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// 'passport' is no longer needed
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import assetRoutes from "./routes/assets.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

connectDB();

// More robust CORS setup for Vercel
app.use(cors({
  origin: process.env.FRONTEND_URL // Use the environment variable
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// `passport.initialize()` is no longer needed

app.get("/", (req, res) => {
  res.send("🚀 Zickers Backend is running!");
});

// Your API routes must come *before* the export
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes);

// The app.listen() part is not needed for Vercel, but keeping it is fine for local development.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
