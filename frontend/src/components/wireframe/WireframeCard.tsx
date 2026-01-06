import type { ReactNode } from 'react'

interface WireframeCardProps {
  children: ReactNode
  className?: string
}

export default function WireframeCard({
  children,
  className = '',
}: WireframeCardProps) {
  // 와이어프레임 단계: 카드 컨테이너
  return (
    <div
      className={`rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] p-4 md:p-6 ${className}`}
    >
      {children}
    </div>
  )
}
