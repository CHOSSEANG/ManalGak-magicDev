// src/components/meeting/CompleteOptionLinks.tsx
'use client'

import Link from 'next/link'
import StepCard from '@/components/meeting/StepCard'

interface Props {
  meetingId: string
}

export default function CompleteOptionLinks({ meetingId }: Props) {
  return (
    <StepCard className="space-y-3">
      <p className="text-sm font-semibold">옵션 페이지 이동</p>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/meetings/${meetingId}/option-location`}
          className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-2 text-sm"
        >
          실시간 위치 공유
        </Link>

        <Link
          href={`/meetings/${meetingId}/option-fee`}
          className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-2 text-sm"
        >
          회비 관리
        </Link>

        <Link
          href="/my"
          className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-2 text-sm font-semibold"
        >
          내 모임으로 이동
        </Link>
      </div>
    </StepCard>
  )
}
