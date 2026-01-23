// src/components/meeting/Step3PlaceList.tsx
'use client'
// 진행 필요  1/22 율 메모 
// 장소 확정 API (POST)
//투표 결과 API
//중간지점 + 추천장소 통합 결과 API
import { useEffect, useMemo, useState } from 'react'
import StepCard from '@/components/meeting/StepCard'
import WireframeModal from '@/components/ui/WireframeModal'
import KakaoMap from '@/components/map/KakaoMap'
import { useRouter, useSearchParams } from 'next/navigation'
import ProfileIdentity from '@/components/common/ProfileIdentity'
import axios from 'axios'

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

interface MeUser {
  userId?: number
  name?: string
  nickname?: string
  profileImage?: string
}

interface Participant {
  userId: number
  name: string
  nickname?: string
  profileImage?: string
  handicap: boolean
}

export type PlaceCategory = 'cafe' | 'restaurant' | 'culture' | 'tour'

interface RecommendedPlace {
  id: string
  name: string
  category: PlaceCategory
  stationName: string
  walkingMinutes: number
  icon: LucideIcon
  // 백엔드 추가 필드
  placeId?: string
  categoryGroupCode?: string
  categoryGroupName?: string
  address?: string
  roadAddress?: string
  latitude?: number
  longitude?: number
  distance?: number
  phone?: string
  placeUrl?: string
}

interface MiddlePoint {
  lat: number
  lng: number
  stationName?: string
}

/* ================= API BASE ================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

/* ================= 유틸 ================= */

function displayName(name?: string) {
  if (!name) return ''
  return name.length > 6 ? `${name.slice(0, 6)}…` : name
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function toNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

function isPlaceCategory(value: unknown): value is PlaceCategory {
  return value === 'cafe' || value === 'restaurant' || value === 'culture' || value === 'tour'
}

function parseApiPlace(place: unknown): Omit<RecommendedPlace, 'icon'> | null {
  if (!isRecord(place)) return null

  const placeId = toNonEmptyString(place.placeId)
  const placeName = toNonEmptyString(place.placeName)

  if (!placeId || !placeName) return null

  return {
    id: placeId,
    name: placeName,
    category: isPlaceCategory(place.category) ? place.category : 'restaurant',
    stationName: toString(place.stationName) || '중간지점',
    walkingMinutes: toNumber(place.walkingMinutes) ?? 0,
    placeId,
    categoryGroupCode: toString(place.categoryGroupCode),
    categoryGroupName: toString(place.categoryGroupName),
    address: toString(place.address),
    roadAddress: toString(place.roadAddress),
    latitude: toNumber(place.latitude),
    longitude: toNumber(place.longitude),
    distance: toNumber(place.distance),
    phone: toString(place.phone),
    placeUrl: toString(place.placeUrl),
  }
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

function pickIconById(category: PlaceCategory, id: string): LucideIcon {
  const icons = ICONS_BY_CATEGORY[category]
  const hash = id.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return icons[hash % icons.length]
}

/* ================= FE 더미 추천장소 (fallback) ================= */
/**
 * 🟡 추천장소 API 실패/미연결 시 사용
 * - 항상 5개 유지
 * - 아이콘 랜덤 로직 유지
 */
const rawPlaces: Omit<RecommendedPlace, 'icon'>[] = [
  { id: 'p1', name: '추천 카페', category: 'cafe', stationName: '을지로입구역', walkingMinutes: 5 },
  { id: 'p2', name: '추천 식당 A', category: 'restaurant', stationName: '종각역', walkingMinutes: 7 },
  { id: 'p3', name: '추천 식당 B', category: 'restaurant', stationName: '종로3가역', walkingMinutes: 10 },
  { id: 'p4', name: '추천 전시관', category: 'culture', stationName: '을지로3가역', walkingMinutes: 12 },
  { id: 'p5', name: '추천 명소', category: 'tour', stationName: '명동역', walkingMinutes: 15 },
  { id: 'p6', name: '추천 카페 B', category: 'cafe', stationName: '시청역', walkingMinutes: 8 },
]

/* ================= 컴포넌트 ================= */

export default function Step5PlaceList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const meetingUuid = searchParams.get('meetingUuid')

  const [me, setMe] = useState<MeUser | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)

  const [middlePoint, setMiddlePoint] = useState<MiddlePoint | null>(null)
  const [placeSource, setPlaceSource] =
    useState<Omit<RecommendedPlace, 'icon'>[]>(rawPlaces)
  const [isConfirming, setIsConfirming] = useState(false)

  /* ================= 내 정보 ================= */

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem('user')
      setMe(stored ? JSON.parse(stored) : null)
    } catch {
      setMe(null)
    }
  }, [])

  /* ================= 참여자 API ================= */

  useEffect(() => {
    if (!meetingUuid) return

    axios
      .get(`${API_BASE_URL}/v1/meetings/${meetingUuid}/participants`, {
        withCredentials: true,
      })
      .then((res) => {
        const list: Participant[] = res.data?.data ?? []
        const filtered =
          me?.userId != null ? list.filter((p) => p.userId !== me.userId) : list
        setParticipants(filtered)
      })
      .catch(() => setParticipants([]))
  }, [meetingUuid, me?.userId])

  /* ================= 추천장소 + 중간지점 통합 API ================= */
  /**
   * /places API 응답에서 추천장소 + 중간지점 모두 추출
   * - 실패 시 FE 더미 유지 + 기존 middle-point API 폴백
   */
  useEffect(() => {
    if (!meetingUuid) return

    const fetchPlacesAndMidpoint = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/v1/meetings/${meetingUuid}/places`,
          { withCredentials: true }
        )

        const data = res.data?.data
        const apiPlaces = data?.places ?? []
        const apiMidpoint = data?.midpoint

        // 중간지점 설정
        if (apiMidpoint?.latitude && apiMidpoint?.longitude) {
          setMiddlePoint({
            lat: apiMidpoint.latitude,
            lng: apiMidpoint.longitude,
            stationName: apiMidpoint.stationName,
          })
        }

        // 추천장소 설정 (6개 이상일 때만 교체)
        if (apiPlaces.length >= 6) {
          const parsedPlaces = apiPlaces
            .map(parseApiPlace)
            .filter((place): place is Omit<RecommendedPlace, 'icon'> => place !== null)

          if (parsedPlaces.length >= 6) {
            setPlaceSource(parsedPlaces.slice(0, 6))
          }
        }
      } catch {
        // places API 실패 시 기존 middle-point API 폴백
        try {
          const res = await axios.get(
            `${API_BASE_URL}/v1/meetings/${meetingUuid}/middle-point`,
            { withCredentials: true }
          )
          if (res.data?.lat && res.data?.lng) {
            setMiddlePoint(res.data)
          }
        } catch {}
      }
    }

    fetchPlacesAndMidpoint()
  }, [meetingUuid])

  /* ================= 추천 장소 (아이콘 주입) ================= */

  const recommendedPlaces: RecommendedPlace[] = useMemo(
    () =>
      placeSource.map((place) => ({
        ...place,
        icon: pickIconById(place.category, place.id),
      })),
    [placeSource]
  )

  const mapMarkers = middlePoint
    ? [{ lat: middlePoint.lat, lng: middlePoint.lng }]
    : [{ lat: 37.563617, lng: 126.997628 }]

  /* ================= 장소 확정 핸들러 ================= */
  const handleConfirmPlace = async () => {
    if (!selectedPlace || !meetingUuid) return

    const selected = recommendedPlaces.find((p) => p.id === selectedPlace)
    if (!selected) return

    setIsConfirming(true)
    try {
      await axios.post(
        `${API_BASE_URL}/v1/meetings/${meetingUuid}/place/select`,
        {
          placeId: selected.placeId || selected.id,
          placeName: selected.name,
          category: selected.category,
          categoryGroupCode: selected.categoryGroupCode,
          categoryGroupName: selected.categoryGroupName,
          address: selected.address,
          roadAddress: selected.roadAddress,
          latitude: selected.latitude,
          longitude: selected.longitude,
          distance: selected.distance,
          walkingMinutes: selected.walkingMinutes,
          phone: selected.phone,
          placeUrl: selected.placeUrl,
        },
        { withCredentials: true }
      )
      router.push(`/meetings/${meetingUuid}/complete`)
    } catch (err) {
      console.error('장소 확정 실패:', err)
      alert('장소 확정에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* ================= 지도 ================= */}
      <div className="h-56 overflow-hidden rounded-xl border border-[var(--wf-border)]">
        <KakaoMap markers={mapMarkers} level={5} />
      </div>

      {/* ================= 멤버 ================= */}
      <div className="flex flex-wrap gap-2">
        {me && (
          <div className="flex h-16 w-16 flex-col items-center justify-center">
            <ProfileIdentity src={me.profileImage} size={48} shape="square" />
            <span className="mt-1 text-[10px]">
              {displayName(me.nickname ?? me.name) || '내 프로필'}
            </span>
          </div>
        )}

        {participants.map((p) => (
          <div
            key={p.userId}
            className="flex h-16 w-16 flex-col items-center justify-center"
          >
            <div className="relative">
              {p.handicap && (
                <span className="absolute -top-1 -left-2 flex items-center gap-0.5 rounded-xl bg-[var(--wf-highlight)] px-1.5 py-0.5 text-[9px] font-semibold">
                  <Hand className="h-3 w-3" />
                  핸디캡
                </span>
              )}
              <ProfileIdentity src={p.profileImage} size={48} shape="square" />
            </div>
            <span className="mt-1 text-[10px]">
              {displayName(p.nickname ?? p.name)}
            </span>
          </div>
        ))}
      </div>

      {/* ================= 추천 장소 ================= */}
      <StepCard className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">추천장소 선택</h2>
          <button
            type="button"
            onClick={() => setShowVoteModal(true)}
            className="rounded-lg border px-3 py-1 text-xs bg-[var(--wf-highlight)]"
          >
            추천장소 투표하기
          </button>
        </div>

        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          {recommendedPlaces.map((place) => {
            const Icon = place.icon
            const selected = selectedPlace === place.id

            return (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 border-4 ${
                  selected
                    ? 'border-[var(--wf-accent)] bg-[var(--wf-highlight-soft)]'
                    : 'border-[var(--wf-border)] bg-[var(--wf-surface)]'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--wf-muted)]">
                  <Icon className="h-8 w-8 text-[var(--wf-accent)]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{place.name}</p>
                  <p className="text-xs text-[var(--wf-subtle)]">
                    {place.stationName} 도보 {place.walkingMinutes}분
                  </p>
                </div>
                {selected && <CheckCircle className="h-5 w-5 text-[var(--wf-accent)]" />}
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
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 border-4 ${
                  selected
                    ? 'border-[var(--wf-accent)] bg-[var(--wf-highlight-soft)]'
                    : 'border-[var(--wf-border)] bg-[var(--wf-surface)]'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--wf-muted)]">
                  <Icon className="h-8 w-8 text-[var(--wf-accent)]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{place.name}</p>
                  <p className="text-xs text-[var(--wf-subtle)]">
                    {place.stationName} 도보 {place.walkingMinutes}분
                  </p>
                </div>
                {selected && (
                  <CheckCircle className="h-5 w-5 text-[var(--wf-accent)]" />
                )}
              </button>
            )
          })}
        </div>
      </WireframeModal>

      {/* ================= 확정 ================= */}
      <button
        disabled={!selectedPlace || isConfirming}
        onClick={handleConfirmPlace}
        className="w-full rounded-2xl bg-[var(--wf-highlight)] py-4 text-base font-semibold disabled:opacity-40"
      >
        {isConfirming ? '확정 중...' : '추천 장소 확정'}
      </button>
    </div>
  )
}
