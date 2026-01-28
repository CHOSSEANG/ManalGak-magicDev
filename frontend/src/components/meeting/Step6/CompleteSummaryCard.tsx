// src/components/meeting/Step6/CompleteSummaryCard.tsx
'use client'

import type { ReactNode } from 'react'

export interface MeetingSummary {
  meetingName: string
  dateTime: string
  memberCount?: number
  category: string
  placeName: string
  address: string
  parkingInfo: string
  reservationInfo: string
  phoneNumber: string
  organizerId: number
}

interface Props {
  meeting: MeetingSummary
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[var(--text-subtle)]">{label}</span>
      <span className="text-right text-[var(--text)]">{value}</span>
    </div>
  )
}

export default function CompleteSummaryCard({ meeting }: Props) {
  const meetingName = meeting.meetingName || '모임 이름 미정'
  const dateTime = meeting.dateTime || '일정 미정'
  const memberCount =
    typeof meeting.memberCount === 'number' ? `${meeting.memberCount}명` : '참여 인원 미정'
  const category = meeting.category || '목적 미정'
  const placeName = meeting.placeName || '장소 미정'
  const address = meeting.address || '주소 미정'
  const phoneNumber = meeting.phoneNumber || '연락처 미정'
  const parkingInfo = meeting.parkingInfo || '주차 정보 미정'
  const reservationInfo = meeting.reservationInfo || '예약 정보 미정'

  return (
    <div className="space-y-4">
      {/* 섹션 헤더는 카드 대신 타이포로 분리 */}
      <section className="space-y-1">
        <h2 className="text-base font-semibold text-[var(--text)]">모임 요약</h2>
        <p className="text-xs text-[var(--text-subtle)]">확정된 정보를 한 번 더 확인하세요.</p>
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 space-y-3">
        <InfoRow label="모임 이름" value={meetingName} />
        <InfoRow label="일정" value={dateTime} />
        <InfoRow label="참여 인원" value={memberCount} />
        <InfoRow label="모임 목적" value={category} />
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 space-y-3">
        <InfoRow label="장소명" value={placeName} />
        <InfoRow label="주소" value={address} />
        <InfoRow label="연락처" value={phoneNumber} />
      </section>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 space-y-3">
        <InfoRow label="주차" value={parkingInfo} />
        <InfoRow label="예약" value={reservationInfo} />
      </section>
    </div>
  )
}
