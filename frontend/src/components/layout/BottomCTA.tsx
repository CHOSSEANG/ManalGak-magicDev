// src/components/layout/BottomCTA.tsx
import { Suspense } from "react";
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";

export default function BottomCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      {/* Safe area + 배경 레이어 (투명 대신 토큰 기반) */}
      <div className="bg-[var(--bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg)]/80 border-t border-[var(--border)]">
        <div className="mx-auto w-full max-w-[1440px] px-2 py-2">
          <Suspense fallback={null}>
            <BottomTabNavigation />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
