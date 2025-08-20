import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    googleId: {
      type: String,
    },
    // Add this field
    savedAssets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset'
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;