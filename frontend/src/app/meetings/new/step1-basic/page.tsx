// src/app/meetings/new/step1-basic/page.tsx
"use client";

import { useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StepNavigation from "@/components/layout/StepNavigation";
import Step1Form, { Step1FormRef } from "@/components/meeting/Step1/Step1Form";

// useSearchParams를 사용하는 컴포넌트를 분리
function Step1Content() {
  const formRef = useRef<Step1FormRef>(null);
  const searchParams = useSearchParams();
  const meetingUuid = searchParams.get("meetingUuid") || undefined;

  const handleNext = async () => {
    if (!formRef.current) {
      throw new Error("Form ref not found");
    }

    if (!formRef.current.isValid()) {
      alert("모든 필수 정보를 입력해주세요.");
      throw new Error("Validation failed");
    }

    // 생성 OR 수정 (meetingUuid 유무에 따라 자동 판단)
    const resultMeetingUuid = await formRef.current.createOrUpdateMeeting();

    if (!resultMeetingUuid) {
      throw new Error("Meeting creation/update failed");
    }

    return `/meetings/new/step2-meetingmembers?meetingUuid=${resultMeetingUuid}`;
  };

  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Step 1. 기본 정보 {meetingUuid && <span className="text-sm text-gray-500">(수정)</span>}
          </h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            모임의 기본 정보와 목적, 일정을 한 번에 설정해 주세요. 선택한 정보에
            맞춰 최적의 장소를 추천해 드립니다.
          </p>
        </div>

        <Step1Form ref={formRef} meetingUuid={meetingUuid} />
      </main>

      <StepNavigation
        prevHref="/meetings/new"
        nextHref="#"
        onNext={handleNext}
      />
    </>
  );
}

// Suspense로 감싸서 export
export default function Step1BasicPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-gray-500">로딩 중...</div>
      </div>
    }>
      <Step1Content />
    </Suspense>
  );
}