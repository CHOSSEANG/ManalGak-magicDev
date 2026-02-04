// src/app/meetings/[meetingId]/complete/page.tsx
"use client";

import { use, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CompleteSummaryDrawer from "@/components/meeting/Step6/CompleteSummaryDrawer";
import CompleteMapSection from "@/components/meeting/Step6/CompleteMapSection";
import { useMeetingComplete } from "@/lib/hooks/useMeetingComplete";
import { Badge } from "@/components/ui/badge"

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

  const handleDirection = () => {
  const placeName = resolvedData?.placeName
  const lat = resolvedData?.lat
  const lng = resolvedData?.lng

  if (!placeName || lat == null || lng == null) return

  const url = `https://map.kakao.com/link/to/${encodeURIComponent(
    placeName
  )},${lat},${lng}`

  window.open(url, "_blank")
  }
  
  
const formatDateTime = (isoString?: string) => {
  if (!isoString) return '-'

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return '-'

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const period = hours < 12 ? 'am' : 'pm'
  const displayHour = hours % 12 || 12

  return `${yyyy}.${mm}.${dd} ${period} ${displayHour}:${minutes}`
}
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
      <section className="absolute left-0 right-0 top-1 z-40">
        <div className="mx-auto max-w-[var(--app-max-width)] px-4 py-3">
          <h1
            className="
              inline-flex items-center gap-2
              text-left
              text-lg
              font-semibold
              tracking-tight
              text-[var(--text)]
              bg-[var(--bg)]
              px-2
              py-0.5
              rounded
            "
          >
            <span>📍{resolvedData?.placeName || '장소 미확정'}</span>

            <button
              type="button"
              onClick={handleDirection}
              className="pointer-events-auto"
            >
              <Badge
                variant="secondary"
                className="
                  cursor-pointer
                  px-3 py-2
                  rounded-full
                  bg-[--wf-highlight]
                  text-xs
                "
              >
                길찾기
              </Badge>
            </button>
          </h1>
          
          <p
            className="
              inline-block
              mt-1
              text-left
              text-xs
              text-[var(--text-subtle)]
              bg-[var(--bg)]
              px-2
              py-0.5
              rounded
            "
          >
            {resolvedData?.meetingName || '-'} ․ {formatDateTime(resolvedData?.dateTime) || '-'}

          </p>
        </div> 
      </section>

      <div className="relative z-20
      pb-[calc(96px+env(safe-area-inset-bottom))]">
        <CompleteSummaryDrawer meeting={meeting} />
      </div>
    </main>
  );
}
