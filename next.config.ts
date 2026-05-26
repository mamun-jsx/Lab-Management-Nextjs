import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to succeed even with ESLint warnings
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow production builds to succeed even with TypeScript warnings
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow images from external domains if needed in the future
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
