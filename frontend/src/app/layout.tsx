// src/app/layout.tsx

import type { Metadata } from "next";
import Script from "next/script";
import { AuthProvider } from "@/context/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "만날각 - 중간 만남 장소 추천",
  description: "모임 목적에 맞는 중간 만남 장소를 추천해드립니다",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 카카오 지도 SDK */}
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
        {/* 카카오 공유 SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="beforeInteractive"
        />
      </head>

      <body>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            {/* 전체 앱: 세로 플렉스 */}
            <div className="h-screen min-h-screen flex flex-col bg-[var(--wf-bg)] text-[var(--wf-text)]">
              <Header />

              {/* main: 남은 영역 차지 + 스크롤 컨텍스트 */}
              <main className="flex-1 min-h-0 flex justify-center">
                <div className="app-container w-full flex-1 min-h-0 overflow-y-auto py-6">
                  {children}
                </div>
              </main>

              <Footer />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
