import type { ReactNode } from 'react'
import Link from 'next/link'

interface WireframeHeaderProps {
  title: string
  backHref?: string
  rightSlot?: ReactNode
}

export default function WireframeHeader({
  title,
  backHref,
  rightSlot,
}: WireframeHeaderProps) {
  // 와이어프레임 단계: 헤더 뼈대
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--wf-border)] bg-[var(--wf-surface)] text-sm"
          >
            &lt;
          </Link>
        ) : null}
        <div>
          <p className="text-sm text-[var(--wf-subtle)]">wireframe-first</p>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </div>
      {rightSlot ? (
        <div className="flex items-center gap-3">{rightSlot}</div>
      ) : null}
    </header>
  )
}
