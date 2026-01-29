// src/components/ui/WireframeModal.tsx
'use client'

import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

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
  if (typeof window === 'undefined') return null

  return createPortal(
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        px-3
        bg-[var(--neutral-soft)]
      "
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <Card
        className="
          w-full max-w-md
          max-h-[85vh]
          bg-[var(--bg)]
          border border-[var(--border)]
          rounded-2xl
          shadow-lg
          flex flex-col
        "
      >
        {/* Header */}
        <CardHeader
          className="
            flex flex-row items-center justify-between
            px-5 py-4
            border-b border-[var(--border)]
            bg-[var(--bg)]
            sticky top-0 z-10
          "
        >
          <CardTitle className="text-base font-semibold text-[var(--text)]">
            {title}
          </CardTitle>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-full px-5 py-4 text-sm text-[var(--text)]">
            {children}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>,
    document.body
  )
}
