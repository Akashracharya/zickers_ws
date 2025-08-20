import Asset from "../models/asset.js";

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