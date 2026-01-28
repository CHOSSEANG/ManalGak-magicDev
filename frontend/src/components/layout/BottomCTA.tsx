// src/components/layout/BottomCTA.tsx
import { Suspense } from "react";

// shadcn/ui
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";

export default function BottomCTA() {
  return (
    <div className="app-container fixed inset-x-0 bottom-0 z-30">
      {/* Bottom CTA Surface */}
      {/* 카드 대신 단순 표면으로 박스 중첩 최소화 */}
      <div className="border-t border-[var(--border)] bg-[var(--bg)]">
        {/* Safe area + content wrapper */}
        <div className="mx-auto w-full max-w-[1440px] px-2 py-2">
          <Suspense fallback={null}>
            <BottomTabNavigation />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
