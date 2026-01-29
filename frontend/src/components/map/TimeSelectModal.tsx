// @/src/components/map/TimeSelectModal.tsx
'use client'

import { useRef, type ReactNode } from 'react'
import { Clock } from 'lucide-react'
import WireframeModal from '@/components/ui/WireframeModal'

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

  let currentTimeNode: ReactNode = null
  if (value) {
    currentTimeNode = (
      <p className="text-lg font-semibold text-[var(--text)]">
        {formatTime(value)}
      </p>
    )
  } else {
    currentTimeNode = (
      <p className="text-sm text-[var(--text-subtle)]">{formatTime(value)}</p>
    )
  }

  return (
    <WireframeModal open={open} title="모임 종료 시간 선택" onClose={onClose}>
      <div className="space-y-4">
        <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-[var(--text)]">
              종료 시간 선택
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-[var(--text-subtle)]">
              모임이 종료되는 예상 시간을 선택해 주세요.
            </p>

            <div className="grid grid-cols-5 gap-3">
              <div className="col-span-3 rounded-2xl border border-[var(--border)] bg-[var(--neutral-soft)] px-4 py-4">
                <p className="mb-1 text-xs text-[var(--text-subtle)]">
                  현재 선택된 시간
                </p>
                {currentTimeNode}
              </div>

              <div className="relative col-span-2">
                <Button
                  type="button"
                  onClick={() => timeInputRef.current?.showPicker()}
                  className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] text-[var(--primary-foreground)]"
                >
                  <Clock className="h-7 w-7" />
                  시간 변경
                </Button>

                <input
                  ref={timeInputRef}
                  type="time"
                  defaultValue={value}
                  onChange={(e) => onConfirm(e.target.value)}
                  className="absolute left-0 top-full mt-2 h-0 w-0 opacity-0"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                확인
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </WireframeModal>
  )
}
