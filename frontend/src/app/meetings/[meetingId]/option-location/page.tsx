// src/app/meetings/[meetingId]/option-location/page.tsx

import Link from 'next/link'
import StepCard from '@/components/meeting/StepCard'

export default function OptionRealtimePage() {
  // 와이어프레임 단계: 옵션 1
  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">옵션 1. 실시간 위치 공유</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          토글 UI만 제공 (추적 기능 없음)
        </p>
      </div>

      <StepCard className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
          <span className="text-sm font-semibold">실시간 위치 공유</span>
          <label className="flex items-center gap-2 text-xs text-[var(--wf-subtle)]">
            <input type="checkbox" className="h-4 w-4" />
            OFF
          </label>
        </div>
        <div className="h-48 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
      </StepCard>

      <Link
        href="/meetings/meeting-001/complete"
        className="inline-flex items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-3 text-sm font-semibold"
      >
        완료 화면으로
      </Link>
    </main>
  )
}
