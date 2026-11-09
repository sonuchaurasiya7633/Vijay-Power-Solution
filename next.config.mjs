/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "commondatastorage.googleapis.com",
      },
    ],
  },
  eslint: {
    // Warnings should not fail the build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Typecheck is strictly enforced
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
