import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.251', '192.168.1.251:3007', '191.168.1.251:5007','localhost '],

  // Allows importing TypeScript directly from @repo/shared without rebuilding.

  transpilePackages: ["@repo/shared"],

};

export default nextConfig;
