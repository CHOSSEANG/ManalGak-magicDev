// src/app/meetings/[meetingId]/complete/page.tsx
"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import CompleteSummaryDrawer from "@/components/meeting/Step6/CompleteSummaryDrawer";
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
      <CompleteMapSection
        meetingUuid={meetingId} // ✅ 1/30[유리] - CompleteMapSection 필수 props 명시 전달
        lat={resolvedData?.lat}
        lng={resolvedData?.lng}
        placeName={resolvedData?.placeName}
      />

      {/* 1/30[유리] - 타이틀 좌측 정렬 + 배경 추가로 가독성 개선 */}
      <section className="pointer-events-none absolute left-0 right-0 top-16 z-20 px-4">
        <div className="mx-auto max-w-[var(--app-max-width)] rounded-lg bg-[var(--bg-soft)] px-4 py-3 shadow-sm">
          <h1 className="text-left text-lg font-semibold tracking-tight text-[var(--text)]">
            모임 확정
          </h1>
          <p className="mt-1 text-left text-xs text-[var(--text-subtle)]">
            확정된 장소와 이동 정보를 확인하세요.
          </p>
        </div>
      </section>

      {/* 1/30[유리] - Drawer 폭을 app-container 기준으로 제한 */}
      {/* 1/30[유리] - Bottom Navigation과 Drawer 하단 버튼 간 여백 확보 */}
      <div className="relative z-10 mx-auto max-w-[var(--app-max-width)] pb-[calc(96px+env(safe-area-inset-bottom))]">
        <CompleteSummaryDrawer meeting={meeting} />
      </div>
    </main>
  );
}
