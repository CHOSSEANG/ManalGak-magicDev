// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
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
        {/* ✅ 카카오 지도 SDK – 절대 깨지지 않는 방식 */}
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
        {/* ✅ 카카오톡 공유 JS SDK */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="beforeInteractive"
        />
      </head>

      <body>
        <TooltipProvider delayDuration={200}>
          <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-[var(--wf-bg)] text-[var(--wf-text)]">
            <Header />
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[1440px] px-4 py-6">
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
