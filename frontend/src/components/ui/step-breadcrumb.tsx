// src/components/ui/StepBreadcrumb.tsx
"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

interface StepBreadcrumbProps {
  className?: string;
  steps?: Array<{
    id: string;
    name: string;
    status: "complete" | "current" | "upcoming";
  }>;
}

export function Breadcrumb({
  className,
  steps = [
    { id: "01", name: "모임생성", status: "complete" },
    { id: "02", name: "참여자", status: "current" },
    { id: "03", name: "출발지", status: "upcoming" },
    { id: "04", name: "추천장소", status: "upcoming" },
  ],
}: StepBreadcrumbProps) {
  const router = useRouter();

  return (
    <nav
      className={cn(
        "w-full max-w-screen-lg mx-auto rounded-xl bg-white px-2 py-4 text-gray-900 md:px-6",
        className,
      )}
      aria-label="Progress"
    >
      <ol
        className="
          flex items-center justify-center w-full
          gap-x-2 md:gap-x-6
          overflow-hidden
        "
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* ================= Step Item ================= */}
              <li className="relative flex items-center shrink">
                <button
                  type="button"
                  onClick={() => {
                    const basePath =
                      step.id === "01"
                        ? "/meetings/new/step1-basic"
                        : step.id === "02"
                        ? "/meetings/new/step2-members"
                        : step.id === "03"
                        ? "/meetings/new/step3-meeting"
                        : "/meetings/new/step4-result";

                    const query =
                      typeof window !== "undefined"
                        ? window.location.search
                        : "";

                    router.push(`${basePath}${query}`);
                  }}
                  className="
                    group flex
                    flex-col md:flex-row
                    items-center
                    gap-0.5 md:gap-3
                  "
                >
                  {/* ===== Circle ===== */}
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-full font-medium transition-colors duration-200",
                      "h-6 w-6 text-[10px]", // 🔒 사이즈 고정
                      step.status === "complete"
                        ? "bg-[var(--wf-accent)] text-white"
                        : step.status === "current"
                        ? "border-2 border-[var(--wf-accent)] bg-white text-black"
                        : "border-[1.5px] border-gray-300 bg-white text-gray-500",
                    )}
                  >
                    {step.status === "complete" ? (
                      <Check className="h-3.5 w-3.5" /> // 🔒 아이콘 사이즈 고정
                    ) : (
                      step.id
                    )}
                  </span>

                  {/* ===== Label ===== */}
                  <span
                    className={cn(
                      "font-medium whitespace-nowrap text-xs", // 🔒 텍스트 사이즈 고정
                      step.status === "complete"
                        ? "text-[var(--wf-accent)]"
                        : step.status === "current"
                        ? "text-black"
                        : "text-gray-500",
                    )}
                  >
                    {step.name}
                  </span>
                </button>
              </li>

              {/* ================= Separator ================= */}
              {!isLast && (
                <div className="flex-1 flex items-center mx-1.5 md:mx-4 min-w-[8px]">
                  <div
                    className={cn(
                      "h-0.5 w-full transition-colors duration-300",
                      step.status === "complete"
                        ? "bg-[var(--wf-accent)]"
                        : "bg-gray-200",
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
