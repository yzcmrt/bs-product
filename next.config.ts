import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */eslint: {
    // ESLint hatalarını build sırasında görmezden gel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
