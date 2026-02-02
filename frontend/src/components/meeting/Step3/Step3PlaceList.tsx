// src/components/meeting/Step3PlaceList.tsx
'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import WireframeModal from '@/components/ui/WireframeModal'
import Step4Map from '@/components/map/Step4Map'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { useUser } from '@/context/UserContext'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import {
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
  AlertTriangle,
  Clock,
  Car,
  Train,
  type LucideIcon,
} from 'lucide-react'
import { calculateRoutes } from '@/lib/api/route'
import type { RouteResponse, RouteInfo, CarRouteInfo } from '@/types/route'
import type { CommonResponse } from '@/types/api'

// shadcn/ui

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

/* ================= 타입 ================= */

interface Participant {
  participantId: number
  userId: number
  nickName?: string
  profileImageUrl?: string
  handicap: boolean
  type?: 'PUBLIC' | 'CAR' | 'WALK'
}

export type PlaceCategory = 'cafe' | 'restaurant' | 'culture' | 'tour'

interface RecommendedPlace {
  id: string
  name: string
  category: PlaceCategory
  stationName: string
  walkingMinutes: number
  icon: LucideIcon
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

interface VoteOption {
  optionId: number
  content: string
  voteCount: number
  voters: Array<{
    participantId: number
    nickname: string
  }>
}

interface VoteData {
  voteId: number
  options: VoteOption[]
}

interface Step3PlaceListProps {
  onStatusLoaded?: (status: string) => void
}

/* ================= API BASE ================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

/* ================= 유틸 ================= */

function sortParticipants(list: Participant[], myUserId?: number): Participant[] {
  if (!myUserId) {
    return [...list].sort((a, b) => a.participantId - b.participantId)
  }
  const me = list.find((p) => p.userId === myUserId)
  const others = list
    .filter((p) => p.userId !== myUserId)
    .sort((a, b) => a.participantId - b.participantId)

  return me ? [me, ...others] : others
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
  return (
    value === 'cafe' ||
    value === 'restaurant' ||
    value === 'culture' ||
    value === 'tour'
  )
}

function parseApiPlace(place: unknown): Omit<RecommendedPlace, 'icon'> | null {
  if (!isRecord(place)) return null

  const placeId = toNonEmptyString(place.placeId)
  const placeName = toNonEmptyString(place.placeName)

  if (!placeId || !placeName) return null

  return {
    id: placeId,
    name: placeName,
    category: isPlaceCategory(place.category)
      ? place.category
      : 'restaurant',
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
  restaurant: [Utensils, UtensilsCrossed, Soup, Pizza, Sandwich, Fish, Beef],
  culture: [Theater, Film, Music, BookOpen, Palette, Gamepad2],
  tour: [Landmark, Camera, MapPin, Mountain, TreePalm, Building2],
}

function pickIconById(category: PlaceCategory, id: string): LucideIcon {
  const icons = ICONS_BY_CATEGORY[category]
  const hash = id.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return icons[hash % icons.length]
}

function logClientError(message: string, error: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.error(message, error)
  }
}

/* ================= 컴포넌트 ================= */

export default function Step5PlaceList({ onStatusLoaded }: Step3PlaceListProps) {
  const [isNewPlaceAvailable, setIsNewPlaceAvailable] = useState(false)
  const [mapRefreshKey, setMapRefreshKey] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const meetingUuid = searchParams.get('meetingUuid')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)

  const [, setMiddlePoint] = useState<MiddlePoint | null>(null)
  const [placeSource, setPlaceSource] = useState<
    Omit<RecommendedPlace, 'icon'>[]
  >([])
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [voteData, setVoteData] = useState<VoteData | null>(null)
  const [isCreatingVote, setIsCreatingVote] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [organizerId, setOrganizerId] = useState<number | null>(null)
  const [meetingPurpose, setMeetingPurpose] = useState<string | null>(null)
  const { user } = useUser()
  const stompClientRef = useRef<Client | null>(null)

  const myParticipant = participants.find((p) => p.userId === user?.id)
  const myNickname = myParticipant?.nickName ?? '나'

  const isHost =
    organizerId != null && user?.id != null && organizerId === user.id
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)

  // 이동시간 관련 상태
  const [routeCache, setRouteCache] = useState<Record<string, RouteResponse>>({})
  const [loadingRoutes, setLoadingRoutes] = useState<Record<string, boolean>>({})
  const routeCacheRef = useRef(routeCache)
  const loadingRoutesRef = useRef(loadingRoutes)
  const [showTravelTimeModal, setShowTravelTimeModal] = useState(false)
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState<string | null>(null)

  useEffect(() => {
    routeCacheRef.current = routeCache
  }, [routeCache])

  useEffect(() => {
    loadingRoutesRef.current = loadingRoutes
  }, [loadingRoutes])

  /* ================= 추천장소 + 중간지점 ================= */

  const fetchPlacesAndMidpoint = useCallback(async () => {
    if (!meetingUuid || !meetingPurpose) return
    setIsLoadingPlaces(true)
    try {
      const res = await axios.get(
        `${API_BASE_URL}/v1/meetings/${meetingUuid}/places?purpose=${meetingPurpose}&limit=6`,
        { withCredentials: true }
      )
      const data = res.data?.data
      const apiPlaces: unknown[] = Array.isArray(data?.places) ? data.places : []
      const apiMidpoint = data?.midpoint

      if (apiMidpoint?.latitude && apiMidpoint?.longitude) {
        setMiddlePoint({
          lat: apiMidpoint.latitude,
          lng: apiMidpoint.longitude,
          stationName: apiMidpoint.stationName,
        })
      }

      const parsedPlaces = apiPlaces
        .map(parseApiPlace)
        .filter(
          (place): place is Omit<RecommendedPlace, 'icon'> => place !== null
        )
      setPlaceSource(parsedPlaces.slice(0, 6))
      setHasInitiallyLoaded(true)
    } catch (error) {
      logClientError('추천 장소 조회 실패', error)
      setPlaceSource([])
      setHasInitiallyLoaded(true)
      try {
        const res = await axios.get(
          `${API_BASE_URL}/v1/meetings/${meetingUuid}/middle-point`,
          { withCredentials: true }
        )
        if (res.data?.lat && res.data?.lng) {
          setMiddlePoint(res.data)
        }
      } catch (innerError) {
        logClientError('중간지점 조회 실패', innerError)
      }
    } finally {
      setIsLoadingPlaces(false)
    }
  }, [meetingUuid, meetingPurpose])

  const fetchPlacesAndMidpointRef = useRef(fetchPlacesAndMidpoint)
  useEffect(() => {
    fetchPlacesAndMidpointRef.current = fetchPlacesAndMidpoint
  }, [fetchPlacesAndMidpoint])

  useEffect(() => {
    fetchPlacesAndMidpoint()
  }, [fetchPlacesAndMidpoint])

  /* ================= 이동시간 조회 ================= */

  const fetchTravelTimes = useCallback(
    async (placeId: string, latitude: number, longitude: number) => {
      if (
        !meetingUuid ||
        routeCacheRef.current[placeId] ||
        loadingRoutesRef.current[placeId]
      ) {
        return
      }

      setLoadingRoutes((prev) => ({ ...prev, [placeId]: true }))
      try {
        const response = (await calculateRoutes(meetingUuid, {
          latitude,
          longitude,
        })) as CommonResponse<RouteResponse>

        if (response?.data) {
          const data = response.data
          setRouteCache((prev) => ({ ...prev, [placeId]: data }))
        }
      } catch (error) {
        logClientError('이동시간 조회 실패', error)
      } finally {
        setLoadingRoutes((prev) => ({ ...prev, [placeId]: false }))
      }
    },
    [meetingUuid]
  )

  const handlePlaceClick = useCallback(
    (place: RecommendedPlace) => {
      setSelectedPlace(place.id)

      // 좌표가 있으면 이동시간 조회
      if (place.latitude && place.longitude) {
        fetchTravelTimes(place.id, place.latitude, place.longitude)
      }

      // 모달창 즉시 열기
      setSelectedPlaceForDetail(place.id)
      setShowTravelTimeModal(true)
    },
    [fetchTravelTimes]
  )

  /* ================= WebSocket ================= */

  const voteDataRef = useRef(voteData)
  useEffect(() => {
    voteDataRef.current = voteData
  }, [voteData])

  useEffect(() => {
    if (!meetingUuid) return
    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      onConnect: () => {
        if (voteData?.voteId) {
          client.subscribe(`/topic/votes/${voteData.voteId}`, (message) => {
            try {
              const result = JSON.parse(message.body)
              if (result.voteId) {
                setVoteData(result)
                setIsNewPlaceAvailable(false)
              }
            } catch (error) {
              logClientError('투표 메시지 처리 실패', error)
            }
          })
        }

        client.subscribe(`/topic/votes/meeting/${meetingUuid}`, (message) => {
          try {
            const result = JSON.parse(message.body)
            if (result.type === 'VOTE_DELETED') {
              setVoteData(null)
              return
            }
            if (result.voteId && result.options) {
              setVoteData(result)
              setIsNewPlaceAvailable(false)
            }
          } catch (error) {
            logClientError('투표 갱신 처리 실패', error)
          }
        })

        client.subscribe(`/topic/meeting/${meetingUuid}/places`, () => {
          fetchPlacesAndMidpointRef.current()
          setMapRefreshKey((p) => p + 1)
          // 추천 장소 변경 시 이동시간 캐시 초기화
          setRouteCache({})
          if (voteDataRef.current) {
            setIsNewPlaceAvailable(true)
          }
        })
      },
    })
    client.activate()
    stompClientRef.current = client
    return () => {
      client.deactivate()
      stompClientRef.current = null
    }
  }, [voteData?.voteId, meetingUuid])

  /* ================= 참여자 ================= */

  useEffect(() => {
    if (!meetingUuid || !user?.id) return

    axios
      .get(`${API_BASE_URL}/v1/meetings/${meetingUuid}`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data?.data
        const rawParticipants: Participant[] = data?.participants ?? []
        const sorted = sortParticipants(rawParticipants, user?.id)
        setParticipants(sorted)
        const organizerIdValue = Number(data?.organizerId ?? 0)
        setOrganizerId(organizerIdValue || null)
        setMeetingPurpose(data?.purpose || 'DINING')
        if (onStatusLoaded && data?.status) {
          onStatusLoaded(data.status)
        }
      })
      .catch((error) => {
        logClientError('참여자 조회 실패', error)
        setParticipants([])
      })
  }, [meetingUuid, user?.id, onStatusLoaded])

  /* ================= 추천 장소 ================= */

  const recommendedPlaces: RecommendedPlace[] = useMemo(
    () =>
      placeSource.map((place) => ({
        ...place,
        icon: pickIconById(place.category, place.id),
      })),
    [placeSource]
  )

  const placeSignature = useMemo(
    () => recommendedPlaces.map((p) => p.name).sort().join('|'),
    [recommendedPlaces]
  )

  const selectedPlaceDetail = useMemo(
    () =>
      selectedPlaceForDetail
        ? recommendedPlaces.find((p) => p.id === selectedPlaceForDetail) ?? null
        : null,
    [recommendedPlaces, selectedPlaceForDetail]
  )

  useEffect(() => {
    if (!placeSignature || !meetingUuid || isLoadingPlaces || !hasInitiallyLoaded)
      return
    const storageKey = `place-signature-${meetingUuid}`
    const prevSignature = localStorage.getItem(storageKey)
    if (prevSignature && prevSignature !== placeSignature) {
      setIsNewPlaceAvailable(true)
    }
    localStorage.setItem(storageKey, placeSignature)
  }, [placeSignature, meetingUuid, isLoadingPlaces, hasInitiallyLoaded])

  /* ================= 투표 ================= */

  const fetchVote = useCallback(async (): Promise<VoteData | null> => {
    if (!meetingUuid) return null
    try {
      const res = await axios.get(
        `${API_BASE_URL}/v1/votes/meeting/${meetingUuid}`,
        { withCredentials: true, validateStatus: (s) => s < 500 }
      )
      if (res.status === 404) return null
      return res.data?.data ?? null
    } catch (error) {
      logClientError('투표 조회 실패', error)
      return null
    }
  }, [meetingUuid])

  useEffect(() => {
    if (!meetingUuid) return
    let cancelled = false
    const initFetchVote = async () => {
      const fetchedVote = await fetchVote()
      if (!cancelled && fetchedVote) setVoteData(fetchedVote)
    }
    initFetchVote()
    return () => {
      cancelled = true
    }
  }, [meetingUuid, fetchVote])

  const createVote = async () => {
    if (!meetingUuid || !isHost) {
      alert('모임장만 투표를 생성할 수 있습니다.')
      return
    }
    setIsCreatingVote(true)
    try {
      const options = recommendedPlaces.map((p) => p.name)
      await axios.post(
        `${API_BASE_URL}/v1/votes/meeting/${meetingUuid}`,
        { options },
        { withCredentials: true }
      )
      const storageKey = `place-signature-${meetingUuid}`
      localStorage.setItem(storageKey, placeSignature)
      setIsNewPlaceAvailable(false)
      setShowVoteModal(true)
    } finally {
      setIsCreatingVote(false)
    }
  }

  const submitVote = async (optionId: number) => {
    if (!voteData) return
    setIsVoting(true)
    try {
      await axios.post(
        `${API_BASE_URL}/v1/votes/${voteData.voteId}`,
        { optionId },
        { withCredentials: true }
      )
      const myParticipantId = participants.find(
        (p) => p.userId === user?.id
      )?.participantId
      if (myParticipantId) {
        setVoteData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            options: prev.options.map((opt) => {
              const filtered = opt.voters.filter(
                (v) => v.participantId !== myParticipantId
              )
              if (opt.optionId === optionId) {
                return {
                  ...opt,
                  voteCount: filtered.length + 1,
                  voters: [
                    ...filtered,
                    { participantId: myParticipantId, nickname: myNickname },
                  ],
                }
              }
              return { ...opt, voteCount: filtered.length, voters: filtered }
            }),
          }
        })
      }
      setShowVoteModal(false)
    } finally {
      setIsVoting(false)
    }
  }

  const handleVoteButtonClick = async () => {
    if (!meetingUuid) return
    const hasVote = Boolean(voteData?.options?.length)
    if (isHost && (!hasVote || isNewPlaceAvailable)) {
      await createVote()
      setIsNewPlaceAvailable(false)
      return
    }
    if (hasVote) setShowVoteModal(true)
  }

  /* ================= 확정 ================= */

  const handleConfirmPlace = async () => {
    if (!selectedPlace || !meetingUuid) return
    if (!isHost) {
      alert('모임장만 장소를 확정할 수 있습니다.')
      return
    }
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
    } finally {
      setIsConfirming(false)
    }
  }

  /* ================= 계산 ================= */

  const placeVoteMap = useMemo(() => {
    if (!voteData) return new Map()
    const map = new Map<string, VoteOption>()
    voteData.options.forEach((option) => {
      const place = recommendedPlaces.find((p) => p.name === option.content)
      if (place) map.set(place.id, option)
    })
    return map
  }, [voteData, recommendedPlaces])

  const myVotedOptionId = useMemo(() => {
    if (!voteData || !user?.id) return null
    const myParticipantId = participants.find(
      (p) => p.userId === user?.id
    )?.participantId
    if (!myParticipantId) return null
    const voted = voteData.options.find((opt) =>
      opt.voters.some((v) => v.participantId === myParticipantId)
    )
    return voted?.optionId || null
  }, [voteData, user?.id, participants])

  const totalVotes =
    voteData?.options.reduce((sum, opt) => sum + opt.voteCount, 0) || 0
  const maxVotes = voteData
    ? Math.max(...voteData.options.map((opt) => opt.voteCount))
    : 0

  const hasVote = Boolean(voteData?.options?.length)
  let voteButtonLabel = '투표 대기 중'
  if (isCreatingVote) voteButtonLabel = '생성 중...'
  else if (isHost && !voteData?.options?.length)
    voteButtonLabel = '투표 시작하기'
  else if (isHost && isNewPlaceAvailable)
    voteButtonLabel = '새 추천 장소! 투표 갱신'
  else if (voteData?.options?.length) voteButtonLabel = '투표하기'

  const isVoteDisabled =
    isCreatingVote || recommendedPlaces.length === 0 || (!isHost && !hasVote)

  let confirmLabel = '추천 장소 확정'
  if (isConfirming) confirmLabel = '확정 중...'
  else if (!isHost) confirmLabel = '모임장만 확정할 수 있습니다'

  return (
    <div className="relative">
      {/* ================= 지도: 배경 ================= */}
      {/* 1/30[유리] - 지도 배경화 및 콘텐츠 오버레이 */}
      {meetingUuid && (
        <div className="relative h-[60vh] min-h-[360px]">
          <Step4Map
            meetingUuid={meetingUuid}
            refreshKey={mapRefreshKey}
            minHeight={360}
          />

          {/* 투표 중앙 CTA */}
          {/* 1/30[유리] - 투표 가능 시 지도 중앙 CTA(danger) */}
          {hasVote && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Button
                type="button"
                onClick={handleVoteButtonClick}
                disabled={isVoteDisabled}
                className="pointer-events-auto bg-[var(--danger)] text-white py-6 px-6 text-base font-semibold"
              >
                투표 참여하기
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Toast */}
      {/* 1/30[유리] - 지도 위 고정 배너 제거 → Toast 전환(danger) */}
      {isNewPlaceAvailable && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2">
          <button
            type="button"
            onClick={() => setShowVoteModal(true)}
            className="flex items-center gap-2 rounded-full bg-[var(--danger-soft)] px-4 py-2 text-sm font-medium text-[var(--danger)]"
          >
            <AlertTriangle className="h-4 w-4" />
            새로운 추천 장소가 있어요 · 투표하기
          </button>
        </div>
      )}

      {/* ================= 추천 장소 ================= */}
      <section className="relative z-10 mx-auto max-w-xl bg-[var(--bg)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text)]">
              추천장소 선택
            </h2>
            <p className="text-xs text-[var(--text-subtle)]">
              중간지점 기준 추천
            </p>
          </div>
          <Button
            type="button"
            disabled={isVoteDisabled}
            onClick={handleVoteButtonClick}
            className="bg-[var(--danger)] text-white disabled:opacity-40"
          >
            {voteButtonLabel}
          </Button>
        </div>

        {isLoadingPlaces ? (
          <div className="flex items-center justify-center rounded-lg border border-[var(--border)] py-10">
            <span className="text-sm text-[var(--text-subtle)]">
              추천 장소를 찾고 있어요...
            </span>
          </div>
        ) : recommendedPlaces.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border border-[var(--border)] py-10">
            <span className="text-sm text-[var(--text-subtle)]">
              추천 장소 데이터가 없어요. 잠시 후 다시 시도해주세요.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {recommendedPlaces.map((place) => {
              const Icon = place.icon
              const selected = selectedPlace === place.id
              const voteOption = placeVoteMap.get(place.id)
              const hasVotes = Boolean(voteOption && voteOption.voteCount > 0)
              const isTopChoice = Boolean(
                voteOption &&
                voteOption.voteCount === maxVotes &&
                maxVotes > 0
              )
              const votePercentage =
                totalVotes > 0 && voteOption
                  ? (voteOption.voteCount / totalVotes) * 100
                  : 0

              // 이동시간 정보
              const routeData = routeCache[place.id]
              const isLoadingRoute = loadingRoutes[place.id]
              const avgTravelTime = routeData?.statistics?.averageTravelTime

              // 내 이동시간 계산
              const myTransportType = myParticipant?.type
              let myTravelTime: number | null = null
              let myTransportIcon: React.ReactNode = null

              if (routeData && myParticipant) {
                if (myTransportType === 'CAR') {
                  // 자동차: carRoutes에서 찾기 (매장까지 직접)
                  const myCarRoute = routeData.carRoutes?.find(
                    (r) => r.participantName === myParticipant.nickName
                  )
                  if (myCarRoute) {
                    myTravelTime = myCarRoute.travelTime
                    myTransportIcon = <Car className="h-3 w-3" />
                  }
                } else if (myTransportType === 'WALK') {
                  // 도보: walkingMinutes만
                  myTravelTime = place.walkingMinutes
                  myTransportIcon = null
                } else {
                  // 대중교통 (PUBLIC 또는 기본값)
                  const myRoute = routeData.routes?.find(
                    (r) => r.participantName === myParticipant.nickName
                  )
                  if (myRoute) {
                    // 대중교통: API 시간 + 도보시간
                    myTravelTime = myRoute.travelTime + place.walkingMinutes
                    myTransportIcon = <Train className="h-3 w-3" />
                  }
                }
              }

              let cls =
                'relative flex items-center gap-3 rounded-lg border p-3'
              if (selected) cls += ' border-[var(--danger)]'
              else cls += ' border-[var(--border)]'

              return (
                <button
                  key={place.id}
                  onClick={() => handlePlaceClick(place)}
                  className={cls}
                >
                  {hasVotes && (
                    <div
                      className="absolute left-0 top-0 h-full"
                      style={{
                        width: `${votePercentage}%`,
                        backgroundColor: 'var(--neutral-soft)',
                        opacity: 0.5,
                      }}
                    />
                  )}
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-md bg-[var(--neutral-soft)]">
                    <Icon className="h-6 w-6 text-[var(--danger)]" />
                  </div>
                  <div className="relative flex-1 text-left">
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {place.name}
                    </p>
                    <p className="text-xs text-[var(--text-subtle)]">
                      {place.stationName} · 도보 {place.walkingMinutes}분
                    </p>
                    {/* 이동시간 표시 (전체 카드 클릭 가능) */}
                    {isLoadingRoute ? (
                      <p className="mt-1 text-xs text-[var(--text-subtle)]">
                        이동시간 조회 중...
                      </p>
                    ) : myTravelTime !== null ? (
                      <div className="mt-1 flex items-center gap-1 text-xs text-[var(--danger)]">
                        나 {myTransportIcon} {myTravelTime}분
                        {avgTravelTime && avgTravelTime !== myTravelTime && (
                          <span className="text-[var(--text-subtle)] ml-1">
                            (평균 {avgTravelTime}분)
                          </span>
                        )}
                      </div>
                    ) : avgTravelTime ? (
                      <div className="mt-1 flex items-center gap-1 text-xs text-[var(--danger)]">
                        <Clock className="h-3 w-3" />
                        평균 {avgTravelTime}분
                      </div>
                    ) : null}
                    {hasVotes && voteOption && (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--danger)]">
                          {voteOption.voteCount}표
                        </span>
                        {isTopChoice && (
                          <span className="rounded-full bg-[var(--danger)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            1위
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {selected && (
                    <CheckCircle className="relative h-5 w-5 text-[var(--danger)]" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </section>

      {/* ================= Drawer(기존) ================= */}
      <WireframeModal
        open={showVoteModal}
        title="추천장소 투표"
        onClose={() => setShowVoteModal(false)}
      >
        <div className="space-y-3">
          {voteData ? (
            <>
              <div className="mb-4 text-center">
                <p className="text-sm text-[var(--text-subtle)]">
                  총 {totalVotes}표 ·{' '}
                  {myVotedOptionId ? '투표 완료' : '투표해주세요'}
                </p>
              </div>

              <ScrollArea className="max-h-80 pr-1">
                <div className="space-y-2">
                  {voteData.options.map((option) => {
                    const place = recommendedPlaces.find(
                      (p) => p.name === option.content
                    )
                    const Icon = place?.icon || Coffee
                    const isMyVote = option.optionId === myVotedOptionId
                    const votePercentage =
                      totalVotes > 0
                        ? (option.voteCount / totalVotes) * 100
                        : 0
                    const isTopChoice =
                      option.voteCount === maxVotes && maxVotes > 0

                    let optionClass =
                      'relative w-full overflow-hidden rounded-lg border p-3 text-left'
                    if (isMyVote)
                      optionClass += ' border-[var(--danger)]'
                    else optionClass += ' border-[var(--border)]'

                    return (
                      <button
                        key={option.optionId}
                        onClick={() => submitVote(option.optionId)}
                        disabled={isVoting}
                        className={optionClass}
                      >
                        <div
                          className="absolute left-0 top-0 h-full"
                          style={{
                            width: `${votePercentage}%`,
                            backgroundColor: 'var(--neutral-soft)',
                            opacity: 0.5,
                          }}
                        />
                        <div className="relative flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--neutral-soft)]">
                            <Icon className="h-6 w-6 text-[var(--danger)]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-[var(--text)]">
                                {option.content}
                              </p>
                              {isTopChoice && option.voteCount > 0 && (
                                <span className="rounded-full bg-[var(--danger)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                                  1위
                                </span>
                              )}
                            </div>
                          </div>
                          {isMyVote && (
                            <CheckCircle className="h-5 w-5 text-[var(--danger)]" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </>
          ) : null}
        </div>
      </WireframeModal>

      {/* ================= 이동시간 상세 모달 ================= */}
      <WireframeModal
        open={showTravelTimeModal}
        title="참여자별 이동시간"
        onClose={() => setShowTravelTimeModal(false)}
      >
        {selectedPlaceForDetail && (
          <div className="space-y-4">
            {/* 매장 정보 요약 */}
            {selectedPlaceDetail && (
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--neutral-soft)]">
                  {(() => {
                    const Icon = selectedPlaceDetail.icon || Coffee
                    return <Icon className="h-7 w-7 text-[var(--danger)]" />
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text)]">
                    {selectedPlaceDetail.name}
                  </h3>
                  <p className="text-xs text-[var(--text-subtle)]">
                    {selectedPlaceDetail.address || selectedPlaceDetail.stationName}
                  </p>
                </div>
              </div>
            )}

            {routeCache[selectedPlaceForDetail] ? (
              <>
                {/* 통계 요약 */}
                {routeCache[selectedPlaceForDetail].statistics && (
                  <div className="rounded-xl bg-[var(--neutral-soft)] p-4 border border-[var(--border)]">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xl font-bold text-[var(--danger)]">
                          {routeCache[selectedPlaceForDetail].statistics?.averageTravelTime}분
                        </p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-subtle)]">평균</p>
                      </div>
                      <div className="border-x border-[var(--border)]">
                        <p className="text-xl font-bold text-[var(--text)]">
                          {routeCache[selectedPlaceForDetail].statistics?.minTravelTime}분
                        </p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-subtle)]">최소</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-[var(--text)]">
                          {routeCache[selectedPlaceForDetail].statistics?.maxTravelTime}분
                        </p>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-subtle)]">최대</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 대중교통 경로 */}
                {routeCache[selectedPlaceForDetail].routes &&
                  routeCache[selectedPlaceForDetail].routes!.length > 0 && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                        <Train className="h-4 w-4 text-[var(--text-subtle)]" />
                        대중교통 참여자
                      </h4>
                      <div className="space-y-2">
                        {routeCache[selectedPlaceForDetail].routes!.map(
                          (route: RouteInfo, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 bg-[var(--bg)]"
                            >
                              <span className="text-sm font-medium text-[var(--text)]">
                                {route.participantName}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-[var(--text-subtle)]">
                                  환승 {route.transferCount}회
                                </span>
                                <span className="text-sm font-bold text-[var(--danger)]">
                                  {route.travelTime}분
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* 자동차 경로 */}
                {routeCache[selectedPlaceForDetail].carRoutes &&
                  routeCache[selectedPlaceForDetail].carRoutes!.length > 0 && (
                    <div className="pt-2">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                        <Car className="h-4 w-4 text-[var(--text-subtle)]" />
                        자동차 참여자
                      </h4>
                      <div className="space-y-2">
                        {routeCache[selectedPlaceForDetail].carRoutes!.map(
                          (route: CarRouteInfo, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 bg-[var(--bg)]"
                            >
                              <span className="text-sm font-medium text-[var(--text)]">
                                {route.participantName}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-[var(--text-subtle)]">
                                  {(route.distance / 1000).toFixed(1)}km
                                </span>
                                <span className="text-sm font-bold text-[var(--danger)]">
                                  {route.travelTime}분
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-[var(--text-subtle)]">이동시간 정보를 불러오는 중입니다...</p>
              </div>
            )}

            {/* 선택 버튼 (푸터 스타일) */}
            <div className="pt-4">
              <Button
                variant="outline"
                onClick={() => setShowTravelTimeModal(false)}
                className="w-full border-2 border-[var(--danger)] text-[var(--danger)] font-bold py-6 rounded-xl hover:bg-[var(--danger-soft)]"
              >
                닫기
              </Button>
            </div>
          </div>
        )}
      </WireframeModal>

      {/* ================= 확정 CTA ================= */}
      <div className="sticky bottom-0 z-20 bg-[var(--bg)] p-4">
        <Button
          disabled={!selectedPlace || isConfirming || !isHost}
          onClick={handleConfirmPlace}
          className="w-full bg-[var(--danger)] text-white py-6 text-base font-semibold disabled:opacity-40"
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  )
}
