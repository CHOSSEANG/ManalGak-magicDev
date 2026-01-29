// src/components/ui/tooltip.tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * TooltipProvider
 * - 전역 툴팁 컨텍스트
 * - 기존 Radix Provider 그대로 유지
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * Tooltip
 * - Root 컴포넌트
 * - open / delay / controlled 상태 모두 기존과 동일
 */
const Tooltip = TooltipPrimitive.Root

/**
 * TooltipTrigger
 * - 툴팁을 트리거하는 요소
 * - button, span 등 그대로 사용 가능
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * TooltipContent
 * - 실제 툴팁 UI
 * - semantic color token 기반으로 스타일 재정의
 * - 애니메이션 / 위치 로직은 Radix 기본 유지
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          // ─────────────────────────────
          // Layout
          // ─────────────────────────────
          "z-50 max-w-[220px] rounded-lg px-3 py-1.5",

          // ─────────────────────────────
          // Color (semantic token only)
          // ─────────────────────────────
          "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",

          // ─────────────────────────────
          // Typography
          // ─────────────────────────────
          "text-xs leading-relaxed",

          // ─────────────────────────────
          // Motion (Radix data-state 유지)
          // ─────────────────────────────
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",

          className
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
})

TooltipContent.displayName = "TooltipContent"

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}
