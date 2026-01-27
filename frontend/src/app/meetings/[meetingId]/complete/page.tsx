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
  <main className="relative h-[100dvh] overflow-hidden">
    {/* 배경 지도 */}
    <CompleteMapSection
      lat={resolvedData?.lat}
      lng={resolvedData?.lng}
    />

    {/* 위에 올라오는 UI */}
    <div className="relative z-10">
      <CompleteSummaryDrawer meeting={meeting} />
    </div>
  </main>
)
}
