"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 기존 로직 컴포넌트 (변경 없음)
import PlaceList from "@/components/meeting/Step4/PlaceList";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function Step4ResultContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const meetingUuid = searchParams.get("meetingUuid");

  // =====================
  // meetingUuid 없음 (Empty State)
  // =====================
  if (!meetingUuid) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md space-y-4">
          {/* 1/30[유리] - 타이틀 카드 제거, 구조만 유지 */}
          <h2 className="text-lg font-semibold text-[var(--text)]">
            아직 모임이 없어요
          </h2>
          <p className="text-sm text-[var(--text-subtle)]">
            Step1에서 모임을 생성해야 <br />
            추천 장소를 확인할 수 있어요.
          </p>

          <Button
            className="w-full py-6 bg-[var(--primary)] text-[var(--primary-foreground)]"
            onClick={() => {
              router.push("/meetings/new/step1-basic");
            }}
          >
            Step1로 이동
          </Button>
        </div>
      </main>
    );
  }

  // =====================
  // 정상 화면
  // =====================
  return (
    <>
      <main className="relative min-h-screen pb-32">
        {/* ===== Header ===== */}
        <section className="mx-auto max-w-xl px-4 pt-6 space-y-2">
          {/* 1/30[유리] - 타이틀을 감싸는 Card 제거 */}
          <h2 className="text-lg font-semibold text-[var(--text)]">
            추천 장소 확정
          </h2>
          <p className="text-sm text-[var(--text-subtle)]">
            참여 멤버들의 중간지점과 추천 장소를 확인하고,
            최종 장소를 확정할 수 있어요.
          </p>
        </section>

        {/* ===== 추천 장소 ===== */}
        <section className="mx-auto mt-6 max-w-xl px-4">
          <Suspense
            fallback={
              <div className="space-y-3">
                <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
                <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
                <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
              </div>
            }
          >
            <PlaceList />
          </Suspense>
        </section>
      </main>

      {/* ===== 하단 확정 버튼 ===== */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--bg)] px-4 py-4">
        {/* 1/30[유리] - 이전/다음 제거, 단일 확정 버튼 */}
        <Button
          className="w-full py-6 bg-[var(--primary)] text-[var(--primary-foreground)]"
          onClick={() => {
            router.push(`/meetings/${meetingUuid}/complete`);
          }}
        >
          추천장소확정
        </Button>
      </div>
    </>
  );
}

export default function Step4ResultPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Skeleton className="h-24 w-64 rounded-xl bg-[var(--neutral-soft)]" />
        </div>
      }
    >
      <Step4ResultContent />
    </Suspense>
  );
}
