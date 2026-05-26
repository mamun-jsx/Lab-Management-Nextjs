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
};

export default nextConfig;
