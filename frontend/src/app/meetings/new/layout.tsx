"use client";

import { StepProgress } from "@/components/ui/StepProgress";
import { usePathname } from "next/navigation";

const stepMap: Record<string, number> = {
  "/meetings/new/step1-basic": 33,
  "/meetings/new/step3-members": 67,
  "/meetings/new/step5-place": 100,
};

export default function MeetingsNewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const progress = stepMap[pathname] ?? 0;

  return (
    <div className="space-y-6">
      <div className="px-4 pt-4 space-y-3">
        <div className="relative">
          <div className="flex justify-between text-xs px-1">
            {[
              ["Step 1.", "기본 정보", "/meetings/new/step1-basic"],
              ["Step 2.", "참여 멤버", "/meetings/new/step3-members"],
              ["Step 3.", "중간지점 & 추천장소", "/meetings/new/step5-place"],
            ].map(([step, label, path]) => {
              const isActive = pathname === path;
              return (
                <div key={path} className="flex-1 text-center">
                  <span
                    className={
                      isActive ? "text-black font-semibold" : "text-black"
                    }
                  >
                    {step}
                  </span>
                  <span className="ml-1 text-[var(--wf-subtle)]">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <StepProgress
          value={progress}
          className="h-2 bg-[#E6E1D9]"
          indicatorClassName="bg-[#C9B89C]"
        />
      </div>
      {children}
    </div>
  );
}
