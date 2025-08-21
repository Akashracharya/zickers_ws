import express from "express";
import multer from "multer";
import { getAllAssets, addAsset, uploadAsset } from "../controllers/assetController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getAllAssets);
router.post("/", authMiddleware, addAsset);
router.post("/upload", authMiddleware, upload.single("image"), uploadAsset);

export default router;
