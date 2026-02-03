// src/components/meeting/Step3/VoteOrSelectDrawer.tsx
'use client'

import { useState, useRef } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { CheckCircle, Coffee } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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

const MIN_BOTTOM = 0 // 완전히 펼쳐진 상태
const MAX_BOTTOM = -300 // 접힌 상태 (원하면 조절)

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

// ✅ [여기] 드래그 상태 / ref
  const [bottom, setBottom] = useState<number>(MIN_BOTTOM)
  const startYRef = useRef(0)
  const startBottomRef = useRef(0)

  const onPointerDown = (e: React.PointerEvent) => {
    startYRef.current = e.clientY
    startBottomRef.current = bottom

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const onPointerMove = (e: PointerEvent) => {
    const deltaY = startYRef.current - e.clientY
    const nextBottom = startBottomRef.current + deltaY

    const maxBottom = window.innerHeight - 100
    setBottom(Math.min(Math.max(nextBottom, MIN_BOTTOM), maxBottom))
  }

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }



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

    if (option) {
      onVote(option.optionId)
    }
  }

 


  
  return (
    <Drawer open modal={false}>
       <DrawerContent
    style={{ bottom }}
        className="
      app-container z-20
      left-0 right-0 translate-x-0
      border border-[var(--border)] bg-[var(--bg)]
      shadow-none
      p-0
      pointer-events-none
    "
  >
        {/* 드래그 핸들 */}
      <div
        onPointerDown={onPointerDown}
        className="
          mx-auto
          mb-0
          h-1.5
          w-40
          rounded-full
          bg-[var(--border)]
          cursor-grab
          active:cursor-grabbing
          touch-pan-y
        "
      />
        {/* ================= Header ================= */}
        <DrawerHeader className="pb-3">
          <DrawerTitle className="text-left text-base font-semibold text-[var(--text)]">
            {isHost ? '추천장소 선택' : '추천장소 투표'}
          </DrawerTitle>
        </DrawerHeader>

        {/* ================= Summary ================= */}
        {voteData && (
          <div className="px-4 pb-2 text-center">
            <p className="text-sm text-[var(--text-subtle)]">
              총 {totalVotes}표 ·{' '}
              {myVotedOptionId ? '투표 완료' : '투표해주세요'}
            </p>
          </div>
        )}

        {/* ================= List ================= */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
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
                  onClick={() => place && onSelectPlace(place.id)}
                  className={[
                    'relative w-full overflow-hidden rounded-lg border p-3 text-left',
                    isSelected
                      ? 'border-[var(--danger)]'
                      : 'border-[var(--border)]',
                  ].join(' ')}
                >
                  {/* 투표 비율 배경 */}
                  {totalVotes > 0 && (
                    <div
                      className="absolute left-0 top-0 h-full bg-[var(--neutral-soft)] opacity-50"
                      style={{
                        width: `${(option.voteCount / totalVotes) * 100}%`,
                      }}
                    />
                  )}

                  <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--neutral-soft)]">
                      <Icon className="h-6 w-6 text-[var(--danger)]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[var(--text)]">
                          {option.content}
                        </p>
                        {isTopChoice && (
                          <span className="rounded-full bg-[var(--danger)] px-1.5 py-0.5 text-[9px] font-semibold text-white">
                            1위
                          </span>
                        )}
                      </div>

                      {option.voteCount > 0 && (
                        <p className="mt-0.5 text-xs text-[var(--text-subtle)]">
                          {option.voteCount}표 ·{' '}
                          {option.voters
                            .map((v) => v.nickname)
                            .join(', ')}
                        </p>
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
        </ScrollArea>

        {/* ================= Footer ================= */}
        <DrawerFooter className="border-t border-[var(--border)] bg-[var(--bg)]">
          <Button
            disabled={
              !selectedPlaceId ||
              (isHost ? isConfirming : isVoting)
            }
            onClick={handlePrimaryAction}
            className="h-12 w-full bg-[var(--danger)] text-white disabled:opacity-40"
          >
            {isHost
              ? isConfirming
                ? '확정 중...'
                : '확정하기'
              : isVoting
                ? '투표 중...'
                : '투표하기'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
