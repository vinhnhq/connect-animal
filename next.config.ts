import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Keep production builds out of the dev server's `.next`, so running
  // `bun run build` doesn't clobber hot-reload state. The env var drives it
  // — `bun dev` and `bun start` see `.next` and `.next-prod` respectively.
  distDir: process.env.NEXT_BUILD_DIR ?? ".next",
};

export default config;
