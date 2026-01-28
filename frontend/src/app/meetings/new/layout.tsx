// src/app/meetings/new/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { StepProgress } from "@/components/ui/StepProgress";

const stepMap: Record<string, number> = {
  "/meetings/new/step1-basic": 25,
  "/meetings/new/step2-members": 50,
  "/meetings/new/step3-meeting": 75,
  "/meetings/new/step4-result": 100,
};

const STEPS = [
  { label: "모임생성", path: "/meetings/new/step1-basic" },
  { label: "참여자", path: "/meetings/new/step2-members" },
  { label: "출발지", path: "/meetings/new/step3-meeting" },
  { label: "추천장소", path: "/meetings/new/step4-result" },
];

export default function MeetingsNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const progress = stepMap[pathname] ?? 0;
  const hideProgressBar = pathname === "/meetings/new";

  let progressSection: React.ReactNode = null;
  if (!hideProgressBar) {
    progressSection = (
      <div className="">
          {/* Step Labels */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            {STEPS.map((step) => {
              const isActive = pathname === step.path;

              let labelClass = "text-[var(--text-subtle)]";
              if (isActive) {
                labelClass = "font-semibold text-[var(--text)]";
              }

              return (
                <div key={step.path} className="text-center">
                  <span className={labelClass}>{step.label}</span>
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
    );
  }

  return (
    <div className="space-y-6">
      {progressSection}

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
