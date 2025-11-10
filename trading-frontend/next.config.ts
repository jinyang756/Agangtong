import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 配置根目录以解决Vercel部署警告
  outputFileTracingRoot: ".",
  turbopack: {
    root: "."
  }
};

export default nextConfig;