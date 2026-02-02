// src/app/meetings/[meetingId]/complete/page.tsx
"use client";

import { use, useEffect  } from "react";
import { useSearchParams } from "next/navigation";
import CompleteSummaryDrawer from "@/components/meeting/Step6/CompleteSummaryDrawer";
import CompleteMapSection from "@/components/meeting/Step6/CompleteMapSection";
import { useMeetingComplete } from "@/lib/hooks/useMeetingComplete";

// 🔧 로그인 가드
import { useUser } from "@/context/UserContext";
import LoginRequired from "@/components/common/LoginRequired";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function MeetingCompletePage({ params }: PageProps) {
  // =========================
  // ✅ 모든 Hook은 최상단
  // =========================
  const { user } = useUser();

    useEffect(() => {
      // 🔒 페이지 전체 스크롤 잠금
      const originalOverflow = document.body.style.overflow;
      const originalHeight = document.body.style.height;

      document.body.style.overflow = "hidden";
      document.body.style.height = "100dvh";

      return () => {
        // 🔓 페이지 벗어날 때 원복
        document.body.style.overflow = originalOverflow;
        document.body.style.height = originalHeight;
      };
    }, []);

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

  // =========================
  // ✅ 로그인 가드 (Hook 이후)
  // =========================
  if (!user) {
    return <LoginRequired />;
  }

  // =========================
  // 기존 로직 (변경 없음)
  // =========================
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
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[var(--bg)]">
      {/* 배경 지도 */}
      <CompleteMapSection
        meetingUuid={meetingId}
        lat={resolvedData?.lat}
        lng={resolvedData?.lng}
        placeName={resolvedData?.placeName}
      />

      {/* 타이틀 */}
      <section className="pointer-events-none absolute left-0 right-0 top-1 z-10">
        <div className="mx-auto max-w-[var(--app-max-width)] px-4 py-3">
          <h1 className="text-left text-lg font-semibold tracking-tight text-[var(--text)] bg-[var(--primary-soft)">
            모임 확정
          </h1>
          <p className="mt-1 text-left text-xs text-[var(--text-subtle)] bg-[var(--primary-soft)">
            확정된 장소와 이동 정보를 확인하세요.
          </p>
        </div>
      </section>

      <div className="relative z-20 mx-auto max-w-[var(--app-max-width)] pb-[calc(96px+env(safe-area-inset-bottom))]">
        <CompleteSummaryDrawer meeting={meeting} />
      </div>
    </main>
  );
}
