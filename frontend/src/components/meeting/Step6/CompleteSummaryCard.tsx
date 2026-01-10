// src/components/meeting/CompleteSummaryCard.tsx
'use client'

import StepCard from '@/components/meeting/StepCard'

export interface MeetingSummary {
  meetingName: string
  dateTime: string
  memberCount: number
  category: string
  placeName: string
  address: string
  parkingInfo: string
  reservationInfo: string
  phoneNumber: string
}

interface Props {
  meeting: MeetingSummary
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
  } = meeting

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">확정된 중간지점 정보</h2>

      <StepCard className="space-y-4 bg-[var(--wf-muted)] p-5">
        {/* 상단 요약 */}
        <div className="flex justify-between rounded-xl bg-white p-4 text-sm">
          <div className="space-y-1">
            <p>모임명 : {meetingName}</p>
            <p>일시 : {dateTime}</p>
          </div>
          <div className="font-semibold">
            모임인원 : {memberCount}인
          </div>
        </div>

        {/* 장소 정보 */}
        <div className="flex justify-between gap-4">
          <div className="space-y-1 text-sm">
            <p>
              {category} · {placeName}
            </p>
            <p>{address}</p>
            <p>주차 : {parkingInfo}</p>
            <p>사전 예약 : {reservationInfo}</p>
            <p>번호 : {phoneNumber}</p>
          </div>

          <button className="h-fit rounded-xl bg-yellow-400 px-3 py-9 text-sm font-semibold hover:bg-[var(--wf-accent)]">
            확정장소
            <br />
            메시지 전송
          </button>
        </div>
      </StepCard>
    </section>
  )
}
