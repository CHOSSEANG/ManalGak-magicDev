// src/app/meetings/new/step4-result/page.tsx
"use client";

import { useState,Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 기존 로직 컴포넌트 (변경 없음)
import StepNavigation from "@/components/layout/StepNavigation";
import Step3PlaceList from "@/components/meeting/Step3/Step3PlaceList";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CompletedMeetingNotice from "@/components/common/CompletedMeetingNotice";

function Step3Content(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingUuid = searchParams.get("meetingUuid");
  const [meetingStatus, setMeetingStatus] = useState<string | null>(null);
  // =====================
  // meetingUuid 없음 (Empty State)
  // =====================
  if (!meetingUuid) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <Card className="w-full max-w-md border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">
              아직 모임이 없어요
            </CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              Step1에서 모임을 생성해야 <br />
              추천 장소를 확인할 수 있어요.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
              onClick={() => {
                router.push("/meetings/new/step1-basic");
              }}
            >
              Step1로 이동
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }
  if (meetingStatus === 'COMPLETED' && meetingUuid) {
    return <CompletedMeetingNotice meetingUuid={meetingUuid} />
  }
  // =====================
  // 정상 화면
  // =====================
  return (
    <>
      <main className="mx-auto max-w-xl space-y-6 pb-28">
        {/* 헤더 */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">
              추천 장소 확정
            </CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              참여 멤버들의 중간지점과 추천 장소를 확인하고,
              최종 장소를 확정할 수 있어요.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 장소 리스트 */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      </main>

      {/* 하단 네비게이션 */}
      <StepNavigation
        prevHref={`/meetings/new/step2-meetingmembers?meetingUuid=${meetingUuid}`}
        nextHref={`/meetings/${meetingUuid}/complete`}
        nextLabel="확정 내용 확인"
      />
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
