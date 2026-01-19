// src/app/meetings/[meetingId]/complete/page.tsx
"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import CompleteSummaryCard from "@/components/meeting/Step6/CompleteSummaryCard";
import CompleteMapSection from "@/components/meeting/Step6/CompleteMapSection";
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";
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
  };

  return (
    <main className="space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">📍 확정 모임 정보</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          카카오톡으로 메시지를 전송 할 수 있습니다.
        </p>
      </div>
      {/* 확정 장소 지도 */}
      <CompleteMapSection lat={resolvedData?.lat} lng={resolvedData?.lng} />

      {/* 확정 정보 요약 카드 */}
      <CompleteSummaryCard meeting={meeting} />

      <BottomTabNavigation />
    </main>
  );
}
