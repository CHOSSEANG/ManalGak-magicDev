// src/components/meeting/Step5PlaceList.tsx
'use client'

import { useMemo, useState } from 'react'
import StepCard from '@/components/meeting/StepCard'
import WireframeModal from '@/components/ui/WireframeModal'
import KakaoMap from '@/components/map/KakaoMap'
import { useRouter } from 'next/navigation'

import {
  Hand,
  CheckCircle,
  Coffee,
  CupSoda,
  IceCream,
  CakeSlice,
  Utensils,
  UtensilsCrossed,
  Soup,
  Pizza,
  Sandwich,
  Fish,
  Beef,
  Theater,
  Film,
  Music,
  BookOpen,
  Palette,
  Gamepad2,
  Landmark,
  Camera,
  MapPin,
  Mountain,
  TreePalm,
  Building2,
  type LucideIcon,
} from 'lucide-react'

/* ================= 타입 ================= */

export type PlaceCategory = 'cafe' | 'restaurant' | 'culture' | 'tour'

interface RecommendedPlace {
  id: string
  name: string
  category: PlaceCategory
  stationName: string
  walkingMinutes: number
  icon: LucideIcon
}

/* ================= 아이콘 풀 ================= */

const ICONS_BY_CATEGORY: Record<PlaceCategory, LucideIcon[]> = {
  cafe: [Coffee, CupSoda, IceCream, CakeSlice],
  restaurant: [
    Utensils,
    UtensilsCrossed,
    Soup,
    Pizza,
    Sandwich,
    Fish,
    Beef,
  ],
  culture: [Theater, Film, Music, BookOpen, Palette, Gamepad2],
  tour: [Landmark, Camera, MapPin, Mountain, TreePalm, Building2],
}

/**
 * ❗ Hydration-safe 아이콘 선택 함수
 * place.id 기반으로 항상 동일한 아이콘을 선택
 */
function pickIconById(
  category: PlaceCategory,
  id: string
): LucideIcon {
  const icons = ICONS_BY_CATEGORY[category]
  const hash = id
    .split('')
    .reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return icons[hash % icons.length]
}

/* ================= 더미 데이터 ================= */

const isLeader = true

const members = [
  { id: 'u1', name: '이름각', handicap: true },
  { id: 'u2', name: '이름각', handicap: false },
  { id: 'u3', name: '이름각', handicap: false },
  { id: 'u4', name: '이름각', handicap: true },
  { id: 'u5', name: '이름각', handicap: false },
]

const rawPlaces = [
  {
    id: 'p1',
    name: '추천 카페',
    category: 'cafe' as const,
    stationName: '을지로입구역',
    walkingMinutes: 5,
  },
  {
    id: 'p2',
    name: '추천 식당 A',
    category: 'restaurant' as const,
    stationName: '종각역',
    walkingMinutes: 7,
  },
  {
    id: 'p3',
    name: '추천 식당 B',
    category: 'restaurant' as const,
    stationName: '종로3가역',
    walkingMinutes: 10,
  },
  {
    id: 'p4',
    name: '추천 전시관',
    category: 'culture' as const,
    stationName: '을지로3가역',
    walkingMinutes: 12,
  },
  {
    id: 'p5',
    name: '추천 명소',
    category: 'tour' as const,
    stationName: '명동역',
    walkingMinutes: 15,
  },
]

const middlePlaceMarkers = [{ lat: 37.563617, lng: 126.997628 }]

/* ================= 컴포넌트 ================= */

export default function Step5PlaceList() {
  const router = useRouter()
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)

  // ✅ 서버/클라이언트 동일 아이콘 보장
  const recommendedPlaces: RecommendedPlace[] = useMemo(
    () =>
      rawPlaces.map((place) => ({
        ...place,
        icon: pickIconById(place.category, place.id),
      })),
    []
  )

  return (
    <div className="space-y-4">
      {/* ================= 지도 ================= */}
      <div className="h-56 overflow-hidden rounded-xl border border-[var(--wf-border)]">
        <KakaoMap markers={middlePlaceMarkers} level={5} />
      </div>

      {/* ================= 멤버 ================= */}
      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex h-16 w-16 flex-col items-center justify-center"
          >
            <div className="relative">
              {m.handicap && (
                <span className="absolute -top-1 -left-2 flex items-center gap-0.5 rounded-xl bg-[var(--wf-highlight)] px-1.5 py-0.5 text-[9px] font-semibold">
                  <Hand className="h-3 w-3" />
                  핸디캡
                </span>
              )}
              <div className="h-12 w-12 rounded-xl bg-[var(--wf-muted)]" />
            </div>
            <span className="mt-1 text-[10px]">{m.name}</span>
          </div>
        ))}
      </div>

      {/* ================= 추천 장소 ================= */}
      <StepCard className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">추천장소 선택</h2>
          {isLeader && (
            <button
              onClick={() => setShowVoteModal(true)}
              className="rounded-lg border px-3 py-1 text-xs bg-[var(--wf-highlight)] hover:bg-[var(--wf-accent)]"
            >
              추천장소 투표하기
            </button>
          )}
        </div>

        <div className="grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {recommendedPlaces.map((place) => {
            const selected = selectedPlace === place.id
            const Icon = place.icon

            return (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place.id)}
                className={[
                  'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition',
                  'border bg-[var(--wf-surface)]',
                  selected
                    ? 'border-[var(--wf-accent)] bg-[var(--wf-highlight-soft)] border-4'
                    : 'border-[var(--wf-border)] border-4 ',
                ].join(' ')}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--wf-muted)]">
                  <Icon className="h-8 w-8 text-[var(--wf-accent)]" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold">{place.name}</p>
                  <p className="text-xs text-[var(--wf-subtle)]">
                    {place.stationName} 기준 도보 {place.walkingMinutes}분
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

      {/* ================= 투표 모달 ================= */}
      <WireframeModal
        open={showVoteModal}
        title="추천장소 투표"
        onClose={() => setShowVoteModal(false)}
      >
        <div className="space-y-3">
          {recommendedPlaces.map((place) => {
            const Icon = place.icon
            const selected = selectedPlace === place.id

            return (
              <button
                key={`vote-${place.id}`}
                onClick={() => {
                  setSelectedPlace(place.id)
                  setShowVoteModal(false)
                }}
                className={[
                  'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition',
                  'border',
                  selected
                    ? 'border-[var(--wf-accent)] bg-[var(--wf-highlight-soft)]'
                    : 'border-[var(--wf-border)] hover:bg-[var(--wf-muted)]',
                ].join(' ')}
              >
                <Icon className="h-5 w-5 text-[var(--wf-accent)]" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{place.name}</p>
                  <p className="text-xs text-[var(--wf-subtle)]">
                    {place.stationName} 도보 {place.walkingMinutes}분
                  </p>
                </div>

                {selected && (
                  <CheckCircle className="h-4 w-4 text-[var(--wf-accent)]" />
                )}
              </button>
            )
          })}
        </div>
      </WireframeModal>

      {/* ================= 확정 ================= */}
      {isLeader && (
        <button
          disabled={!selectedPlace}
          onClick={() => router.push('/meetings/meeting-001/complete')}
          className="w-full rounded-2xl bg-[var(--wf-highlight)] py-4 text-base font-semibold disabled:opacity-40"
        >
          추천 장소 확정
        </button>
      )}
    </div>
  )
}
