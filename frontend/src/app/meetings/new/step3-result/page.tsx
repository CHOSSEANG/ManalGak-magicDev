// src/app/meetings/new/step3-result/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import StepNavigation from "@/components/layout/StepNavigation";
import Step3PlaceList from "@/components/meeting/Step4/Step3PlaceList";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import CompletedMeetingNotice from "@/components/common/CompletedMeetingNotice";

function Step3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingUuid = searchParams.get("meetingUuid");
  const readonlyParam = searchParams.get("readonly") === "true";
  const { loading } = useUser();

  const [meetingStatus, setMeetingStatus] = useState<string | null>(null);

  if (!meetingUuid) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            👋 아직 모임이 없어요
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            먼저 Step1에서 모임을 생성해야 <br />
            Step2/Step3 페이지를 사용할 수 있습니다.
          </p>
          <button
            onClick={() => router.push("/meetings/new/step1-basic")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
          >
            Step1로 이동
          </button>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // ⭐ COMPLETED 상태 체크 - 확정된 모임 안내 카드 표시
  if (meetingStatus === 'COMPLETED') {
    return <CompletedMeetingNotice meetingUuid={meetingUuid} />;
  }

  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">추천장소 확정</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            참여 멤버들의 중간지점 및 추천 장소를 보여드립니다. 필요시 투표도
            가능합니다
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="text-sm text-gray-500">장소 정보를 불러오는 중...</div>
          </div>
        }>
          <Step3PlaceList onStatusLoaded={setMeetingStatus} />
        </Suspense>
      </main>

      <StepNavigation
        prevHref={`/meetings/new/step2-meetingmembers?meetingUuid=${meetingUuid}${readonlyParam ? "&readonly=true" : ""}`}
        nextHref={`/meetings/${meetingUuid}/complete${readonlyParam ? "?readonly=true" : ""}`}
        nextLabel="확정 내용 확인"
      />
    </>
  );
}

export default function Step3Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-gray-500">로딩 중...</div>
        </div>
      }
    >
      <Step3Content />
    </Suspense>
  );
}