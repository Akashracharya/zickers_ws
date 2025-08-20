import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import "../config/passport.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:8080/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.redirect(`http://localhost:8080/?token=${token}`);
  }
);

export default router;