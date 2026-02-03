// src/components/meeting/Step3PlaceList.tsx
'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import WireframeModal from '@/components/ui/WireframeModal'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import VoteOrSelectDrawer from '@/components/meeting/Step3/VoteOrSelectDrawer'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { useUser } from '@/context/UserContext'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import {
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
  // 투표모달 미사용으로 숨기기 AlertTriangle,
  Car,
  Train,
  ExternalLink,
  Phone,
  MapPinned,
  type LucideIcon,
} from 'lucide-react'
import { calculateRoutes } from '@/lib/api/route'
import type { RouteResponse } from '@/types/route'
import type { CommonResponse } from '@/types/api'

// shadcn/ui

import { Button } from '@/components/ui/button'
// 투표모달 미사용으로 숨기기 import { ScrollArea } from '@/components/ui/scroll-area'

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
  // 프로덕션에서도 오류 추적을 위해 항상 로깅
  console.error(`[Step3] ${message}`, error)
  // TODO: 필요 시 외부 로깅 서비스(Sentry 등)로 전송 가능
}



  
/* ================= 컴포넌트 ================= */

export default function Step3PlaceList({ onStatusLoaded }: Step3PlaceListProps) {
  const hasShownToastRef = useRef(false)
  const handleVoteButtonClickRef = useRef<(() => void) | null>(null)
  const [isNewPlaceAvailable, setIsNewPlaceAvailable] = useState(false)
  // const [mapRefreshKey, setMapRefreshKey] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const meetingUuid = searchParams.get('meetingUuid')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)
  const [, setShowVoteModal] = useState(false)

  const [, setMiddlePoint] = useState<MiddlePoint | null>(null)
  const [placeSource, setPlaceSource] = useState<
    Omit<RecommendedPlace, 'icon'>[]
  >([])
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  // const [isConfirming, setIsConfirming] = useState(false)
  const [voteData, setVoteData] = useState<VoteData | null>(null)
  // const [isVoteLoading, setIsVoteLoading] = useState(true)  // 투표 데이터 로딩 상태
  const [, setIsCreatingVote] = useState(false)
  //const [isVoting, setIsVoting] = useState(false)
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
  const showTravelTimeModalRef = useRef(showTravelTimeModal)
  const selectedPlaceForDetailRef = useRef(selectedPlaceForDetail)

  useEffect(() => {
    routeCacheRef.current = routeCache
  }, [routeCache])

  useEffect(() => {
    showTravelTimeModalRef.current = showTravelTimeModal
  }, [showTravelTimeModal])

  useEffect(() => {
    selectedPlaceForDetailRef.current = selectedPlaceForDetail
  }, [selectedPlaceForDetail])

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
    // ================= 임시방편: 안정화 가드 =================
    // 참여자 없으면 계산 자체를 시도하지 않음 (에러 폭탄 방지)
    if (!participants || participants.length === 0) return

    // 필수 값 없으면 중단
    if (!meetingUuid || !latitude || !longitude) return

    // 이미 처리 중 / 캐시 있으면 중단
    if (
      routeCacheRef.current[placeId] ||
      loadingRoutesRef.current[placeId]
    ) {
      return
    }
    // =========================================================

    setLoadingRoutes((prev) => ({ ...prev, [placeId]: true }))
    try {
      await calculateRoutes(meetingUuid, {
        latitude,
        longitude,
      })
        .then((response) => {
          const res = response as CommonResponse<RouteResponse>
          if (!res?.data) return

          const routeData: RouteResponse = res.data

          setRouteCache((prev) => ({
            ...prev,
            [placeId]: routeData,
          }))
        })
        .catch((e) => {
          if (process.env.NODE_ENV === 'development') {
            console.debug('[Step3] 이동시간 계산 실패 (무시됨)', e)
          }
          return
        })
    } finally {
      setLoadingRoutes((prev) => ({ ...prev, [placeId]: false }))
    }
  },
  [meetingUuid, participants]
)

  // 2/3 22:00 에러 백엔드500 문제로 프론트에서 임시로 막아둡니다 
  // const fetchTravelTimes = useCallback(
  //   async (placeId: string, latitude: number, longitude: number) => {
  //     if (
  //       !meetingUuid ||
  //       routeCacheRef.current[placeId] ||
  //       loadingRoutesRef.current[placeId]
  //     ) {
  //       return
  //     }

  //     setLoadingRoutes((prev) => ({ ...prev, [placeId]: true }))
  //     try {
  //       const response = (await calculateRoutes(meetingUuid, {
  //         latitude,
  //         longitude,
  //       })) as CommonResponse<RouteResponse>

  //       if (response?.data) {
  //         const data = response.data
  //         setRouteCache((prev) => ({ ...prev, [placeId]: data }))
  //       }
  //     } catch (error) {
  //       logClientError('이동시간 조회 실패', error)
  //     } finally {
  //       setLoadingRoutes((prev) => ({ ...prev, [placeId]: false }))
  //     }
  //   },
  //   [meetingUuid]
  // )

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

  const fireNewPlaceToast = useCallback(() => {
    if (hasShownToastRef.current) return

    hasShownToastRef.current = true

    toast({
      title: '새로운 추천 장소가 있어요',
      description: '투표를 진행해 주세요',
      variant: 'destructive',
      action: (
        <ToastAction
          altText="투표하기"
          onClick={() => handleVoteButtonClickRef.current?.()}
        >
          투표하기
        </ToastAction>
      ),
    })
  }, [])

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

        client.subscribe(`/topic/meeting/${meetingUuid}/places`, () => {
        fetchPlacesAndMidpointRef.current()
        setRouteCache({})

        if (voteDataRef.current) {
          fireNewPlaceToast()
        }
      })

        
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
          // setMapRefreshKey((p) => p + 1)
          // 추천 장소 변경 시 이동시간 캐시 초기화
          setRouteCache({})

          // 모달이 열려있으면 해당 장소의 이동시간 다시 조회
          if (showTravelTimeModalRef.current && selectedPlaceForDetailRef.current) {
            const place = recommendedPlacesRef.current.find(
              (p) => p.id === selectedPlaceForDetailRef.current
            )
            if (place?.latitude && place?.longitude) {
              // 약간의 딜레이 후 재조회 (추천장소 갱신 후)
              setTimeout(() => {
                setLoadingRoutes((prev) => ({ ...prev, [place.id]: true }))
                calculateRoutes(meetingUuid, {
                  latitude: place.latitude!,
                  longitude: place.longitude!,
                }).then((response) => {
                  const res = response as CommonResponse<RouteResponse>
                  if (res?.data) {
                    const data = res.data
                    setRouteCache((prev) => ({ ...prev, [place.id]: data }))
                  }
                }).catch((err) => {
                  logClientError('모달 이동시간 재조회 실패', err)
                }).finally(() => {
                  setLoadingRoutes((prev) => ({ ...prev, [place.id]: false }))
                })
              }, 500)
            }
          }

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
  }, [voteData?.voteId, meetingUuid, fireNewPlaceToast])

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

  // 프리페칭: 추천장소 로드 시 이동시간 미리 조회
  const recommendedPlacesRef = useRef(recommendedPlaces)
  useEffect(() => {
    recommendedPlacesRef.current = recommendedPlaces
  }, [recommendedPlaces])

  // 2/3 토스트 강제 띄우기 
//   useEffect(() => {
//   toast({
//     title: '토스트 테스트',
//     description: '이게 뜨면 구조는 완벽',
//   })
// }, [])

  
  // ================= 이동시간 프리페칭 =================
// ✅ 여기서 "계산 가능한 경우만" 이동시간 계산하도록 조건 보강
useEffect(() => {
  // ❗ 필수 조건 체크 (없으면 500 나는 케이스)
  if (!meetingUuid) return
  if (!recommendedPlaces || recommendedPlaces.length === 0) return

  // ✅ 좌표 + placeId가 있는 장소만 대상으로 제한
  const validPlaces = recommendedPlaces.filter(
    (p) => p.id && p.latitude && p.longitude
  )
  if (validPlaces.length === 0) return

  const prefetchTravelTimes = async () => {
    for (const place of validPlaces) {
      // ✅ 이미 캐시 있거나 로딩 중이면 스킵
      if (
        routeCacheRef.current[place.id] ||
        loadingRoutesRef.current[place.id]
      ) {
        continue
      }

      await fetchTravelTimes(place.id, place.latitude!, place.longitude!)
      // API 부하 방지
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  prefetchTravelTimes()
}, [meetingUuid, recommendedPlaces, fetchTravelTimes])
// ✅ 여기까지

  
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

  const selectedPlaceRouteData = selectedPlaceForDetail
    ? routeCache[selectedPlaceForDetail]
    : undefined



  // src/components/meeting/Step3PlaceList.tsx

useEffect(() => {
  if (!meetingUuid || !hasInitiallyLoaded || isLoadingPlaces) return

  if (!isNewPlaceAvailable || hasShownToastRef.current) return

  hasShownToastRef.current = true

  toast({
    title: '새로운 추천 장소가 있어요',
    description: '투표를 진행해 주세요',
    variant: 'destructive',
    action: (
      <ToastAction
        altText="투표하기"
        onClick={() => setShowVoteModal(true)}
      >
        투표하기
      </ToastAction>
    ),
  })
}, [isNewPlaceAvailable, meetingUuid, hasInitiallyLoaded, isLoadingPlaces])


  // 2/3)[율] 새추천천 있을시, 새 토스트로 추천장소 투표 요청  
  useEffect(() => {
  if (!isNewPlaceAvailable) {
    hasShownToastRef.current = false
  }
}, [isNewPlaceAvailable])
  

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
      if (!cancelled) {
        if (fetchedVote) setVoteData(fetchedVote)
        // setIsVoteLoading(false)  // 로딩 완료
      }
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
    // 2/3율 투표모달 미사용 setIsVoting(true)
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
      // 2/3) 율 투표모달 미사용 setIsVoting(false)
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
  handleVoteButtonClickRef.current = handleVoteButtonClick

  /* ================= 확정 ================= */

  const handleConfirmPlace = async () => {
    if (!selectedPlace || !meetingUuid) return
    if (!isHost) {
      alert('모임장만 장소를 확정할 수 있습니다.')
      return
    }
    const selected = recommendedPlaces.find((p) => p.id === selectedPlace)
    if (!selected) return
    // setIsConfirming(true)
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
      // setIsConfirming(false)
    }
  }

  /* ================= 계산 ================= */

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

  // let confirmLabel = '추천 장소 확정'
  // if (isConfirming) confirmLabel = '확정 중...'
  // else if (!isHost) confirmLabel = '모임장만 확정할 수 있습니다'

  return (
    <div className="relative">
      
      {/* ================= 투표 / 선택 Drawer ================= */}
      <VoteOrSelectDrawer
        places={recommendedPlaces}
        voteData={voteData}
        selectedPlaceId={selectedPlace}
        isHost={isHost}
        myVotedOptionId={myVotedOptionId}
        onVote={submitVote}
        onConfirm={handleConfirmPlace}
        onSelectPlace={(placeId) => {
          const place = recommendedPlaces.find((p) => p.id === placeId)
          if (place) {
            handlePlaceClick(place)   // 🔥 기존 모달 로직 재사용
          }
        }}
      />


      {/* 2/3)[율] 기존 투표모달창 주석처러 */}
      {/* <WireframeModal
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
      </WireframeModal> */}

{/* ================= 이동시간 상세 모달 ================= */}
<WireframeModal
  open={showTravelTimeModal}
  title="참여자별 이동시간"
  onClose={() => setShowTravelTimeModal(false)}
>
  {selectedPlaceForDetail && (
    <div className="space-y-4">
      {/* ================= 가게 정보 ================= */}
      {selectedPlaceDetail && (
        <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--bg)]">
          {/* 아이콘 + 가게명 */}
          <div className="flex items-center gap-3 mb-3">
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
                {selectedPlaceDetail.categoryGroupName ||
                  selectedPlaceDetail.category}
              </p>
            </div>
          </div>

          {/* 주소 */}
          {(selectedPlaceDetail.roadAddress ||
            selectedPlaceDetail.address) && (
            <div className="flex items-start gap-2 mb-2">
              <MapPinned className="h-4 w-4 text-[var(--text-subtle)] mt-0.5" />
              <p className="text-sm text-[var(--text)]">
                {selectedPlaceDetail.roadAddress ||
                  selectedPlaceDetail.address}
              </p>
            </div>
          )}

          {/* 전화번호 */}
          {selectedPlaceDetail.phone && (
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-4 w-4 text-[var(--text-subtle)]" />
              <a
                href={`tel:${selectedPlaceDetail.phone}`}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                {selectedPlaceDetail.phone}
              </a>
            </div>
          )}

          {/* 카카오맵 링크 */}
          {selectedPlaceDetail.placeUrl && (
            <a
              href={selectedPlaceDetail.placeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#FEE500] text-[#191919] text-sm font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              카카오맵에서 보기
            </a>
          )}
        </div>
      )}

      {/* ================= 이동시간 ================= */}
      {selectedPlaceRouteData ? (
        <>
          {/* 요약 통계 */}
          {selectedPlaceRouteData.statistics && (
            <div className="rounded-xl bg-[var(--neutral-soft)] p-4 border border-[var(--border)]">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold text-[var(--danger)]">
                    {selectedPlaceRouteData.statistics
                      ?.averageTravelTime}
                    분
                  </p>
                  <p className="text-[10px] text-[var(--text-subtle)]">
                    평균
                  </p>
                </div>
                <div className="border-x border-[var(--border)]">
                  <p className="text-xl font-bold">
                    {selectedPlaceRouteData.statistics
                      ?.minTravelTime}
                    분
                  </p>
                  <p className="text-[10px] text-[var(--text-subtle)]">
                    최소
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold">
                    {selectedPlaceRouteData.statistics
                      ?.maxTravelTime}
                    분
                  </p>
                  <p className="text-[10px] text-[var(--text-subtle)]">
                    최대
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 대중교통 */}
          {selectedPlaceRouteData.routes &&
            selectedPlaceRouteData.routes.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Train className="h-4 w-4" />
                대중교통
              </h4>
              <div className="space-y-2">
                {selectedPlaceRouteData.routes.map(
                  (route, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between rounded-lg border p-3"
                    >
                      <span>{route.participantName}</span>
                      <span className="font-bold text-[var(--danger)]">
                        {route.travelTime}분
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* 자동차 */}
          {selectedPlaceRouteData.carRoutes &&
            selectedPlaceRouteData.carRoutes.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Car className="h-4 w-4" />
                자동차
              </h4>
              <div className="space-y-2">
                {selectedPlaceRouteData.carRoutes.map(
                  (route, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between rounded-lg border p-3"
                    >
                      <span>{route.participantName}</span>
                      <span className="font-bold text-[var(--danger)]">
                        {route.travelTime}분
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-10 text-center">
          <p className="text-sm text-[var(--text-subtle)]">
            이동시간 정보를 불러오는 중입니다...
          </p>
        </div>
      )}

      {/* 닫기 버튼 */}
      <Button
        variant="outline"
        onClick={() => setShowTravelTimeModal(false)}
        className="w-full py-6 border-2 border-[var(--danger)] text-[var(--danger)] font-bold rounded-xl"
      >
        닫기
      </Button>
    </div>
  )}
</WireframeModal>

      

      {/* ================= 확정 CTA ================= */}
      {/* <div className="sticky bottom-0 z-20 bg-[var(--bg)] p-4">
        <Button
          disabled={!selectedPlace || isConfirming || !isHost}
          onClick={handleConfirmPlace}
          className="w-full bg-[var(--danger)] text-white py-6 text-base font-semibold disabled:opacity-40"
        >
          {confirmLabel}
        </Button>
      </div> */}
    </div>
  )
}
