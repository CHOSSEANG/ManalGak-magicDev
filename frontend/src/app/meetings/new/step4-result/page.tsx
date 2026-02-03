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
      <div className="fixed inset-0 z-0">
        <Step4Map meetingUuid={meetingUuid} />
      </div>

      {/* ================= 상단 레이어 ================= */}
      <header
        className="
          fixed top-4 left-1/2 z-20
          w-[calc(100%-2rem)]
          -translate-x-1/2
          pointer-events-none
        "
      >
        <h1 className="text-lg font-semibold text-[var(--text)] drop-shadow-sm">
          추천 장소 확정
        </h1>
        <p className="mt-1 text-sm text-[var(--text-subtle)] drop-shadow-sm">
          참여 멤버들의 중간지점과 추천 장소를 확인하고,
          최종 장소를 확정할 수 있어요.
        </p>
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
          <Step3PlaceList onStatusLoaded={setMeetingStatus} />
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
