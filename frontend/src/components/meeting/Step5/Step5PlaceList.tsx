// src/components/meeting/Step5PlaceList.tsx
'use client'

import { useState } from 'react'
import StepCard from '@/components/meeting/StepCard'
import { Hand, CheckCircle } from 'lucide-react'
import KakaoMap from '@/components/map/KakaoMap'
import { useRouter } from 'next/navigation'

const isLeader = true // 모임장 여부

const members = [
  { id: 'u1', name: '이름각', handicap: true },
  { id: 'u2', name: '이름각', handicap: false },
  { id: 'u3', name: '이름각', handicap: false },
  { id: 'u4', name: '이름각', handicap: true },
  { id: 'u5', name: '이름각', handicap: false },
]

const recommendedPlaces = [
  { id: 'p1', name: '중간지점 카페', detail: '도보 5분 / 1,200원' },
  { id: 'p2', name: '추천 식당 A', detail: '도보 7분 / 2,400원' },
  { id: 'p3', name: '추천 식당 B', detail: '도보 10분 / 3,000원' },
  { id: 'p4', name: '추천 식당 C', detail: '도보 12분 / 3,500원' },
  { id: 'p5', name: '추천 식당 D', detail: '도보 15분 / 4,000원' },
]

// 중간지점 자동 계산 결과 (임시)
const middlePlaceMarkers = [{ lat: 37.563617, lng: 126.997628 }]

export default function Step5PlaceList() {
  const router = useRouter()
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {/* ================= 지도 + 멤버 ================= */}
      <div className="h-56 rounded-xl border border-[var(--wf-border)] overflow-hidden">
          <KakaoMap markers={middlePlaceMarkers} level={5} />
        </div>
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex h-16 w-16 flex-col items-center justify-center"
            >
              <div className="relative">
                {m.handicap && (
                  <span className="absolute -top-1 -left-2 flex items-center gap-0.5 rounded-xl bg-[var(--wf-highlight)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--wf-text)]">
                    <Hand className="h-3 w-3" />
                    핸디캡
                  </span>
                )}

                {/* 프로필 이미지 (박스는 유지, 테두리/배경 없음) */}
                <div className="h-12 w-12 rounded-xl bg-[var(--wf-muted)]" />
              </div>

              <span className="mt-1 text-[10px] text-[var(--wf-text)]">
                {m.name}
              </span>
            </div>
          ))}
        </div>

      {/* ================= 추천 장소 선택 ================= */}
      <StepCard className="space-y-3">
        <h2 className="text-base font-semibold">추천 장소 선택하기</h2>
        <p className="text-xs text-[var(--wf-subtle)]">
          자동으로 계산된 중간지점을 기준으로 추천된 장소입니다.
          {isLeader
            ? ' 모임장이 한 곳을 선택해 주세요.'
            : ' 모임장이 장소를 선택 중입니다.'}
        </p>

        <div className="space-y-2">
          {recommendedPlaces.map((place) => {
            const selected = selectedPlace === place.id

            return (
              <button
                key={place.id}
                disabled={!isLeader}
                onClick={() => setSelectedPlace(place.id)}
                className={[
                  'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition',
                  'border bg-[var(--wf-surface)]',
                  selected
                    ? 'border-[var(--wf-accent)] bg-[var(--wf-highlight-soft)]'
                    : 'border-[var(--wf-border)]',
                  isLeader ? 'hover:bg-[var(--wf-muted)]' : 'opacity-70',
                ].join(' ')}
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--wf-text)]">
                    {place.name}
                  </p>
                  <p className="text-xs text-[var(--wf-subtle)]">
                    {place.detail}
                  </p>
                </div>

                {selected && (
                  <CheckCircle className="h-5 w-5 text-[var(--wf-accent)]" />
                )}
              </button>
            )
          })}
        </div>
      </StepCard>

      {/* ================= 확정 버튼 ================= */}
      {isLeader && (
        <button
          disabled={!selectedPlace}
          onClick={() => router.push('/meetings/meeting-001/complete')}
          className="w-full rounded-2xl bg-[var(--wf-highlight)] py-4 text-base font-semibold text-[var(--wf-text)] disabled:opacity-40"
        >
          추천 장소 확정
        </button>
      )}
    </div>
  )
}
