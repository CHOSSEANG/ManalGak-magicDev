// src/components/layout/BottomCTA.tsx
import { Suspense } from "react";

// shadcn/ui
import { Card } from "@/components/ui/card";

import BottomTabNavigation from "@/components/layout/BottomTabNavigation";

export default function BottomCTA() {
  return (
    <div className="app-container fixed inset-x-0 bottom-0 z-40">
      {/* Bottom CTA Surface */}
      <Card
        className="
          rounded-none
          border-t border-[var(--border)]
          bg-[var(--bg)]
        "
      >
        {/* Safe area + content wrapper */}
        <div
          className="
            mx-auto
            w-full max-w-[1440px]
            px-2 py-2
          "
        >
          <Suspense fallback={null}>
            <BottomTabNavigation />
          </Suspense>
        </div>
      </Card>
    </div>
  );
}
