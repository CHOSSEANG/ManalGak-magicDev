// src/components/ui/WireframeModal.tsx
'use client'

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface WireframeModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export default function WireframeModal({ open, title, children, onClose }: WireframeModalProps) {
  if (!open) return null
  if (typeof window === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-[var(--wf-overlay)] flex items-center justify-center px-3 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md max-h-[85vh] bg-[var(--wf-surface)] rounded-2xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--wf-border)] sticky top-0 bg-[var(--wf-surface)] z-10">
          <h2 className="text-base font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1 text-[var(--wf-subtle)] hover:bg-[var(--wf-muted)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 text-sm">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
