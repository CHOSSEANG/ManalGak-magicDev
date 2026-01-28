// src/app/meetings/[meetingId]/complete/page.tsx
"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";

import CompleteSummaryDrawer from "@/components/meeting/Step6/CompleteSummaryDrawer";
import CompleteMapSection from "@/components/meeting/Step6/CompleteMapSection";
import { useMeetingComplete } from "@/lib/hooks/useMeetingComplete";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function MeetingCompletePage({ params }: PageProps) {
  // ✅ Next.js 15 방식
  const { meetingId } = use(params);

  const searchParams = useSearchParams();
  const candidateIdParam = searchParams.get("candidateId");
  const candidateId = candidateIdParam ? Number(candidateIdParam) : undefined;
  const resolvedCandidateId = Number.isFinite(candidateId)
    ? candidateId
    : undefined;

  const { data, isLoading, error } = useMeetingComplete(
    meetingId,
    resolvedCandidateId
  );

  const meeting = {
    meetingName: data?.meetingName ?? "",
    dateTime: data?.dateTime ?? "",
    memberCount: data?.memberCount,
    category: data?.category ?? "",
    placeName: data?.placeName ?? "",
    address: data?.address ?? "",
    parkingInfo: data?.parkingInfo ?? "",
    reservationInfo: data?.reservationInfo ?? "",
    phoneNumber: data?.phoneNumber ?? "",
    organizerId: Number(data?.organizerId ?? 0),
  };

  /* ======================
   * UI State: Loading
   * ====================== */
  if (isLoading) {
    return (
      <main className="relative h-[100dvh] bg-[var(--bg)]">
        <CompleteMapSection />

        <div className="absolute inset-x-0 top-3 z-20 flex justify-center px-4">
          <Card className="w-full max-w-sm border-[var(--border)] bg-[var(--bg)]">
            <CardContent className="py-4 text-center">
              <p className="text-sm font-medium text-[var(--text)]">
                모임 확정 정보를 불러오는 중…
              </p>
              <p className="mt-1 text-xs text-[var(--text-subtle)]">
                잠시만 기다려 주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  /* ======================
   * UI State: Error
   * ====================== */
  if (error) {
    return (
      <main className="relative h-[100dvh] bg-[var(--bg)]">
        <CompleteMapSection />

        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <Card className="w-full max-w-sm border-[var(--border)] bg-[var(--bg)]">
            <CardContent className="space-y-3 py-6 text-center">
              <h1 className="text-base font-semibold text-[var(--text)]">
                모임 정보를 불러오지 못했어요
              </h1>
              <p className="text-sm text-[var(--text-subtle)]">
                네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-[var(--border)]"
                onClick={() => window.location.reload()}
              >
                새로고침
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  /* ======================
   * UI State: Empty
   * ====================== */
  if (!data) {
    return (
      <main className="relative h-[100dvh] bg-[var(--bg)]">
        <CompleteMapSection />

        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <Card className="w-full max-w-sm border-[var(--border)] bg-[var(--bg)]">
            <CardContent className="space-y-2 py-6 text-center">
              <h1 className="text-base font-semibold text-[var(--text)]">
                표시할 모임 확정 정보가 없어요
              </h1>
              <p className="text-sm text-[var(--text-subtle)]">
                링크가 올바른지 확인해 주세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  /* ======================
   * Normal UI
   * ====================== */
  return (
    <main className="relative h-[100dvh] bg-[var(--bg)]">
      {/* 배경 지도 */}
      <CompleteMapSection lat={data.lat} lng={data.lng} />

      {/* 상단 타이틀 */}
      <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-4">
        <Card className="border-[var(--border)] bg-[var(--bg)]">
          <CardContent className="px-4 py-2">
            <h1 className="text-sm font-semibold tracking-tight text-[var(--text)]">
              모임 확정
            </h1>
          </CardContent>
        </Card>
      </div>

      {/* 드로워 */}
      <div className="relative z-10">
        <CompleteSummaryDrawer meeting={meeting} />
      </div>
    </main>
  );
}
