// src/app/meetings/[meetingId]/complete/page.tsx
'use client'

import { use } from 'react'
import CompleteSummaryCard from '@/components/meeting/Step6/CompleteSummaryCard'
import CompleteMapSection from '@/components/meeting/Step6/CompleteMapSection'
import CompleteOptionLinks from '@/components/meeting/Step6/CompleteOptionLinks'
import StepNavigation from '@/components/layout/StepNavigation'

interface PageProps {
  params: Promise<{
    meetingId: string
  }>
}

export default function MeetingCompletePage({ params }: PageProps) {
  // ✅ Next.js 15 방식: params unwrap
  const { meetingId } = use(params)

  // TODO: 추후 API 연동
  const meeting = {
    name: '친구들끼리 친목모임',
    dateTime: '2026.01.23 12:00',
    memberCount: 5,
    category: '카페',
    placeName: '중간지점 카페',
    address: '서울시 어쩌구 저쩌동 12-34',
    parkingInfo: '가능 (유료 10분당 1,200원)',
    reservationInfo: '가능',
    phoneNumber: '070-0000-0000',
    lat: 37.563617,
    lng: 126.997628,
  }

  return (
    <main className="space-y-8">
      {/* 확정 장소 지도 */}
      <CompleteMapSection
        lat={meeting.lat}
        lng={meeting.lng}
      />

      {/* 확정 정보 요약 카드 */}
      <CompleteSummaryCard
        meetingName={meeting.name}
        dateTime={meeting.dateTime}
        memberCount={meeting.memberCount}
        category={meeting.category}
        placeName={meeting.placeName}
        address={meeting.address}
        parkingInfo={meeting.parkingInfo}
        reservationInfo={meeting.reservationInfo}
        phoneNumber={meeting.phoneNumber}
      />

      {/* 옵션 이동 링크 */}
      <CompleteOptionLinks meetingId={meetingId} />

      {/* 스텝 네비 */}
      <StepNavigation
        prevHref="/meetings/new/step5-place"
        prevLabel="중간지점/추천장소"
        nextHref="/my"
        nextLabel="내 모임 리스트"
      />
    </main>
  )
}
