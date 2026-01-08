// src/components/meeting/StepCard.tsx

import type { ReactNode } from 'react'

interface StepCardProps {
  children: ReactNode
  className?: string
}

export default function StepCard({
  children,
  className = '',
}: StepCardProps) {
  // 와이어프레임 단계: 카드 컨테이너
  return (
    <div
      className={`rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] p-4 md:p-6 ${className}`}
    >
      {children}
    </div>
  )
}
