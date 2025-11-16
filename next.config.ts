import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  // distDir: "dist",
  experimental: {
    // TDS 라이브러리를 번들링에서 제외
    serverComponentsExternalPackages: ["@toss/tds-mobile-ait"],
  },
  webpack: (config, { isServer }) => {
    // 서버 사이드에서 클라이언트 전용 모듈 무시
    if (isServer) {
      config.externals = [...(config.externals || []), "@toss/tds-mobile-ait"];
    }
    return config;
  },
};

export default nextConfig;
