import Asset from "../models/asset.js";
import cloudinary from "../config/cloudinary.js";

// @desc    Get all assets
// @route   GET /api/assets
// @access  Public
export const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find({}).sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    console.error("Get assets error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a new asset
// @route   POST /api/assets
// @access  Private (requires admin/auth)
export const addAsset = async (req, res) => {
  try {
    const { title, category, url, cloudinaryId, width, height } = req.body;

    // Simple validation
    if (!title || !category || !url || !cloudinaryId || !width || !height) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const newAsset = new Asset({
      title,
      category,
      url,
      cloudinaryId,
      width,
      height,
    });

    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (err) {
    console.error("Add asset error:", err);
    // Handle potential duplicate cloudinaryId error
    if (err.code === 11000) {
      return res.status(400).json({ message: "Asset with this Cloudinary ID already exists." });
    }
    res.status(500).json({ message: "Server error" });
  }
};
export const uploadAsset = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
  
      // The file is uploaded to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "zickers_assets", // Optional: saves to a specific folder in Cloudinary
      });
  
      // Now, create the asset in our database with the Cloudinary data
      const { title, category } = req.body;
      
      const newAsset = new Asset({
        title: title || "Untitled",
        category: category || "wallpaper",
        url: result.secure_url,
        cloudinaryId: result.public_id,
        width: result.width,
        height: result.height,
      });
  
      const savedAsset = await newAsset.save();
      res.status(201).json(savedAsset);
  
    } catch (err) {
      console.error("Upload asset error:", err);
      res.status(500).json({ message: "Server error during file upload." });
    }
  };