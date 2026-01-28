// src/app/meetings/[meetingId]/complete/page.tsx
"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import CompleteSummaryDrawer from '@/components/meeting/Step6/CompleteSummaryDrawer'
import CompleteMapSection from "@/components/meeting/Step6/CompleteMapSection";
import { useMeetingComplete } from "@/lib/hooks/useMeetingComplete";

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
  const resolvedData = !isLoading && !error ? data : null;

  const meeting = {
    meetingName: resolvedData?.meetingName ?? "",
    dateTime: resolvedData?.dateTime ?? "",
    memberCount: resolvedData?.memberCount,
    category: resolvedData?.category ?? "",
    placeName: resolvedData?.placeName ?? "",
    address: resolvedData?.address ?? "",
    parkingInfo: resolvedData?.parkingInfo ?? "",
    reservationInfo: resolvedData?.reservationInfo ?? "",
    phoneNumber: resolvedData?.phoneNumber ?? "",
    organizerId: Number(resolvedData?.organizerId ?? 0),
  };

  return (
    <main className="relative min-h-[100dvh] w-full overflow-visible bg-[var(--bg)]">
      {/* 배경 지도 */}
      <CompleteMapSection lat={resolvedData?.lat} lng={resolvedData?.lng} />

      {/* 지도 위 상단 타이틀 */}
      <section className="pointer-events-none absolute left-0 right-0 top-16 z-20 flex flex-col items-center gap-1 px-4">
        {/* Header는 카드 대신 타이포로 분리 */}
        <h1 className="text-lg font-semibold tracking-tight text-[var(--text)] drop-shadow-sm">
          모임 확정
        </h1>
        <p className="text-xs text-[var(--text-subtle)] drop-shadow-sm">
          확정된 장소와 이동 정보를 확인하세요.
        </p>
      </section>

      {/* 위에 올라오는 UI */}
      <div className="relative z-10 pb-[calc(72px+env(safe-area-inset-bottom))]">
        <CompleteSummaryDrawer meeting={meeting} />
      </div>
    </main>
  );
}
