import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["wallpaper", "sticker", "poster"],
    },
    url: {
      type: String,
      required: true,
    },
    // We can store the public_id from Cloudinary for easier management
    cloudinaryId: {
      type: String,
      required: true,
      unique: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Asset = mongoose.model("Asset", assetSchema);

export default Asset;