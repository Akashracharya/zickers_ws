import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import assetRoutes from "./routes/assets.js"; // Make sure this line is here
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("🚀 Zickers Backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes); // Add this line

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});