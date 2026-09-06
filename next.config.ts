import type { NextConfig } from "next";

const isTauriBuild = process.env.BUILD_TARGET === "tauri";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_TAURI_BUILD: isTauriBuild ? "1" : "",
  },
  ...(isTauriBuild && {
    output: "export" as const,
    trailingSlash: true,
  }),
};

export default nextConfig;
