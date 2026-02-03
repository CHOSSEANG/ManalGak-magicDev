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
import {
  CheckCircle,
  Coffee,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'

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


  const totalVotes =
    voteData?.options.reduce((sum, opt) => sum + opt.voteCount, 0) || 0

  const maxVotes =
    voteData && voteData.options.length > 0
      ? Math.max(...voteData.options.map((o) => o.voteCount))
      : 0

  const handlePrimaryAction = () => {
    if (!selectedPlaceId || !voteData) return

    if (isHost) {
      onConfirm(selectedPlaceId)
      return
    }

    const selectedPlace = places.find((p) => p.id === selectedPlaceId)
    if (!selectedPlace) return

    const option = voteData.options.find(
      (o) => o.content === selectedPlace.name
    )

    if (option) onVote(option.optionId)
  }

  return (
    <>
      {/* ================= Drawer ================= */}
      <Drawer open modal={false}>
        <DrawerContent
          style={{ bottom }}
          className="
            app-container z-20
            left-0 right-0 translate-x-0
            h-[85]
            max-h-[85vh]
            transition-[bottom]
            duration-300
            ease-out
            border border-[var(--border)] bg-[var(--bg)]
            p-0
            shadow-none
            pointer-events-none
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
                  {isHost ? '선택하고 [확정] 버튼을 눌러주세요.' : '추천장소를 투표하면 모임장에게 전달됩니다.'}
                </DrawerTitle>
              </DrawerHeader>

              {/* ================= Summary ================= */}
              {voteData && (
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
                <div className="grid grid-cols-2 gap-2">
                  {voteData?.options.map((option) => {
                    const place = places.find(
                      (p) => p.name === option.content
                    )
                    const Icon = place?.icon || Coffee

                    const isSelected = selectedPlaceId === place?.id
                    const isMyVote = option.optionId === myVotedOptionId
                    const isTopChoice =
                      option.voteCount === maxVotes && maxVotes > 0

                    return (
                      <button
                        key={option.optionId}
                        type="button"
                        onClick={() => {
                          if (!place) return
                          onSelectPlace(place.id) // ✅ 여기까지만
                        }}
                        className={[
                          'relative rounded-lg border p-3 text-left',
                          isSelected
                            ? 'border-[var(--danger)]'
                            : 'border-[var(--border)]',
                        ].join(' ')}
                      >
                        {/* 투표 비율 배경 */}
                        {totalVotes > 0 && (
                          <div
                            className="absolute left-0 top-0 h-full bg-[var(--neutral-soft)] opacity-40"
                            style={{
                              width: `${
                                (option.voteCount / totalVotes) * 100
                              }%`,
                            }}
                          />
                        )}

                        <div className="relative flex items-start gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--neutral-soft)]">
                            <Icon className="h-6 w-6 text-[var(--danger)]" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <p className="text-sm font-semibold">
                                {option.content}
                              </p>
                              {isTopChoice && (
                                <span className="rounded-full bg-[var(--danger)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                                  1위
                                </span>
                              )}
                            </div>

                            {/* 투표 수 */}
                            <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                              {option.voteCount}표
                            </p>

                            {/* 투표자 딱지 */}
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

                          {/* 선택 아이콘 */}
                          {isMyVote && (
                            <CheckCircle className="h-5 w-5 text-[var(--danger)]" />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* ================= Footer ================= */}
              <DrawerFooter
                className="
                  bg-[var(--bg)]
                  pb-[var(--bottom-nav-height)]
                "
              >
                <Button
                  disabled={
                    !selectedPlaceId ||
                    (isHost ? isConfirming : isVoting)
                  }
                  onClick={handlePrimaryAction}
                  className="h-12 w-full rounded-xl bg-[var(--danger)] text-white"
                >
                  {isHost
                    ? isConfirming
                      ? '확정 중...'
                      : '추천장소 확정'
                    : isVoting
                      ? '투표 중...'
                      : '추천장소 투표 완료'}
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>

      {/* ================= 장소 정보 모달 ================= */}
      {/* <Dialog open={Boolean(infoPlaceId)} onOpenChange={() => setInfoPlaceId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{infoPlace?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--text-subtle)]">
            선택한 추천 장소에 대한 상세 정보를 여기에 표시하면 됩니다.
          </p>
        </DialogContent>
      </Dialog> */}
    </>
  )
}
