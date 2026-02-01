// src/app/meetings/new/step4-result/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 기존 로직 컴포넌트 (변경 없음)
import Step3PlaceList from "@/components/meeting/Step3/Step3PlaceList";

// shadcn/ui
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import CompletedMeetingNotice from "@/components/common/CompletedMeetingNotice";
import RequireMeeting from "@/components/common/RequireMeeting";

function Step3Content(): JSX.Element {
  const searchParams = useSearchParams();
  const meetingUuid = searchParams.get("meetingUuid");
  const [meetingStatus, setMeetingStatus] = useState<string | null>(null);

  // =====================
  // meetingUuid 없음 (Empty State)
  // =====================
  if (!meetingUuid) {
    return <RequireMeeting />;
  }

  if (meetingStatus === "COMPLETED" && meetingUuid) {
    return <CompletedMeetingNotice meetingUuid={meetingUuid} />;
  }

  // =====================
  // 정상 화면
  // =====================
  return (
    <>
      <main className="mx-auto max-w-xl pb-28">
        {/* 헤더 */}
        {/* 1/30[유리] - 타이틀을 감싸는 카드/박스 시각적 요소 제거 (구조 유지) */}
        <header className="mb-6">
          <h1 className="text-lg font-semibold text-[var(--text)]">
            추천 장소 확정
          </h1>
          <p className="mt-1 text-sm text-[var(--text-subtle)]">
            참여 멤버들의 중간지점과 추천 장소를 확인하고,
            최종 장소를 확정할 수 있어요.
          </p>
        </header>

        {/* 장소 리스트 */}
        {/* 1/30[유리] - 외곽 카드 제거, 콘텐츠 영역만 유지 */}
        <section>
          <Suspense
            fallback={
              <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
                <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
                <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
              </div>
            }
          >
            <Step3PlaceList onStatusLoaded={setMeetingStatus} />
          </Suspense>
        </section>
      </main>

      {/* 하단 CTA */}
      {/* 1/30[유리] - 기존 이전/다음 네비게이션 제거, 단일 [추천장소확정] 버튼으로 교체 */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-[var(--border)] bg-[var(--bg)] px-4 py-3">
        <Button
          className="w-full py-6 text-base font-medium bg-[var(--danger)] text-white"
        >
          추천장소확정
        </Button>
      </div>
    </>
  );
}

export default function Step3Page(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Skeleton className="h-24 w-64 rounded-xl bg-[var(--neutral-soft)]" />
        </div>
      }
    >
      <Step3Content />
    </Suspense>
  );
}
