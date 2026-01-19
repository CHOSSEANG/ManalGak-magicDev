// src/components/meeting/CompleteSummaryCard.tsx
"use client";

import StepCard from "@/components/meeting/StepCard";
import KakaoMap from "@/components/map/KakaoMap";

declare global {
  interface Window {
    Kakao: any;
  }
}

export interface MeetingSummary {
  meetingName: string;
  dateTime: string;
  memberCount: number;
  category: string;
  placeName: string;
  address: string;
  parkingInfo: string;
  reservationInfo: string;
  phoneNumber: string;
}

interface Props {
  meeting: MeetingSummary;
}

export default function CompleteSummaryCard({ meeting }: Props) {
  const {
    meetingName,
    dateTime,
    memberCount,
    category,
    placeName,
    address,
    parkingInfo,
    reservationInfo,
    phoneNumber,
  } = meeting;

  const handleSendKakao = () => {
    if (typeof window === "undefined" || !window.Kakao) return;

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }

    window.Kakao.Share.sendDefault({
      objectType: "text",
      text:
        `📌 확정된 모임 정보\n\n` +
        `모임명: ${meetingName}\n` +
        `일시: ${dateTime}\n` +
        `인원: ${memberCount}명\n` +
        `카테고리: ${category}\n` +
        `장소: ${placeName}\n` +
        `주소: ${address}\n` +
        `주차: ${parkingInfo}\n` +
        `사전예약: ${reservationInfo}\n` +
        `전화번호: ${phoneNumber}`,
      link: {
        mobileWebUrl: window.location.origin,
        webUrl: window.location.origin,
      },
    });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">확정된 모임 정보</h2>

      <StepCard className="space-y-4 bg-[var(--wf-muted)] p-3">
        {/* 상단 요약 */}
        <div className="flex justify-between rounded-xl bg-gray-200 p-4 text-sm">
          <div className="space-y-1">
            <p>모임명 : {meetingName}</p>
            <p>일시 : {dateTime}</p>
          </div>
          <div className="font-semibold">모임인원 : {memberCount}인</div>
        </div>

        {/* 장소 정보 */}
        <div className="flex justify-between gap-4">
          <div className="space-y-1 text-sm ">
            <p>
              {category} · {placeName}
            </p>
            <p>{address}</p>
            <p>주차 : {parkingInfo}</p>
            <p>사전 예약 : {reservationInfo}</p>
            <p>번호 : {phoneNumber}</p>
          </div>

          <button
            onClick={handleSendKakao}
            className="h-fit rounded-xl bg-yellow-400 px-3 py-9 text-sm font-semibold hover:bg-[var(--wf-accent)]"
          >
            확정정보
            <br />
            카카오톡 공유
          </button>
        </div>
      </StepCard>
    </section>
  );
}
