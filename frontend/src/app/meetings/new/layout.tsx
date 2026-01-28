// src/app/meetings/new/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { StepProgress } from "@/components/ui/StepProgress";
import { Card } from "@/components/ui/card";

const stepMap: Record<string, number> = {
  "/meetings/new/step1-basic": 33,
  "/meetings/new/step2-meetingmembers": 67,
  "/meetings/new/step3-result": 100,
};

const STEPS = [
  { label: "모임생성", path: "/meetings/new/step1-basic" },
  { label: "참여자", path: "/meetings/new/step2-meetingmembers" },
  { label: "추천장소", path: "/meetings/new/step3-result" },
];

export default function MeetingsNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const progress = stepMap[pathname] ?? 0;
  const hideProgressBar = pathname === "/meetings/new";

  return (
    <div className="space-y-6">
      {!hideProgressBar && (
        <Card className="border border-[var(--border)] bg-[var(--bg)]">
          <div className="space-y-4 p-4">
            {/* Step Labels */}
            <div className="flex justify-between text-xs">
              {STEPS.map((step) => {
                const isActive = pathname === step.path;

                return (
                  <div key={step.path} className="flex-1 text-center">
                    <span
                      className={
                        isActive
                          ? "font-semibold text-[var(--text)]"
                          : "text-[var(--text-subtle)]"
                      }
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <StepProgress
              value={progress}
              className="h-2 bg-[var(--neutral-soft)]"
              indicatorClassName="bg-[var(--primary)]"
            />
          </div>
        </Card>
      )}

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
