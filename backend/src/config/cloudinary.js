import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary({
  cloud_name,
  api_key,
  api_secret,
}) {
  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
  return cloudinary;
}
