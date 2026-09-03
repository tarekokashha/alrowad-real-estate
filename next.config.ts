import type { NextConfig } from "next";
import path from "node:path";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root: otherwise Turbopack walks up and finds the
  // package-lock.json sitting in the home directory.
  turbopack: { root: path.resolve(process.cwd()) },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 82],
    // Source art is 1672px wide; no point generating larger candidates.
    deviceSizes: [420, 640, 828, 1080, 1280, 1672],
    imageSizes: [180, 260, 360, 480, 640],
  },
  async redirects() {
    return [{ source: "/", destination: "/ar", permanent: false }];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
