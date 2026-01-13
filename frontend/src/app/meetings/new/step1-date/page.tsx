// src/app/meetings/new/step1-date/page.tsx

import StepNavigation from "@/components/layout/StepNavigation";
import Step1Form from "@/components/ui/Step1Form";

export default function Step1Page() {
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 1. 날짜 & 시간</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            만날 날짜와 시간을 선택해 주세요. 선택한 날짜 기준으로 서울의 예상
            날씨를 보여드려요.
          </p>
        </div>

        <Step1Form />
      </main>

      <StepNavigation
        prevHref="/meetings/new"
        nextHref="/meetings/new/step2-purpose"
      />
    </>
  );
}
