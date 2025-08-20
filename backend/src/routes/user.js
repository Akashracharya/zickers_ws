import express from "express";
import { toggleSaveAsset, getSavedAssets } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/saved", authMiddleware, getSavedAssets);
router.post("/save/:assetId", authMiddleware, toggleSaveAsset);

export default router;