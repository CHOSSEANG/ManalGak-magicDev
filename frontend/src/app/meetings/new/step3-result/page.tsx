// src/app/meetings/new/step5-place/page.tsx
"use client";

import StepNavigation from "@/components/layout/StepNavigation";
import Step5PlaceList from "@/components/meeting/Step3/Step3PlaceList";

export default function Step3Page() {
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Step 3. 중간지점 & 추천장소
          </h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            참여 멤버들의 중간지점 및 추천 장소를 보여드립니다.
          </p>
        </div>

        <Step5PlaceList />
      </main>

      <StepNavigation
        prevHref="/meetings/new/step2-meetingmembers"
        nextHref="/meetings/meeting-001/complete"
        nextLabel="확정 내용 확인"
      />
    </>
  );
}
