// src/components/meeting/Step5PlaceList.tsx
'use client'

import { useState } from 'react'
import StepCard from '@/components/meeting/StepCard'
import { Hand, Expand, ZoomIn, ChevronDown } from 'lucide-react'
import WireframeModal from '@/components/ui/WireframeModal'
import MapRangeModal from '@/components/meeting/MapRangeModal'
import MoreRecommendModal from '@/components/meeting/MoreRecommendModal'
import KakaoMap from '@/components/map/KakaoMap' 

const initialMembers = [
  { id: 'u1', name: '이름각', status: 'confirmed', handicap: true },
  { id: 'u2', name: '이름각', status: 'pending', handicap: false },
  { id: 'u3', name: '이름각', status: 'confirmed', handicap: false },
  { id: 'u4', name: '이름각', status: 'invited', handicap: true },
  { id: 'u5', name: '이름각', status: 'pending', handicap: false },
]

const middlePlaces = [
  { id: 'p1', name: '중간지점 1', detail: '서울시 중구 어쩌구 저쩌동 12-34' },
  { id: 'p2', name: '중간지점 2', detail: '서울시 중구 어쩌구 저쩌동 12-34' },
  { id: 'p3', name: '중간지점 3', detail: '서울시 중구 어쩌구 저쩌동 12-34' },
  { id: 'p4', name: '중간지점 4', detail: '서울시 중구 어쩌구 저쩌동 12-34' },
]

const recommendedPlaces = [
  { id: 'p1', name: '중간지점 카페', detail: '도보 5분 / 1,200원' },
  { id: 'p2', name: '추천 식당 A', detail: '도보 7분 / 2,400원' },
  { id: 'p3', name: '추천 식당 B', detail: '도보 10분 / 3,000원' },
  { id: 'p4', name: '추천 식당 C', detail: '도보 12분 / 3,500원' },
]

// ✅ Step5용 임시 중간지점 좌표 (백엔드 연결 전)
const middlePlaceMarkers = [
  { lat: 37.563617, lng: 126.997628 },
  { lat: 37.565, lng: 126.99 },
  { lat: 37.56, lng: 127.0 },
]

export default function Step5PlaceList() {
  const [selectedMiddle, setSelectedMiddle] = useState<string | null>(null)
  const [selectedRecommended, setSelectedRecommended] = useState<string | null>(null)
  const [showRecommended, setShowRecommended] = useState(false)

  const [showMapRangeModal, setShowMapRangeModal] = useState(false)
  const [mapLevel, setMapLevel] = useState(5)

  const [showMoreRecommendModal, setShowMoreRecommendModal] = useState(false)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StepCard className="space-y-3">
        <p className="text-sm font-semibold">지도 영역 (API 필요)</p>

        {/* 지도 영역만 */}
        <div className="h-48 rounded-xl border border-[var(--wf-border)] overflow-hidden lg:h-full">
          <KakaoMap
            markers={middlePlaceMarkers}
            level={mapLevel}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {initialMembers.map((member) => (
            <div
              key={member.id}
              className={`flex h-16 w-16 flex-col items-center justify-center rounded-xl border-[var(--wf-border)] ${
                member.status === 'confirmed'
                  ? 'bg-[var(--wf-accent)]'
                  : 'bg-[var(--wf-surface)]'
              }`}
            >
              <div className="relative">
                {member.handicap && (
                  <span className="absolute -top-1 -left-2 z-10 flex items-center gap-0.5 rounded-xl bg-yellow-300 px-1.5 py-0.5 text-[9px] font-semibold text-black">
                    <Hand className="h-3 w-3 animate-wave" />핸디캡
                  </span>
                )}
                <div className="h-12 w-12 rounded-xl bg-[var(--wf-muted)]" />
              </div>
              <span className="text-[10px]">{member.name}</span>
            </div>
          ))}
        </div>
      </StepCard>

      <StepCard className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">중간 지점 리스트</h2>
          <button
            onClick={() => setShowMapRangeModal(true)}
            className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
          >
            <Expand className="h-4 w-4" />범위 확장
          </button>
        </div>

        <div className="space-y-1">
          {middlePlaces.map((place) => {
            const isSelected = selectedMiddle === place.id
            return (
              <div
                key={place.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-2 ${
                  isSelected ? 'bg-[var(--wf-accent)]' : 'bg-[var(--wf-muted)]'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{place.name}</p>
                  <p className="text-xs text-[var(--wf-subtle)]">{place.detail}</p>
                </div>
                <button
                  onClick={() => setSelectedMiddle(place.id)}
                  className="rounded-lg border bg-[var(--wf-surface)] px-3 py-1 text-xs"
                >
                  {isSelected ? '선택됨' : '선택'}
                </button>
              </div>
            )
          })}
        </div>
      </StepCard>

      <button
        onClick={() => setShowRecommended(!showRecommended)}
        className="lg:col-span-2 flex w-full items-center justify-center gap-2 rounded-xl border bg-[var(--wf-surface)] py-3 text-sm font-semibold"
      >
        <ChevronDown className="h-6 w-6" />
        {showRecommended ? '추천 장소 숨기기' : '추천 장소 보기'}
      </button>

      {showRecommended && (
        <StepCard className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">추천 장소 리스트</h2>
            <button
              onClick={() => setShowMoreRecommendModal(true)}
              className="flex items-center gap-1 text-xs text-[var(--wf-subtle)]"
            >
              <ZoomIn className="h-4 w-4" />추천 확장
            </button>
          </div>

          <div className="space-y-1">
            {recommendedPlaces.map((place) => {
              const isSelected = selectedRecommended === place.id

              return (
                <div
                  key={place.id}
                  className={`flex items-center justify-between rounded-xl border px-4 py-2 ${
                    isSelected ? 'bg-[var(--wf-accent)]' : 'bg-[var(--wf-muted)]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{place.name}</p>
                    <p className="text-xs text-[var(--wf-subtle)]">{place.detail}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRecommended(place.id)}
                    className="rounded-lg border bg-[var(--wf-surface)] px-3 py-1 text-xs"
                  >
                    {isSelected ? '확정됨' : '선택'}
                  </button>
                </div>
              )
            })}
          </div>
        </StepCard>
      )}

      <WireframeModal
        open={showMapRangeModal}
        title="지도 범위 선택"
        onClose={() => setShowMapRangeModal(false)}
      >
        <MapRangeModal
          currentLevel={mapLevel}
          onSelect={(level) => {
            setMapLevel(level)
            setShowMapRangeModal(false)
          }}
        />
      </WireframeModal>

      <WireframeModal
        open={showMoreRecommendModal}
        title="추천 조건 변경"
        onClose={() => setShowMoreRecommendModal(false)}
      >
        <MoreRecommendModal onSelect={() => setShowMoreRecommendModal(false)} />
      </WireframeModal>
    </div>
  )
}
