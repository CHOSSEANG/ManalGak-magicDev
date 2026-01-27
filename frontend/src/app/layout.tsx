// src/app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomCTA from '@/components/layout/BottomCTA'
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import { UserProvider } from "@/context/UserContext" // 추가

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
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="beforeInteractive"
        />
      </head>

      <body className="bg-[var(--wf-bg)] text-[var(--wf-text)]">
        <UserProvider>
          <TooltipProvider delayDuration={200}>
            <div className="app-container min-h-screen flex flex-col">
              <Header />

              <main className="flex-1 flex justify-center">
                <div className="w-full py-6">
                  {children}
                </div>
              </main>

              <Footer />
            </div>
          </TooltipProvider>
        </UserProvider>

        {/* 전역 고정 */}
        <BottomCTA />
      </body>
    </html>
  );
}
