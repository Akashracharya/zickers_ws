import express from "express";
import { getAllAssets, addAsset } from "../controllers/assetController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to get all images
router.get("/", getAllAssets);

// Private route to add a new image
// For now, any logged-in user can add. You could add admin role checks later.
router.post("/", authMiddleware, addAsset);

export default router;