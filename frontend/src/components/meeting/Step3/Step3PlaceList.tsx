// src/components/meeting/Step3PlaceList.tsx
'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import WireframeModal from '@/components/ui/WireframeModal'
import KakaoMap from '@/components/map/KakaoMap'
import { useRouter, useSearchParams } from 'next/navigation'
import ProfileIdentity from '@/components/layout/ProfileIdentity'
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

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

/* ================= 타입 ================= */

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

interface Step3PlaceListProps {
  onStatusLoaded?: (status: string) => void
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

export default function Step5PlaceList({
                                        onStatusLoaded,
                                      }: Step3PlaceListProps) {
const [isNewPlaceAvailable, setIsNewPlaceAvailable] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const meetingUuid = searchParams.get('meetingUuid')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null)
  const [showVoteModal, setShowVoteModal] = useState(false)

  const [middlePoint, setMiddlePoint] = useState<MiddlePoint | null>(null)
  const [placeSource, setPlaceSource] = useState<Omit<RecommendedPlace, 'icon'>[]>(rawPlaces)
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [voteData, setVoteData] = useState<VoteData | null>(null)
  const [isCreatingVote, setIsCreatingVote] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [organizerId, setOrganizerId] = useState<number | null>(null)
  const [meetingPurpose, setMeetingPurpose] = useState<string | null>(null)
  const { user } = useUser()
  const stompClientRef = useRef<Client | null>(null)
  const prevPlaceSignatureRef = useRef<string | null>(null)

  const myParticipant = participants.find(
    p => p.userId === user?.id
  )
  const myNickname = myParticipant?.nickName ?? '나'

  /* ================= 모임장 여부 체크 ================= */

  const isHost = organizerId != null && user?.id != null && organizerId === user.id

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
             if (result.voteId) {
                   setVoteData(result);
                   setIsNewPlaceAvailable(false);
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
        const rawParticipants: Participant[] = data?.participants ?? []
        const sorted = sortParticipants(rawParticipants, user?.id)
        setParticipants(sorted)

        const organizerIdValue = Number(data?.organizerId ?? 0)
        setOrganizerId(organizerIdValue || null)

        // 모임 목적 저장
        setMeetingPurpose(data?.purpose || 'DINING')

        // ⭐ 모임 상태를 부모 컴포넌트에 전달
        if (onStatusLoaded && data?.status) {
          onStatusLoaded(data.status)
        }
      })
      .catch((err) => {
        console.error('Meeting API Error:', err)
        setParticipants([])
      })
  }, [meetingUuid, user?.id, onStatusLoaded])

  /* ================= 추천장소 + 중간지점 통합 API ================= */

  useEffect(() => {
    if (!meetingUuid || !meetingPurpose) return

    const fetchPlacesAndMidpoint = async () => {
      setIsLoadingPlaces(true)

      try {
        const res = await axios.get(
          `${API_BASE_URL}/v1/meetings/${meetingUuid}/places?purpose=${meetingPurpose}&limit=6`,
          { withCredentials: true }
        )

        const data = res.data?.data
        const apiPlaces: unknown[] = Array.isArray(data?.places) ? data.places : []
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

  // 추천장소 구성 변경 감지용 시그니처
  const placeSignature = useMemo(() => {
    return recommendedPlaces
      .map(p => p.name)
      .sort()
      .join('|')
  }, [recommendedPlaces])

  const mapMarkers = middlePoint
    ? [{ lat: middlePoint.lat, lng: middlePoint.lng }]
    : [{ lat: 37.563617, lng: 126.997628 }]

useEffect(() => {
  if (!placeSignature) return;

  // 참여자, 모임장 가릴 것 없이 장소가 바뀌면 일단 상태를 바꿉니다.
  if (prevPlaceSignatureRef.current && prevPlaceSignatureRef.current !== placeSignature) {
    setIsNewPlaceAvailable(true);
  }

  prevPlaceSignatureRef.current = placeSignature;
}, [placeSignature]); // 👈 여기에 isHost가 없어야 일반 유저도 감지합니다.

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

     // 백엔드 호출: 기존 투표 삭제 + 새 투표 생성이 서버에서 한 번에 일어남
     await axios.post(
       `${API_BASE_URL}/v1/votes/meeting/${meetingUuid}`,
       { options },
       { withCredentials: true }
     )

     // ✅ 성공 시 투표 모달을 바로 엽니다.
     // 데이터 업데이트는 WebSocket 구독부(setIsNewPlaceAvailable(false))에서 처리됩니다.
     setShowVoteModal(true);
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
    if (!meetingUuid) return;

    const hasVote = Boolean(voteData?.options?.length);

    // 1. 투표 시작하기 또는 갱신 (모임장 전용)
    if (isHost && (!hasVote || isNewPlaceAvailable)) {
      await createVote();
      setIsNewPlaceAvailable(false);
      return;
    }

    // 2. 투표하기 (장소 변경 없을 때만 모달 오픈)
    if (hasVote) {
      // 혹시라도 일반 유저가 비활성화를 뚫고 눌렀을 경우를 대비해 한 번 더 체크
      if (!isHost && isNewPlaceAvailable) {
        alert("추천 장소가 갱신되었습니다. 모임장이 투표를 새로 만들 때까지 기다려주세요.");
        return;
      }
      setShowVoteModal(true);
    }
  };

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


  const hasVote = Boolean(voteData?.options?.length);
  let voteButtonLabel = '투표 대기 중';

    if (isCreatingVote) {
      voteButtonLabel = '생성 중...';
    }
    // 1. 투표가 아예 없는 완전 초기 상태 (모임장용)
    else if (isHost && !voteData?.options?.length) {
      voteButtonLabel = '투표 시작하기';
    }
    // 2. 투표가 있는데, 그 사이에 장소까지 바뀌었을 때
    else if (isHost && isNewPlaceAvailable) {
      voteButtonLabel = '새 추천 장소! 투표 갱신';
    }
    // 3. 투표가 있고 장소 변경도 없을 때 (또는 일반 참여자)
    else if (voteData?.options?.length) {
      voteButtonLabel = '투표하기';
    }
    const isVoteDisabled =
      isCreatingVote ||
      (!isHost && !hasVote) || // 투표가 없는데 일반 참여자일 때
      (!isHost && isNewPlaceAvailable); // ⭐ 장소가 바뀌었는데 일반 참여자일 때 (투표 방지)
    let confirmLabel = '추천 장소 확정'
    if (isConfirming) {
    confirmLabel = '확정 중...'
    } else if (!isHost) {
    confirmLabel = '모임장만 확정할 수 있습니다'
    }

  return (
    <div className="space-y-4">
      {/* ================= 지도 ================= */}
      <Card className="overflow-hidden border border-[var(--border)] bg-[var(--bg)]">
        <CardContent className="p-0">
          <div className="h-56">
            <KakaoMap markers={mapMarkers} level={5} />
          </div>
        </CardContent>
      </Card>

      {/* 투표 현황 배너 */}
      {voteData && totalVotes > 0 && (
        <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]">
                <TrendingUp className="h-5 w-5 text-[var(--primary-foreground)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text)]">투표 진행 중</h3>
                <p className="text-xs text-[var(--text-subtle)]">
                  총 {totalVotes}명이 투표했습니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 멤버 */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[var(--text)]">참여자</CardTitle>
        </CardHeader>
        <CardContent>
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
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-[var(--primary)] px-1.5 text-[9px] text-[var(--primary-foreground)]">
                        나
                      </span>
                    )}
                  </div>

                  <span className="mt-1 text-[10px] text-[var(--text)]">
                    {displayName(p.nickName) || '참여자'}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 추천 장소 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text)]">추천장소 선택</h2>
            <p className="text-xs text-[var(--text-subtle)]">
              중간지점 기준으로 추천된 장소입니다.
            </p>
          </div>
          <Button
            type="button"
            disabled={isVoteDisabled}
            onClick={handleVoteButtonClick}
            className="rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-40"
          >
            {voteButtonLabel}
          </Button>
        </div>

        {isLoadingPlaces ? (
          <div className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-soft)] py-10">
            <span className="text-sm text-[var(--text-subtle)]">추천 장소를 찾고 있어요...</span>
          </div>
        ) : (
          <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
            {recommendedPlaces.map((place) => {
              const Icon = place.icon
              const selected = selectedPlace === place.id
              const voteOption = placeVoteMap.get(place.id)
              const hasVotes = Boolean(voteOption && voteOption.voteCount > 0)
              const isTopChoice = Boolean(voteOption && voteOption.voteCount === maxVotes && maxVotes > 0)
              const votePercentage = totalVotes > 0 && voteOption
                ? (voteOption.voteCount / totalVotes) * 100
                : 0

              let cardClass =
                'flex w-full items-center gap-3 rounded-xl px-4 py-3 border-2 relative overflow-hidden'
              if (selected) {
                cardClass += ' border-[var(--primary)] bg-[var(--bg-soft)]'
              } else {
                cardClass += ' border-[var(--border)] bg-[var(--bg)]'
              }

              return (
                <button
                  key={place.id}
                  onClick={() => setSelectedPlace(place.id)}
                  className={cardClass}
                >
                  {hasVotes && (
                    <div
                      className="absolute left-0 top-0 h-full"
                      style={{
                        width: `${votePercentage}%`,
                        backgroundColor: 'var(--neutral-soft)',
                        opacity: 0.6,
                      }}
                    />
                  )}

                  <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--neutral-soft)]">
                    <Icon className="h-8 w-8 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1 text-left relative">
                    <p className="text-sm font-semibold text-[var(--text)]">{place.name}</p>
                    <p className="text-xs text-[var(--text-subtle)]">
                      {place.stationName} 도보 {place.walkingMinutes}분
                    </p>

                    {hasVotes && voteOption && (
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-[var(--primary)]" />
                          <span className="text-xs font-semibold text-[var(--primary)]">
                            {voteOption.voteCount}표
                          </span>
                        </div>
                        {isTopChoice && (
                          <span className="rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--primary-foreground)]">
                            1위
                          </span>
                        )}
                        <span className="text-[9px] text-[var(--text-subtle)]">
                          {votePercentage.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                  {selected && <CheckCircle className="h-5 w-5 text-[var(--primary)] relative" />}
                </button>
              )
            })}
          </div>
        )}
      </section>

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
                <p className="text-sm text-[var(--text-subtle)]">
                  총 {totalVotes}표 · {myVotedOptionId ? '투표 완료' : '투표해주세요'}
                </p>
              </div>

              <ScrollArea className="max-h-80 pr-1">
                <div className="space-y-2">
                  {voteData.options.map((option) => {
                    const place = recommendedPlaces.find(p => p.name === option.content)
                    const Icon = place?.icon || Coffee
                    const isMyVote = option.optionId === myVotedOptionId
                    const votePercentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0
                    const isTopChoice = option.voteCount === maxVotes && maxVotes > 0

                    let optionClass =
                      'relative w-full overflow-hidden rounded-xl border-2 p-3 text-left'
                    if (isMyVote) {
                      optionClass += ' border-[var(--primary)] bg-[var(--bg-soft)]'
                    } else {
                      optionClass += ' border-[var(--border)] bg-[var(--bg)]'
                    }

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
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: isMyVote
                                ? 'var(--primary)'
                                : 'var(--neutral-soft)',
                            }}
                          >
                            <Icon
                              className="h-6 w-6"
                              style={{
                                color: isMyVote
                                  ? 'var(--primary-foreground)'
                                  : 'var(--primary)',
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-[var(--text)]">
                                {option.content}
                              </p>
                              {isTopChoice && option.voteCount > 0 && (
                                <span className="rounded-full bg-[var(--primary)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--primary-foreground)]">
                                  1위
                                </span>
                              )}
                            </div>

                            {option.voters.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-semibold text-[var(--primary)]">
                                  {option.voteCount}표
                                </span>
                                <span className="text-xs text-[var(--text-subtle)]">·</span>
                                {option.voters.map((voter) => (
                                  <span
                                    key={voter.participantId}
                                    className="rounded-full bg-[var(--neutral-soft)] px-2 py-0.5 text-[9px] font-medium text-[var(--text)]"
                                  >
                                    {voter.nickname}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {isMyVote && (
                            <CheckCircle className="h-5 w-5 text-[var(--primary)]" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="space-y-2">
              {recommendedPlaces.map((place) => {
                const Icon = place.icon
                const selected = selectedPlace === place.id

                let optionClass =
                  'flex w-full items-center gap-3 rounded-xl px-4 py-3 border-2'
                if (selected) {
                  optionClass += ' border-[var(--primary)] bg-[var(--bg-soft)]'
                } else {
                  optionClass += ' border-[var(--border)] bg-[var(--bg)]'
                }

                return (
                  <button
                    key={`vote-${place.id}`}
                    onClick={() => {
                      setSelectedPlace(place.id)
                      setShowVoteModal(false)
                    }}
                    className={optionClass}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--neutral-soft)]">
                      <Icon className="h-8 w-8 text-[var(--primary)]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-[var(--text)]">{place.name}</p>
                      <p className="text-xs text-[var(--text-subtle)]">
                        {place.stationName} 도보 {place.walkingMinutes}분
                      </p>
                    </div>
                    {selected && (
                      <CheckCircle className="h-5 w-5 text-[var(--primary)]" />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </WireframeModal>

      {/* 확정 버튼 */}
      <Button
        disabled={!selectedPlace || isConfirming || !isHost}
        onClick={handleConfirmPlace}
        className="w-full rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)] py-4 text-base font-semibold disabled:opacity-40"
      >
        {confirmLabel}
      </Button>
    </div>
  )
}
