// src/app/meetings/[meetingId]/complete/page.tsx
"use client";

import { use } from "react";
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
  const { data, isLoading, error } = useMeetingComplete(meetingId);

  if (isLoading) {
    return (
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">📍 확정 모임 정보</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            카카오톡으로 메시지를 전송 할 수 있습니다.
          </p>
        </div>
        <p className="text-sm text-[var(--wf-subtle)]">로딩 중...</p>
        <BottomTabNavigation />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">📍 확정 모임 정보</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            카카오톡으로 메시지를 전송 할 수 있습니다.
          </p>
        </div>
        <p className="text-sm text-[var(--wf-subtle)]">
          모임 정보를 불러오지 못했습니다.
        </p>
        <BottomTabNavigation />
      </main>
    );
  }

  const meeting = {
    meetingName: data.meetingName,
    dateTime: data.dateTime,
    memberCount: data.members.length,
    category: data.category,
    placeName: data.place.name,
    address: data.place.address,
    parkingInfo: "",
    reservationInfo: "",
    phoneNumber: "",
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
      <CompleteMapSection lat={data.place.lat} lng={data.place.lng} />

      {/* 확정 정보 요약 카드 */}
      <CompleteSummaryCard meeting={meeting} />

      <BottomTabNavigation />
    </main>
  );
}
