// src/app/meetings/new/step4-origin/page.tsx
"use client";
import StepNavigation from "@/components/layout/StepNavigation";
import Step4Form from "@/components/meeting/Step4/Step4Form";

export default function Step4Page() {
  // 와이어프레임 단계: Step 4
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 4. 출발지 & 이동수단</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            출발지를 입력하고, 교통수단을 선택해 주세요.
          </p>
        </div>
        <Step4Form />
      </main>

      <StepNavigation
        prevHref="/meetings/new/step3-members"
        nextHref="/meetings/new/step5-place"
      />
    </>
  );
}
