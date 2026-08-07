import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Existing WordPress CDN (source images during migration)
      {
        protocol: "https",
        hostname: "cdn.theteslawrapshop.com",
        pathname: "/**",
      },
      // Backblaze B2 (S3-compatible) — any region host
      {
        protocol: "https",
        hostname: "**.backblazeb2.com",
        pathname: "/**",
      },
      // Optional Backblaze friendly download host
      {
        protocol: "https",
        hostname: "f000.backblazeb2.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
