import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
