// src/components/meeting/Step3PlaceList.tsx
'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import StepCard from '@/components/meeting/StepCard'
import WireframeModal from '@/components/ui/WireframeModal'
import KakaoMap from '@/components/map/KakaoMap'
import { useRouter, useSearchParams } from 'next/navigation'
import ProfileIdentity from '@/components/common/ProfileIdentity'
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
  Users,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

/* ================= 타입 ================= */

// interface MeUser {
//   userId?: number
//   name?: string
//   nickname?: string
//   profileImage?: string
// }

interface Participant {
  participantId: number
  userId: number
  nickName?: string
  profileImageUrl?: string
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

/* ================= API BASE ================= */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

/* ================= 유틸 ================= */

function displayName(name?: string) {
  if (!name) return ''
  return name.length > 6 ? `${name.slice(0, 6)}…` : name
}

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
  restaurant: [Utensils, UtensilsCrossed, Soup, Pizza, Sandwich, Fish, Beef],
  culture: [Theater, Film, Music, BookOpen, Palette, Gamepad2],
  tour: [Landmark, Camera, MapPin, Mountain, TreePalm, Building2],
}

function pickIconById(category: PlaceCategory, id: string): LucideIcon {
  const icons = ICONS_BY_CATEGORY[category]
  const hash = id.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return icons[hash % icons.length]
}

/* ================= FE 더미 추천장소 (fallback) ================= */
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

//   const [me, setMe] = useState<MeUser | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)

  const [middlePoint, setMiddlePoint] = useState<MiddlePoint | null>(null)
  const [placeSource, setPlaceSource] = useState<Omit<RecommendedPlace, 'icon'>[]>(rawPlaces)
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  const [expandedSearchInfo, setExpandedSearchInfo] = useState<{
    expandedSearch: boolean
    searchRadius?: number
  } | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [voteData, setVoteData] = useState<VoteData | null>(null)
  const [isCreatingVote, setIsCreatingVote] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [organizerId, setOrganizerId] = useState<number | null>(null)
  const [meetingPurpose, setMeetingPurpose] = useState<string | null>(null)
  const { user } = useUser()
  const stompClientRef = useRef<Client | null>(null)
const myParticipant = participants.find(
  p => p.userId === user?.id
)
const myNickname = myParticipant?.nickName ?? '나'

  /* ================= 모임장 여부 체크 ================= */

const isHost =organizerId != null && user?.id != null && organizerId === user.id

  /* ================= WebSocket 연결 ================= */

  useEffect(() => {
    if (!voteData?.voteId && !meetingUuid) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      onConnect: () => {
        // 기존: 투표 업데이트 구독
        if (voteData?.voteId) {
          client.subscribe(`/topic/votes/${voteData.voteId}`, (message) => {
            try {
              const result = JSON.parse(message.body)
              if (result.options) {
                setVoteData(prev => prev ? { ...prev, options: result.options } : null)
              }
            } catch (error) {
              console.error('WebSocket 메시지 처리 실패:', error)
            }
          })
        }

        // ✅ 새로 추가: 투표 생성 구독
        client.subscribe(`/topic/votes/meeting/${meetingUuid}`, (message) => {
          try {
            const result = JSON.parse(message.body)
            if (result.voteId && result.options) {
              setVoteData(result)  // 다른 유저가 생성하면 바로 업데이트
            }
          } catch (error) {
            console.error('투표 생성 WebSocket 처리 실패:', error)
          }
        })
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
      },
    })

    client.activate()
    stompClientRef.current = client

    return () => {
      client.deactivate()
      stompClientRef.current = null
    }
  }, [voteData?.voteId, meetingUuid])


  /* ================= 참여자 API ================= */

  useEffect(() => {
    if (!meetingUuid || !user?.id) return

    axios
      .get(`${API_BASE_URL}/v1/meetings/${meetingUuid}`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data?.data
        console.log('Meeting API Response:', data)

        const rawParticipants: Participant[] = data?.participants ?? []
        const sorted = sortParticipants(rawParticipants, user?.id)
        setParticipants(sorted)

        const organizerIdValue = Number(data?.organizerId ?? 0)
        setOrganizerId(organizerIdValue || null)

        // 모임 목적 저장
        setMeetingPurpose(data?.purpose || 'DINING')
      })
      .catch((err) => {
        console.error('Meeting API Error:', err)
        setParticipants([])
      })
  }, [meetingUuid, user?.id])

  /* ================= 추천장소 + 중간지점 통합 API ================= */

  useEffect(() => {
    if (!meetingUuid || !meetingPurpose) return

    const fetchPlacesAndMidpoint = async () => {
      setIsLoadingPlaces(true)
      setExpandedSearchInfo(null)

      try {
        const res = await axios.get(
          `${API_BASE_URL}/v1/meetings/${meetingUuid}/places?purpose=${meetingPurpose}&limit=6`,
          { withCredentials: true }
        )

        const data = res.data?.data
        const apiPlaces: unknown[] = Array.isArray(data?.places) ? data.places : []
        const apiMidpoint = data?.midpoint
        const expandedSearch = Boolean(data?.expandedSearch)
        const searchRadius = toNumber(data?.searchRadius)

        // 중간지점 설정
        if (apiMidpoint?.latitude && apiMidpoint?.longitude) {
          setMiddlePoint({
            lat: apiMidpoint.latitude,
            lng: apiMidpoint.longitude,
            stationName: apiMidpoint.stationName,
          })
        }

        setExpandedSearchInfo({ expandedSearch, searchRadius })

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
      } finally {
        setIsLoadingPlaces(false)
      }
    }

    fetchPlacesAndMidpoint()
  }, [meetingUuid, meetingPurpose])

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

  /* ================= 투표 API ================= */

const fetchVote = useCallback(async (): Promise<VoteData | null> => {
  if (!meetingUuid) return null;

  try {
    const res = await axios.get(`${API_BASE_URL}/v1/votes/meeting/${meetingUuid}`, {
      withCredentials: true,
      validateStatus: (status) => status < 500 // 404도 then으로 처리
    });

    if (res.status === 404) return null; // 투표가 없으면 null 반환
    return res.data?.data ?? null;
  } catch {
    return null; // 네트워크 오류만 무시
  }
}, [meetingUuid]);



useEffect(() => {
  if (!meetingUuid) return

  let cancelled = false

  const initFetchVote = async () => {
    const fetchedVote = await fetchVote()
    if (!cancelled && fetchedVote) {
      setVoteData(fetchedVote)
    }
  }

  initFetchVote()
  return () => { cancelled = true }
}, [meetingUuid, fetchVote])



  const createVote = async () => {
    if (!meetingUuid || !isHost) {
      alert('모임장만 투표를 생성할 수 있습니다.')
      return
    }

    setIsCreatingVote(true)
    try {
      const options = recommendedPlaces.map(p => p.name)

      const res = await axios.post(
        `${API_BASE_URL}/v1/votes/meeting/${meetingUuid}`,
        { options },
        { withCredentials: true }
      )

      if (res.data?.data) {
        setVoteData(res.data.data)
        setShowVoteModal(true)
      }
    } catch (error) {
      console.error('투표 생성 실패:', error)
      alert('투표 생성에 실패했습니다.')
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

      const myParticipantId = participants.find(p => p.userId === user?.id)?.participantId
      if (myParticipantId) {
        setVoteData(prev => {
          if (!prev) return prev

          return {
            ...prev,
            options: prev.options.map(opt => {
              const filteredVoters = opt.voters.filter(v => v.participantId !== myParticipantId)

              if (opt.optionId === optionId) {
                return {
                  ...opt,
                  voteCount: filteredVoters.length + 1,
                  voters: [...filteredVoters, {
                    participantId: myParticipantId,
                    nickname: myNickname,
                  }]
                }
              }

              return {
                ...opt,
                voteCount: filteredVoters.length,
                voters: filteredVoters
              }
            })
          }
        })
      }

      setShowVoteModal(false)
    } catch (error) {
      console.error('투표 참여 실패:', error)
      alert('투표에 실패했습니다.')
    } finally {
      setIsVoting(false)
    }
  }

 const handleVoteButtonClick = async () => {
   if (!meetingUuid) return
 const hasVoteOptions = Boolean(voteData?.options?.length)
   if (!voteData|| !hasVoteOptions) {
     const fetchedVote = await fetchVote()

     if (fetchedVote && fetchedVote.options?.length > 0) {
       setVoteData(fetchedVote)
       setShowVoteModal(true)
       return
     }

     if (isHost) {
       createVote()
     } else {
       alert('아직 투표가 시작되지 않았습니다.')
     }
   } else {
     setShowVoteModal(true)
   }
 }


  /* ================= 장소 확정 핸들러 ================= */

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
    } catch (err) {
      console.error('장소 확정 실패:', err)
      alert('장소 확정에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsConfirming(false)
    }
  }

  /* ================= 투표 데이터 계산 ================= */

  const placeVoteMap = useMemo(() => {
    if (!voteData) return new Map()

    const map = new Map<string, VoteOption>()
    voteData.options.forEach(option => {
      const place = recommendedPlaces.find(p => p.name === option.content)
      if (place) {
        map.set(place.id, option)
      }
    })
    return map
  }, [voteData, recommendedPlaces])

  const myVotedOptionId = useMemo(() => {
    if (!voteData || !user?.id) return null

    const myParticipantId = participants.find(p => p.userId === user?.id)?.participantId
    if (!myParticipantId) return null

    const votedOption = voteData.options.find(opt =>
      opt.voters.some(v => v.participantId === myParticipantId)
    )

    return votedOption?.optionId || null
  }, [voteData, user?.id, participants])

  const totalVotes = voteData?.options.reduce((sum, opt) => sum + opt.voteCount, 0) || 0
  const maxVotes = voteData ? Math.max(...voteData.options.map(opt => opt.voteCount)) : 0

  return (
    <div className="space-y-4">
      {/* ================= 지도 ================= */}
      <div className="h-56 overflow-hidden rounded-xl border border-[var(--wf-border)]">
        <KakaoMap markers={mapMarkers} level={5} />
      </div>

      {/* 투표 현황 배너 */}
      {voteData && totalVotes > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">투표 진행 중</h3>
                <p className="text-xs text-[var(--wf-subtle)]">총 {totalVotes}명이 투표했습니다</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 멤버 */}
      <div className="flex flex-wrap gap-2">
        {participants.map((p) => {
          const isMe = p.userId === user?.id

          return (
            <div
              key={p.participantId}
              className="flex h-16 w-16 flex-col items-center justify-center"
            >
              <div className="relative">


                <ProfileIdentity
                  src={p.profileImageUrl}
                  size={48}
                  shape="square"
                />

                {isMe && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-[var(--wf-accent)] px-1.5 text-[9px] text-white">
                    나
                  </span>
                )}
              </div>

              <span className="mt-1 text-[10px]">
                {displayName(p.nickName) || '참여자'}
              </span>
            </div>
          )
        })}
      </div>

      {/* 추천 장소 */}
      <StepCard className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">추천장소 선택</h2>
          <button
            type="button"
           disabled={
              isCreatingVote || (!isHost && (!voteData || (voteData.options?.length ?? 0) === 0))
            }
            onClick={handleVoteButtonClick}
           className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              isCreatingVote || (!isHost && (!voteData || (voteData.options?.length ?? 0) === 0))
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[var(--wf-highlight)] hover:opacity-90'
            }`}
          >
             {isCreatingVote
               ? '생성 중...'
               : voteData?.options?.length
               ? '투표하기'
               : isHost
               ? '투표 시작하기'
               : '투표 대기 중'}
          </button>
        </div>

        {isLoadingPlaces ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm text-[var(--wf-subtle)]">추천 장소를 찾고 있어요...</div>
          </div>
        ) : (
          <>
            {expandedSearchInfo?.expandedSearch && expandedSearchInfo.searchRadius != null && (
              <div className="text-xs text-[var(--wf-subtle)]">
                더 넓은 범위에서 찾았어요 ({expandedSearchInfo.searchRadius}m)
              </div>
            )}

            <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
              {recommendedPlaces.map((place) => {
                const Icon = place.icon
                const selected = selectedPlace === place.id
                const voteOption = placeVoteMap.get(place.id)
                const hasVotes = voteOption && voteOption.voteCount > 0
                const isTopChoice = voteOption && voteOption.voteCount === maxVotes && maxVotes > 0
                const votePercentage = totalVotes > 0 && voteOption
                  ? (voteOption.voteCount / totalVotes) * 100
                  : 0

                return (
                  <button
                    key={place.id}
                    onClick={() => setSelectedPlace(place.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 border-4 relative overflow-hidden ${
                      selected
                        ? 'border-[var(--wf-accent)] bg-[var(--wf-highlight-soft)]'
                        : hasVotes
                        ? 'border-purple-200 bg-white'
                        : 'border-[var(--wf-border)] bg-[var(--wf-surface)]'
                    }`}
                  >
                    {hasVotes && (
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-100/60 to-blue-100/60 transition-all"
                        style={{ width: `${votePercentage}%` }}
                      />
                    )}

                    <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--wf-muted)]">
                      <Icon className="h-8 w-8 text-[var(--wf-accent)]" />
                    </div>
                    <div className="flex-1 text-left relative">
                      <p className="text-sm font-semibold">{place.name}</p>
                      <p className="text-xs text-[var(--wf-subtle)]">
                        {place.stationName} 도보 {place.walkingMinutes}분
                      </p>

                      {hasVotes && (
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-semibold text-purple-600">
                              {voteOption.voteCount}표
                            </span>
                          </div>
                          {isTopChoice && (
                            <span className="rounded-full bg-purple-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                              1위
                            </span>
                          )}
                          <span className="text-[9px] text-[var(--wf-subtle)]">
                            {votePercentage.toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                    {selected && <CheckCircle className="h-5 w-5 text-[var(--wf-accent)] relative" />}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </StepCard>

      {/* 투표 모달 */}
      <WireframeModal
        open={showVoteModal}
        title="추천장소 투표"
        onClose={() => setShowVoteModal(false)}
      >
        <div className="space-y-3">
          {voteData ? (
            <>
              <div className="mb-4 text-center">
                <p className="text-sm text-[var(--wf-subtle)]">
                  총 {totalVotes}표 · {myVotedOptionId ? '투표 완료' : '투표해주세요'}
                </p>
              </div>

              {voteData.options.map((option) => {
                const place = recommendedPlaces.find(p => p.name === option.content)
                const Icon = place?.icon || Coffee
                const isMyVote = option.optionId === myVotedOptionId
                const votePercentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0
                const isTopChoice = option.voteCount === maxVotes && maxVotes > 0

                return (
                  <button
                    key={option.optionId}
                    onClick={() => submitVote(option.optionId)}
                    disabled={isVoting}
                    className={`relative w-full overflow-hidden rounded-xl border-4 p-3 text-left ${
                      isMyVote
                        ? 'border-[var(--wf-accent)] bg-[var(--wf-highlight-soft)]'
                        : 'border-[var(--wf-border)] bg-[var(--wf-surface)] hover:border-[var(--wf-accent)]/30'
                    }`}
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-100/50 to-blue-100/50 transition-all"
                      style={{ width: `${votePercentage}%` }}
                    />

                    <div className="relative flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        isMyVote ? 'bg-[var(--wf-accent)]' : 'bg-[var(--wf-muted)]'
                      }`}>
                        <Icon className={`h-6 w-6 ${
                          isMyVote ? 'text-white' : 'text-[var(--wf-accent)]'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold">{option.content}</p>
                          {isTopChoice && option.voteCount > 0 && (
                            <span className="rounded-full bg-purple-600 px-1.5 py-0.5 text-[9px] font-semibold text-white">
                              1위
                            </span>
                          )}
                        </div>

                        {option.voters.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs font-semibold text-purple-600">
                              {option.voteCount}표
                            </span>
                            <span className="text-xs text-[var(--wf-subtle)]">·</span>
                            {option.voters.map((voter) => (
                              <span
                                key={voter.participantId}
                                className="rounded-full bg-purple-100 px-2 py-0.5 text-[9px] font-medium text-purple-700"
                              >
                                {voter.nickname}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {isMyVote && (
                        <CheckCircle className="h-5 w-5 text-[var(--wf-accent)]" />
                      )}
                    </div>
                  </button>
                )
              })}
            </>
          ) : (
            recommendedPlaces.map((place) => {
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
            })
          )}
        </div>
      </WireframeModal>

      {/* 확정 버튼 */}
      <button
        disabled={!selectedPlace || isConfirming || !isHost}
        onClick={handleConfirmPlace}
        className="w-full rounded-2xl bg-[var(--wf-highlight)] py-4 text-base font-semibold disabled:opacity-40"
      >
        {isConfirming ? '확정 중...' : isHost ? '추천 장소 확정' : '모임장만 확정할 수 있습니다'}
      </button>
    </div>
  )
}
