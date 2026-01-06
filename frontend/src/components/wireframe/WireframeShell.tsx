import type { ReactNode } from 'react'

interface WireframeShellProps {
  children: ReactNode
  className?: string
}

export default function WireframeShell({
  children,
  className = '',
}: WireframeShellProps) {
  // 와이어프레임 단계: 화면 뼈대 전용 래퍼
  return (
    <div
      className={`min-h-screen bg-[var(--wf-bg)] text-[var(--wf-text)] ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 lg:px-10">
        {children}
      </div>
    </div>
  )
}
