import type { NextConfig } from "next";

// distDir resolution:
// - On Vercel, always use ".next" — Vercel's deploy step looks there for the
//   build output and fails if it isn't (https://err.sh/vercel/vercel/now-next-routes-manifest).
// - Locally, honor NEXT_BUILD_DIR so `bun run build` writes to ".next-prod"
//   and doesn't clobber the dev server's hot-reload state in ".next".
const isVercel = process.env.VERCEL === "1";
const distDir = isVercel ? ".next" : (process.env.NEXT_BUILD_DIR ?? ".next");

const config: NextConfig = {
  reactStrictMode: true,
  distDir,
};

export default config;
