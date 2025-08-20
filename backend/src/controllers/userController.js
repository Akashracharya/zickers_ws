import User from "../models/user.js";
import Asset from "../models/asset.js";

// @desc    Toggle saving an asset for a user
// @route   POST /api/users/save/:assetId
// @access  Private
export const toggleSaveAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const userId = req.user.id; // from authMiddleware

    const user = await User.findById(userId);
    const asset = await Asset.findById(assetId);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    const isSaved = user.savedAssets.includes(assetId);
    let updatedUser;

    if (isSaved) {
      // Unsave it
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { savedAssets: assetId } },
        { new: true }
      );
    } else {
      // Save it
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { savedAssets: assetId } }, // $addToSet prevents duplicates
        { new: true }
      );
    }

    res.json({
      message: isSaved ? "Asset unsaved" : "Asset saved",
      savedAssets: updatedUser.savedAssets,
    });

  } catch (err) {
    console.error("Toggle save error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get saved assets for a user
// @route   GET /api/users/saved
// @access  Private
export const getSavedAssets = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('savedAssets');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.savedAssets);
    } catch (err) {
        console.error("Get saved assets error:", err);
        res.status(500).json({ message: "Server error" });
    }
}