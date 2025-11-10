import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  webpack: (config) => {
    // Allow loading FBX files
    config.module.rules.push({
      test: /\.(fbx)$/i,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
