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
    domains: ["localhost"], // 기존 유지
    remotePatterns: [
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "k.kakaocdn.net", // 카카오 프로필 이미지
      },
    ],
  },

  // ✅ 기타 설정
  reactStrictMode: true,
  output: "standalone",
};

module.exports = nextConfig;
