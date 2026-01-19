// src/components/meeting/CompleteSummaryCard.tsx
'use client'

import StepCard from '@/components/meeting/StepCard'
import {
  Users,
  Calendar,
  Coffee,
  MapPinned,
  Phone,
  Send,
} from 'lucide-react'

declare global {
  interface Window {
    Kakao: any
  }
}

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
    phoneNumber,
  } = meeting

  // ✅ 임시 좌표 (백엔드 연결 전)
  const lat = 37.566535
  const lng = 126.977969

  const handleSendKakao = () => {
    if (typeof window === 'undefined' || !window.Kakao) return

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY)
    }

    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text:
        `📌 확정된 모임 정보\n\n` +
        `모임명: ${meetingName}\n` +
        `일시: ${dateTime}\n` +
        `인원: ${memberCount}명\n` +
        `카테고리: ${category}\n` +
        `장소: ${placeName}\n` +
        `주소: ${address}\n` +
        `전화번호: ${phoneNumber}`,
      link: {
        mobileWebUrl: window.location.origin,
        webUrl: window.location.origin,
      },
    })
  }

  const handleDirection = () => {
    const url = `https://map.kakao.com/link/to/${encodeURIComponent(
      placeName
    )},${lat},${lng}`
    window.open(url, '_blank')
  }

  return (
    <section className="space-y-4">
      <StepCard className="space-y-5 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] p-6 shadow-sm">
        <div className="space-y-4">
          {/* 모임명 */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--wf-highlight-soft)]">
              <Users className="h-6 w-6" stroke="var(--wf-highlight-strong)" />
            </div>
            <div>
              <p className="text-xs font-light text-[var(--wf-accent)]">
                모임명 · 참여인원
              </p>
              <p className="text-lg font-bold">
                {meetingName} · {memberCount}명
              </p>
            </div>
          </div>

          {/* 일시 */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--wf-highlight-soft)]">
              <Calendar className="h-6 w-6" stroke="var(--wf-highlight-strong)" />
            </div>
            <div>
              <p className="text-xs font-light text-[var(--wf-accent)]">
                모임 일시
              </p>
              <p className="text-lg font-bold">{dateTime}</p>
            </div>
          </div>

          {/* 장소 */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--wf-highlight-soft)]">
              <Coffee className="h-6 w-6" stroke="var(--wf-highlight-strong)" />
            </div>
            <div>
              <p className="text-xs font-light text-[var(--wf-accent)]">
                장소명 (카테고리)
              </p>
              <p className="text-lg font-bold">
                {placeName} ({category})
              </p>
            </div>
          </div>

          {/* 주소 + 길찾기 */}
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--wf-highlight-soft)]">
              <MapPinned className="h-6 w-6" stroke="var(--wf-highlight-strong)" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-light text-[var(--wf-accent)]">
                상세 주소
              </p>
              <p className="text-base font-medium">{address}</p>
            </div>
            <button
              type="button"
              onClick={handleDirection}
              className="mt-1 flex h-6 items-center justify-center rounded-md border px-2 text-xs text-[var(--wf-subtle)] bg-[var(--wf-highlight-soft)]"
            >
              길찾기
            </button>
          </div>

          {/* 전화 */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--wf-highlight-soft)]">
              <Phone className="h-6 w-6" stroke="var(--wf-highlight-strong)" />
            </div>
            <div>
              <p className="text-xs font-light text-[var(--wf-accent)]">
                문의 전화번호
              </p>
              <p className="text-base font-medium">{phoneNumber}</p>
            </div>
          </div>
        </div>
      </StepCard>

      {/* CTA */}
      <button
        onClick={handleSendKakao}
        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--wf-highlight)]  hover:bg-[var(--wf-accent)]
        py-4 text-lg font-bold text-[var(--wf-text)] shadow-xl shadow-yellow-500/20 transition active:scale-[0.99]"
      >
        확정 장소 메시지 전송
        <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </button>
    </section>
  )
}
