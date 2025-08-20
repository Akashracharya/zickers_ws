import express from "express";
import multer from "multer";
import { getAllAssets, addAsset, uploadAsset } from "../controllers/assetController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Public route to get all images
router.get("/", getAllAssets);

// Private route to add a new image from URL (manual method)
router.post("/", authMiddleware, addAsset);

// Private route to UPLOAD a new image file
router.post("/upload", authMiddleware, upload.single("image"), uploadAsset);

export default router;