/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 환경 변수
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
    NEXT_PUBLIC_KAKAO_MAP_KEY: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY,
  },

  // ✅ next/image 설정
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net",
      },
    ],
  },

  // ✅ ESLint (🔥 이게 핵심)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ 기타 설정
  reactStrictMode: true,
  output: "standalone",
};

module.exports = nextConfig;
