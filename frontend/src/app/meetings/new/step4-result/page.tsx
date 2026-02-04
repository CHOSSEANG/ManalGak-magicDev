"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

import Step3PlaceList from "@/components/meeting/Step3/Step3PlaceList";
import Step4Map from "@/components/map/Step4Map";

import { Skeleton } from "@/components/ui/skeleton";
import CompletedMeetingNotice from "@/components/common/CompletedMeetingNotice";
import RequireMeeting from "@/components/common/RequireMeeting";

function Step4Content(): JSX.Element {
  const searchParams = useSearchParams();
  const meetingUuid = searchParams.get("meetingUuid");
  const [meetingStatus, setMeetingStatus] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedPlaceName, setConfirmedPlaceName] = useState<string | null>(null);

  // ✅ Step4 진입 시 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!meetingUuid) return <RequireMeeting />;
  if (meetingStatus === "COMPLETED") {
    return <CompletedMeetingNotice meetingUuid={meetingUuid} />;
  }

  return (
    <>
      {/* ================= 지도 배경 ================= */}
      <div className="app-container fixed inset-0 z-10">
        <Step4Map meetingUuid={meetingUuid} />
      </div>

      {/* ================= 상단 레이어 ================= */}
      <header
        className="
          app-container  fixed top-40 left-1/2 z-10
          w-[calc(100%-2rem)]
          -translate-x-1/2
          pointer-events-none
        "
      >
        <h1 className="text-lg font-semibold text-[var(--text)] drop-shadow-sm">
          추천 장소 확정
        </h1>
        <p className="mt-1 text-sm text-[var(--text-subtle)] drop-shadow-sm">
          {isConfirmed
            ? "장소가 이미 확정되었습니다."
            : "최종 장소를 확정하세요."}
        </p>
        {isConfirmed && confirmedPlaceName && (
          <p className="mt-1 text-xs text-[var(--text-subtle)] drop-shadow-sm">
            확정 장소: {confirmedPlaceName}
          </p>
        )}
      </header>

      {/* ================= 하단 Drawer 영역 ================= */}
      <div className="fixed inset-x-0 bottom-0 z-30">
        <Suspense
          fallback={
            <div className="p-4 space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          }
        >
          <Step3PlaceList
            onStatusLoaded={setMeetingStatus}
            onConfirmedChange={(confirmed, place) => {
              setIsConfirmed(confirmed);
              setConfirmedPlaceName(place?.name ?? null);
            }}
          />
        </Suspense>
      </div>
    </>
  );
}

export default function Step4Page(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Skeleton className="h-24 w-64 rounded-xl" />
        </div>
      }
    >
      <Step4Content />
    </Suspense>
  );
}
