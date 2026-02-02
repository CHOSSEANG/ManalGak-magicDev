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
        // px-2: 여백을 너무 줄이면 답답하므로 살짝 확보
        "w-full max-w-screen-lg mx-auto rounded-xl bg-white px-2 py-4 text-gray-900 md:px-6",
        className,
      )}
      aria-label="Progress"
    >
      {/* overflow-x-auto: 혹시라도 화면이 아주 작은(320px 이하) 폰을 위해 스크롤 안전장치 유지 */}
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
              {/* --- 1. 스텝 아이템 --- */}
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
                  // 간격(gap)도 요소가 커진 만큼 아주 조금 넓힘 (1.5 = 6px)
                  className="
                    group flex
                    flex-col xs:flex-row
                    items-center
                    gap-0.5 xs:gap-1 md:gap-3
                  "
                >
                  {/* 동그라미 */}
                  <span
                    className={cn(
                      "flex items-center justify-center rounded-full font-medium transition-colors duration-200",
                      // [Size UP]
                      // 모바일: h-6 w-6 (24px)
                      // 데스크탑: h-8 w-8 (32px)
                      "h-6 w-6 text-[10px] md:h-8 md:w-8 md:text-sm",
                      step.status === "complete"
                        ? "bg-[var(--wf-accent)] text-white"
                        : step.status === "current"
                          ? "border-2 border-[var(--wf-accent)] bg-white text-black"
                          : "border-[1.5px] md:border-2 border-gray-300 bg-white text-gray-500",
                    )}
                  >
                    {step.status === "complete" ? (
                      // 체크 아이콘 사이즈도 동그라미에 맞춰 키움
                      <Check className="h-3.5 w-3.5 md:h-5 md:w-5" />
                    ) : (
                      step.id
                    )}
                  </span>
                  
                  {/* 텍스트 라벨 */}
                  <span
                    className={cn(
                      "font-medium whitespace-nowrap",
                      // [Size UP]
                      // 모바일: text-xs (12px, 읽기 편한 최소 크기)
                      // 데스크탑: text-base (16px, 시원시원한 크기)
                      "text-xs md:text-base",
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

              {/* --- 2. 연결선 (Separator) --- */}
              {!isLast && (
                // mx-1.5: 요소들이 커졌으므로 선 좌우 여백도 살짝 숨통을 트임
                // min-w-[8px]: 글씨가 커져서 공간이 좁아질 수 있으므로, 선의 최소 길이를 조금 줄여서라도 레이아웃 깨짐 방지
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
