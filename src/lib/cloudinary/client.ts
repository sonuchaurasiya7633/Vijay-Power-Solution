import crypto from "crypto";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "demo-vps";
const apiKey = process.env.CLOUDINARY_API_KEY || "123456789012345";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "abcdefghijklmnopqrstuvwxyz12";

export function generateUploadSignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha256")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder,
  };
}

export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: { width?: number; height?: number; crop?: string; quality?: string } = {}
) {
  if (!publicIdOrUrl) return "/images/logo.png";
  if (publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
    return publicIdOrUrl;
  }
  if (publicIdOrUrl.startsWith("/")) {
    return publicIdOrUrl;
  }

  const { width = 800, height, crop = "fill", quality = "auto" } = options;
  const transforms = [`f_auto`, `q_${quality}`, `w_${width}`];
  if (height) transforms.push(`h_${height}`, `c_${crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicIdOrUrl}`;
}
