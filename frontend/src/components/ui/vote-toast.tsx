// src/components/ui/vote-toast.tsx
'use client'

import { Button } from '@/components/ui/button'

// 1/30[유리] - 투표 진행 안내 Toast UI (지도 위 클릭 트리거)
interface VoteToastProps {
  open: boolean
  onClick: () => void
}

export default function VoteToast({ open, onClick }: VoteToastProps) {
  if (!open) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-4">
      <div
        className="pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-xl border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 shadow-sm"
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[var(--danger)]">
            투표가 진행 중이에요
          </span>
          <span className="text-xs text-[var(--danger)]/80">
            눌러서 투표에 참여하세요
          </span>
        </div>

        <Button
          size="sm"
          onClick={onClick}
          className="bg-[var(--danger)] text-white hover:bg-[var(--danger)]"
        >
          투표하기
        </Button>
      </div>
    </div>
  )
}
