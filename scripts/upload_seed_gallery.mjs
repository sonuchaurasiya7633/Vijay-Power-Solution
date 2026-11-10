import fs from "fs";
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment");
  process.exit(1);
}

const galleryDir = path.join(process.cwd(), "public", "images", "gallery");
const imageFiles = fs.readdirSync(galleryDir).filter((f) => f.endsWith(".jpg")).sort();

console.log(`Found ${imageFiles.length} customer installation photos to upload & seed.`);

// Connect DB
await mongoose.connect(MONGODB_URI);
console.log("Connected to MongoDB Atlas.");

// InstallationGallery Schema
const InstallationGallerySchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    title: { type: String, required: true, default: "Customer Solar Installation" },
    customerName: { type: String },
    city: { type: String },
    state: { type: String },
    category: { type: String, default: "Residential Rooftop" },
    capacityKw: { type: Number },
    description: { type: String },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const InstallationGallery =
  mongoose.models.InstallationGallery ||
  mongoose.model("InstallationGallery", InstallationGallerySchema);

// Clear previous gallery entries to avoid duplicates on re-seed
await InstallationGallery.deleteMany({});
console.log("Cleared existing gallery items.");

const titles = [
  "Rooftop Solar Installation with Happy Customer",
  "Residential Solar Energy System Handover",
  "Turnkey Solar Rooftop Array Installation",
  "Customer Solar Plant Commissioning & Handover",
  "High-Efficiency Rooftop Solar Power Setup",
  "Residential Clean Solar Power Installation",
  "Solar PV Installation with Homeowner",
  "Customer On-Grid Solar System Commissioning",
  "Residential Solar Engineering Handover",
  "Solar Installation Completed with Satisfied Customer",
];

const galleryRecords = [];

for (let i = 0; i < imageFiles.length; i++) {
  const file = imageFiles[i];
  const filePath = path.join(galleryDir, file);
  const fileBuffer = fs.readFileSync(filePath);
  const base64Data = "data:image/jpeg;base64," + fileBuffer.toString("base64");

  let cdnUrl = `/images/gallery/${file}`;
  let publicId = undefined;

  if (cloudName && apiKey && apiSecret) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = "gallery";
      const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
      const signature = crypto
        .createHash("sha1")
        .update(paramsToSign + apiSecret)
        .digest("hex");

      const formData = new FormData();
      formData.append("file", base64Data);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        cdnUrl = data.secure_url;
        publicId = data.public_id;
        console.log(`[${i + 1}/${imageFiles.length}] Uploaded ${file} to Cloudinary: ${cdnUrl}`);
      } else {
        console.warn(`[${i + 1}/${imageFiles.length}] Cloudinary upload warning:`, data);
      }
    } catch (err) {
      console.warn(`[${i + 1}/${imageFiles.length}] Cloudinary upload failed, using local URL:`, err.message);
    }
  }

  galleryRecords.push({
    imageUrl: cdnUrl,
    cloudinaryPublicId: publicId,
    title: titles[i] || `Customer Solar Installation #${i + 1}`,
    category: "Residential Rooftop",
    isFeatured: i < 6, // First 6 are featured for homepage grid
    isPublished: true,
    sortOrder: i + 1,
  });
}

const inserted = await InstallationGallery.insertMany(galleryRecords);
console.log(`\nSuccessfully seeded ${inserted.length} customer installation gallery records into MongoDB Atlas!`);

await mongoose.disconnect();
console.log("Done.");
