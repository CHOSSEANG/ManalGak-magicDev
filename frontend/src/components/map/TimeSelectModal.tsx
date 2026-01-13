// @/src/components/map/TimeSelectModal.tsx
'use client'

import { useRef } from 'react'
import { Clock } from 'lucide-react'
import WireframeModal from '@/components/ui/WireframeModal'

interface TimeSelectModalProps {
  open: boolean
  value?: string
  onClose: () => void
  onConfirm: (time: string) => void
}

export default function TimeSelectModal({
  open,
  value,
  onClose,
  onConfirm,
}: TimeSelectModalProps) {
  const timeInputRef = useRef<HTMLInputElement | null>(null)

  const formatTime = (time?: string) => {
    if (!time) return '아직 선택되지 않음'

    const [hour, minute] = time.split(':').map(Number)
    const isAM = hour < 12
    const displayHour = hour % 12 === 0 ? 12 : hour % 12

    return `${isAM ? '오전' : '오후'} ${String(displayHour).padStart(
      2,
      '0'
    )}:${minute.toString().padStart(2, '0')}`
  }

  return (
    <WireframeModal open={open} title="모임 종료 시간 선택" onClose={onClose}>
      <div className="space-y-5">
        {/* 설명 */}
        <p className="text-xs text-[var(--wf-subtle)]">
          모임이 종료되는 예상 시간을 선택해 주세요.
        </p>

        {/* 현재 시간 + 시간 변경 (3:2) */}
        <div className="grid grid-cols-5 gap-3">
          {/* 현재 선택된 시간 (3) */}
          <div className="col-span-3 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-4">
            <p className="mb-1 text-xs text-[var(--wf-subtle)]">
              현재 선택된 시간
            </p>
            <p className="text-lg font-semibold">
              {formatTime(value)}
            </p>
          </div>

          {/* 시간 변경 버튼 (2) */}
          <div className="relative col-span-2">
            <button
              type="button"
              onClick={() => timeInputRef.current?.showPicker()}
              className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] text-sm font-medium"
            >
              <Clock className="h-7 w-7" />
              시간 변경
            </button>

            {/* 네이티브 time picker */}
            <input
              ref={timeInputRef}
              type="time"
              defaultValue={value}
              onChange={(e) => onConfirm(e.target.value)}
              className="absolute left-0 top-full mt-2 h-0 w-0 opacity-0"
            />
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] py-2 text-sm"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-[var(--wf-accent)] py-2 text-sm font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </WireframeModal>
  )
}
