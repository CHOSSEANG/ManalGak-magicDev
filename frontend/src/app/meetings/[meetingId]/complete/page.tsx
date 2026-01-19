// src/app/meetings/[meetingId]/complete/page.tsx
"use client";

import { use } from "react";
import CompleteSummaryCard from "@/components/meeting/Step6/CompleteSummaryCard";
import CompleteMapSection from "@/components/meeting/Step6/CompleteMapSection";
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";

interface PageProps {
  params: Promise<{
    meetingId: string;
  }>;
}

export default function MeetingCompletePage({ params }: PageProps) {
  // ✅ Next.js 15 방식
  const { meetingId } = use(params);

  // TODO: 추후 API 연동
  const meeting = {
    meetingName: "공주파티", // ✅ key 수정
    dateTime: "2026.01.23 12:00",
    memberCount: 5,
    category: "카페",
    placeName: "이리카페",
    address: "서울 마포구 와우산로3길 27",
    parkingInfo: "가능 (유료 10분당 1,200원)",
    reservationInfo: "가능",
    phoneNumber: "02-323-7861",
    lat: 37.563617,
    lng: 126.997628,
  };

  return (
       <main className="space-y-6 pb-24">
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold">
                  📍 확정 모임 정보
                </h1>
                <p className="text-sm text-[var(--wf-subtle)]">
                  카카오톡으로 메시지를 전송 할 수 있습니다.
                </p>
              </div>
      {/* 확정 장소 지도 */}
      <CompleteMapSection lat={meeting.lat} lng={meeting.lng} />

      {/* 확정 정보 요약 카드 */}
      <CompleteSummaryCard meeting={meeting} />

       <BottomTabNavigation />
    </main>
  );
}
