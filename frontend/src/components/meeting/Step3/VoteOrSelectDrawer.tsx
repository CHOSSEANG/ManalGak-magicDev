// src/components/meeting/Step3/VoteOrSelectDrawer.tsx
'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import WireframeModal from '@/components/ui/WireframeModal'
import {
  CheckCircle,
  Coffee,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { RouteResponse } from '@/types/route'

/* ================= 타입 ================= */

export interface VoteOption {
  optionId: number
  content: string
  voteCount: number
  voters: Array<{
    participantId: number
    nickname: string
  }>
}

export interface VoteData {
  voteId: number
  options: VoteOption[]
}

export interface RecommendedPlace {
  id: string
  name: string
  icon: LucideIcon
  stationName?: string
  walkingMinutes?: number
}

interface ParticipantSummary {
  nickName?: string
  type?: 'PUBLIC' | 'CAR' | 'WALK'
}

interface VoteOrSelectDrawerProps {
  places: RecommendedPlace[]
  voteData?: VoteData | null

  selectedPlaceId?: string | null
  onSelectPlace: (placeId: string) => void

  isHost: boolean
  myVotedOptionId?: number | null

  onVote: (optionId: number) => void
  onConfirm: (placeId: string) => void

  isVoting?: boolean
  isConfirming?: boolean

  routeCache?: Record<string, RouteResponse>
  loadingRoutes?: Record<string, boolean>
  myParticipant?: ParticipantSummary
  isCreatingVote?: boolean
  isNewPlaceAvailable?: boolean
  onCreateVote?: () => void
  isConfirmed?: boolean
  confirmedPlace?: RecommendedPlace | null
  onGoComplete?: () => void
}




/* ================= 컴포넌트 ================= */

export default function VoteOrSelectDrawer({
  places,
  voteData,
  selectedPlaceId,
  onSelectPlace,
  isHost,
  myVotedOptionId,
  onVote,
  onConfirm,
  isVoting = false,
  isConfirming = false,
  routeCache,
  loadingRoutes,
  myParticipant,
  isCreatingVote = false,
  isNewPlaceAvailable = false,
  onCreateVote,
  isConfirmed = false,
  confirmedPlace,
  onGoComplete,
}: VoteOrSelectDrawerProps) {
  /* ---------- Drawer 열림/닫힘 ---------- */

  // ✅ ②번: 여기 (상태 선언)
  const OPEN_BOTTOM = 0
  const COLLAPSED_BOTTOM = 'var(--bottom-nav-height)'

  const [bottom, setBottom] = useState<string | number>(OPEN_BOTTOM)
  const isOpen = bottom === OPEN_BOTTOM


  const toggleDrawer = () => {
    setBottom(isOpen ? COLLAPSED_BOTTOM : OPEN_BOTTOM)
  }


  // /* ---------- 장소 정보 모달 ---------- */
  // const [infoPlaceId, setInfoPlaceId] = useState<string | null>(null)
  // const infoPlace = places.find((p) => p.id === infoPlaceId)


  const hasVote = Boolean(voteData?.options?.length)
  const [showVoteModal, setShowVoteModal] = useState(false)

  const totalVotes =
    voteData?.options.reduce((sum, opt) => sum + opt.voteCount, 0) || 0

  const maxVotes =
    voteData && voteData.options.length > 0
      ? Math.max(...voteData.options.map((o) => o.voteCount))
      : 0

  let voteButtonLabel = '투표 대기 중'
  if (isCreatingVote) voteButtonLabel = '생성 중...'
  else if (isHost && !hasVote) voteButtonLabel = '투표 시작하기'
  else if (isHost && isNewPlaceAvailable) voteButtonLabel = '새 추천 장소! 투표 갱신'
  else if (hasVote) voteButtonLabel = '투표하기'

  const isVoteDisabled =
    isCreatingVote || places.length === 0 || (!isHost && !hasVote) || isConfirmed

  const handleVoteButtonClick = () => {
    if (isConfirmed) return
    if (isHost && (!hasVote || isNewPlaceAvailable)) {
      onCreateVote?.()
      return
    }
    if (hasVote) {
      setShowVoteModal(true)
    }
  }

  const myParticipantName = myParticipant?.nickName
  const myTransportLabel =
    myParticipant?.type === 'CAR'
      ? '자동차'
      : myParticipant?.type === 'WALK'
        ? '도보'
        : '대중교통'

  const getMyTravelInfo = (routeData?: RouteResponse) => {
    if (!routeData) {
      return {
        myTravelTime: null as number | null,
        avgTravelTime: null as number | null,
      }
    }

    const avgTravelTime = routeData.statistics?.averageTravelTime ?? null
    if (!myParticipantName) {
      return { myTravelTime: null as number | null, avgTravelTime }
    }

    let myTravelTime: number | null = null

    if (myParticipant?.type === 'CAR') {
      const myCarRoute = routeData.carRoutes?.find(
        (route) => route.participantName === myParticipantName
      )
      if (myCarRoute) myTravelTime = myCarRoute.travelTime
    } else {
      const myRoute = routeData.routes?.find(
        (route) => route.participantName === myParticipantName
      )
      if (myRoute) myTravelTime = myRoute.travelTime
    }

    if (myTravelTime === null) {
      const fallbackRoute = routeData.routes?.find(
        (route) => route.participantName === myParticipantName
      )
      if (fallbackRoute) myTravelTime = fallbackRoute.travelTime
    }

    if (myTravelTime === null) {
      const fallbackCarRoute = routeData.carRoutes?.find(
        (route) => route.participantName === myParticipantName
      )
      if (fallbackCarRoute) myTravelTime = fallbackCarRoute.travelTime
    }

    return { myTravelTime, avgTravelTime }
  }

  return (
    <>
      {/* ================= Drawer ================= */}
      <Drawer open modal={false} >
        <DrawerContent
          style={{ bottom }}
          className="
            z-20
            border border-[var(--border)] bg-[var(--bg)]
            px-0 shadow-none transition-[bottom] duration-300 ease-out

            /* ✅ 모바일: 전체폭 (좌우 로딩 이슈 방지) */
            !left-0 !right-0 !translate-x-0

            /* ✅ 태블릿 이상: 400px 가운데 고정 */
            md:!left-1/2 md:!right-auto md:!-translate-x-1/2 md:w-[900px]

            max-h-[85vh]
            pointer-events-auto
            
            ">
          {/* ===== 열기 / 닫기 버튼 ===== */}
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDrawer}
              className="
                flex items-center gap-1
                text-base
                rounded-xl
                border border-[var(--danger-soft)]
                bg-[var(--danger-soft)]
                text-[var(--text)]
              "
            >
              {isOpen ? (
                <>
                  창 닫기 <ChevronDown className="h-6 w-5" />
                </>
              ) : (
                <>
                  추천장소 선택하기 <ChevronUp className="h-6 w-5" />
                </>
              )}
            </Button>
          </div>

          {isOpen && (
            <>
              {/* ================= Header ================= */}
              <DrawerHeader className="pb-2">
                <DrawerTitle className="text-center text-base font-semibold">
                  {isConfirmed
                    ? '장소가 이미 확정되었습니다.'
                    : isHost
                      ? '선택하고 [확정] 버튼을 눌러주세요.'
                      : '추천장소를 투표하면 모임장에게 전달됩니다.'}
                </DrawerTitle>
              </DrawerHeader>

              {/* ================= Summary ================= */}
              {hasVote && !isConfirmed && (
                <div className="px-4 pb-2 text-center">
                  <p className="text-sm text-[var(--text-subtle)]">
                    총 {totalVotes}표 ·{' '}
                    {myVotedOptionId ? '추천장소 투표 완료' : '추천장소를 선택해주세요'}
                  </p>
                </div>
              )}

              {/* ================= List ================= */}
              <ScrollArea
                className="
                  px-4
                  overflow-y-auto
                  max-h-[calc(85vh-var(--bottom-nav-height)-120px)]
                "
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {isConfirmed && confirmedPlace ? (
                    (() => {
                      const place = confirmedPlace
                      const Icon = place.icon || Coffee
                      const isSelected = selectedPlaceId === place.id
                      const routeData = routeCache?.[place.id]
                      const isLoadingRoute = Boolean(loadingRoutes?.[place.id])
                      const { myTravelTime, avgTravelTime } = getMyTravelInfo(
                        routeData
                      )

                      return (
                        <button
                          key={place.id}
                          type="button"
                          onClick={() => onSelectPlace(place.id)}
                          className={[
                            'relative rounded-lg border p-3 text-left',
                            isSelected
                              ? 'border-[var(--danger)]'
                              : 'border-[var(--border)]',
                          ].join(' ')}
                        >
                          <div className="relative flex items-start gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--neutral-soft)]">
                              <Icon className="h-6 w-6 text-[var(--danger)]" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <p className="text-sm font-semibold">
                                  {place.name}
                                </p>
                                <span className="rounded-full bg-[var(--success-soft)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--success)]">
                                  확정됨
                                </span>
                              </div>

                              {(place.stationName ||
                                place.walkingMinutes != null) && (
                                <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                                  {place.stationName ?? '중간지점'} · 도보{' '}
                                  {place.walkingMinutes ?? 0}분
                                </p>
                              )}

                              {isLoadingRoute ? (
                                <p className="mt-1 text-xs text-[var(--text-subtle)]">
                                  이동시간 조회 중...
                                </p>
                              ) : myTravelTime !== null ? (
                                <div className="mt-1 flex items-center gap-1 text-xs text-[var(--danger)]">
                                  나 {myTransportLabel} {myTravelTime}분
                                  {avgTravelTime &&
                                    avgTravelTime !== myTravelTime && (
                                      <span className="ml-1 text-[var(--text-subtle)]">
                                        (평균 {avgTravelTime}분)
                                      </span>
                                    )}
                                </div>
                              ) : avgTravelTime ? (
                                <div className="mt-1 text-xs text-[var(--danger)]">
                                  평균 {avgTravelTime}분
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      )
                    })()
                  ) : (
                    places.map((place) => {
                      const Icon = place.icon || Coffee
                      const isSelected = selectedPlaceId === place.id
                      const routeData = routeCache?.[place.id]
                      const isLoadingRoute = Boolean(loadingRoutes?.[place.id])
                      const { myTravelTime, avgTravelTime } = getMyTravelInfo(
                        routeData
                      )
                      const matchingVote = hasVote
                        ? voteData?.options.find((o) => o.content === place.name)
                        : null

                      return (
                        <button
                          key={place.id}
                          type="button"
                          onClick={() => onSelectPlace(place.id)}
                          className={[
                            'relative rounded-lg border p-3 text-left',
                            isSelected
                              ? 'border-[var(--danger)]'
                              : 'border-[var(--border)]',
                          ].join(' ')}
                        >
                          <div className="relative flex items-start gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--neutral-soft)]">
                              <Icon className="h-6 w-6 text-[var(--danger)]" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <p className="text-sm font-semibold">
                                  {place.name}
                                </p>
                                {matchingVote && (
                                  <span className="rounded-full bg-[var(--danger-soft)] px-1.5 py-0.5 text-[9px] font-semibold text-[var(--danger)]">
                                    {matchingVote.voteCount}표
                                  </span>
                                )}
                              </div>

                              {(place.stationName ||
                                place.walkingMinutes != null) && (
                                <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                                  {place.stationName ?? '중간지점'} · 도보{' '}
                                  {place.walkingMinutes ?? 0}분
                                </p>
                              )}

                              {isLoadingRoute ? (
                                <p className="mt-1 text-xs text-[var(--text-subtle)]">
                                  이동시간 조회 중...
                                </p>
                              ) : myTravelTime !== null ? (
                                <div className="mt-1 flex items-center gap-1 text-xs text-[var(--danger)]">
                                  나 {myTransportLabel} {myTravelTime}분
                                  {avgTravelTime &&
                                    avgTravelTime !== myTravelTime && (
                                      <span className="ml-1 text-[var(--text-subtle)]">
                                        (평균 {avgTravelTime}분)
                                      </span>
                                    )}
                                </div>
                              ) : avgTravelTime ? (
                                <div className="mt-1 text-xs text-[var(--danger)]">
                                  평균 {avgTravelTime}분
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              </ScrollArea>

              {/* ================= Footer ================= */}
              <DrawerFooter
                className="
                  bg-[var(--bg)]
                  pb-[var(--bottom-nav-height)]
                "
              >
                {isConfirmed ? (
                  <Button
                    onClick={onGoComplete}
                    disabled={!onGoComplete}
                    className="h-12 w-full rounded-xl bg-[var(--danger)] text-white"
                  >
                    완료 페이지로 이동
                  </Button>
                ) : (
                  <>
                    <Button
                      disabled={isVoteDisabled || isVoting}
                      onClick={handleVoteButtonClick}
                      className="h-12 w-full rounded-xl bg-[var(--danger)] text-white"
                    >
                      {voteButtonLabel}
                    </Button>

                    {isHost && hasVote && (
                      <Button
                        disabled={!selectedPlaceId || isConfirming}
                        onClick={() =>
                          selectedPlaceId && onConfirm(selectedPlaceId)
                        }
                        className="h-12 w-full rounded-xl border-2 border-[var(--danger)] bg-transparent text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white"
                      >
                        {isConfirming ? '확정 중...' : '추천장소 확정'}
                      </Button>
                    )}
                  </>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* ================= 투표 모달 ================= */}
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

              <div className="space-y-2">
                {voteData.options.map((option) => {
                  const place = places.find(
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

                  return (
                    <button
                      key={option.optionId}
                      onClick={() => onVote(option.optionId)}
                      className={[
                        'relative w-full overflow-hidden rounded-lg border p-3 text-left',
                        isMyVote
                          ? 'border-[var(--danger)]'
                          : 'border-[var(--border)]',
                      ].join(' ')}
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
                          <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                            {option.voteCount}표
                          </p>
                          {option.voters.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {option.voters.map((v) => (
                                <span
                                  key={v.participantId}
                                  className="rounded-full bg-[var(--neutral-soft)] px-1.5 py-0.5 text-[10px]"
                                >
                                  {v.nickname}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {isMyVote && (
                          <CheckCircle className="h-5 w-5 text-[var(--danger)]" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          ) : null}
        </div>
      </WireframeModal>
    </>
  )
}
