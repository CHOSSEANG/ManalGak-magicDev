// src/components/layout/StepNavigation.tsx

'use client'

import { useRouter } from 'next/navigation'
import BottomCTA from '@/components/layout/BottomCTA'

interface StepNavigationProps {
  prevHref?: string
  nextHref?: string
  prevLabel?: string
  nextLabel?: string
  split?: boolean
}

export default function StepNavigation({
  prevHref,
  nextHref,
  prevLabel = '이전',
  nextLabel = '다음',
  split = true,
}: StepNavigationProps) {
  const router = useRouter()

  // 와이어프레임 단계: 스텝 네비게이션
  return (
    <BottomCTA>
      <div
        className={`flex w-full items-center ${
          split && prevHref && nextHref ? 'gap-3' : 'justify-end'
        }`}
      >
        {prevHref ? (
          <button
            type="button"
            onClick={() => router.push(prevHref)}
            className={`${
              split && nextHref ? 'w-1/2' : ''
            } rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-6 py-3 text-sm`}
          >
            {prevLabel}
          </button>
        ) : null}
        {nextHref ? (
          <button
            type="button"
            onClick={() => router.push(nextHref)}
            className={`${
              split && prevHref ? 'w-1/2' : ''
            } rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold`}
          >
            {nextLabel}
          </button>
        ) : null}
      </div>
    </BottomCTA>
  )
}
