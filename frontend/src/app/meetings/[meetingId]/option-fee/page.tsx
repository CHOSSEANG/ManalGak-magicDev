// src/app/meetings/[meetingId]/option-fee/page.tsx

import Link from 'next/link'
import StepCard from '@/components/meeting/StepCard'

export default function OptionPaymentPage() {
  // 와이어프레임 단계: 옵션 2
  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">옵션 2. 회비 관리</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          회비 금액 입력 및 카카오페이 링크 placeholder
        </p>
      </div>

      <StepCard className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="fee">
            회비 금액
          </label>
          <input
            id="fee"
            type="text"
            placeholder="예: 15,000"
            className="w-full rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-3 text-sm"
          />
        </div>
        <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
          카카오페이 링크 placeholder
        </div>
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
