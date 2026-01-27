// src/components/layout/StepNavigation.tsx

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface StepNavigationProps {
  prevHref?: string
  nextHref?: string
  prevLabel?: string
  nextLabel?: string
  split?: boolean
  onNext?: () => Promise<string | void> | string | void
}

export default function StepNavigation({
  prevHref,
  nextHref,
  prevLabel = '이전',
  nextLabel = '다음',
  split = true,
  onNext,
}: StepNavigationProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (loading) return

    try {
      setLoading(true)

      if (onNext) {
        // onNext가 있으면 실행
        const result = await onNext()

        // 반환값이 문자열이면 그 URL로 이동
        if (typeof result === 'string') {
          router.push(result)
          return  // ⭐ 여기서 종료
        }
      }

      // onNext가 없거나 반환값이 없으면 nextHref로 이동
      if (nextHref && nextHref !== '#') {
        router.push(nextHref)
      }
    } catch  {
    console.warn("필수 정보가 없습니다.");
      // 에러 발생 시 페이지 이동하지 않음
    } finally {
      setLoading(false)
    }
  }

  return (
      <div
        className={`flex w-full items-center ${
          split && prevHref && nextHref ? 'gap-3' : 'justify-end'
        }`}
      >
        {prevHref ? (
          <button
            type="button"
            onClick={() => router.push(prevHref)}
            disabled={loading}
            className={`${
              split && nextHref ? 'w-1/2' : ''
            } relative flex items-center justify-center rounded-2xl border border-[var(--wf-border)]
              bg-[var(--wf-muted)] px-6 py-3 text-sm hover:bg-[var(--wf-surface)]
              disabled:opacity-50`}
          >
            <ArrowLeft className="absolute left-3 h-6 w-6" /> {prevLabel}
          </button>
        ) : null}
        {nextHref || onNext ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className={`${
              split && prevHref ? 'w-1/2' : ''
            } relative flex items-center justify-center
              rounded-2xl border border-[var(--wf-border)]
              bg-[var(--wf-highlight)] px-6 py-3
              text-sm font-semibold hover:bg-[var(--wf-accent)]
              disabled:opacity-50`}
          >
            {loading ? '처리중...' : nextLabel}<ArrowRight className="absolute right-3 h-6 w-6"/>
          </button>
        ) : null}
      </div>
  )
}