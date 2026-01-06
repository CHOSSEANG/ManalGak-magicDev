'use client'

import type { ReactNode } from 'react'

interface WireframeModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export default function WireframeModal({
  open,
  title,
  children,
  onClose,
}: WireframeModalProps) {
  if (!open) return null

  // 와이어프레임 단계: 모달 뼈대
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--wf-overlay)] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] p-5 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--wf-border)] px-3 py-1 text-sm"
          >
            닫기
          </button>
        </div>
        <div className="space-y-3 text-sm text-[var(--wf-subtle)]">
          {children}
        </div>
      </div>
    </div>
  )
}
