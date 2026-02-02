// component/meeting/Step6/CompleteSummaryDrawer.tsx
'use client'

import { useState, useRef } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import CompleteSummaryCard, { MeetingSummary, } from '@/components/meeting/Step6/CompleteSummaryCard'

interface Props {
  meeting: MeetingSummary
}

const MIN_BOTTOM = 80 // 하단 네비 가림 방지 (px)

export default function CompleteSummaryDrawer({ meeting }: Props) {
  // ✅ 상태는 반드시 컴포넌트 안
  const [bottom, setBottom] = useState<number>(MIN_BOTTOM)
  const startYRef = useRef(0)
  const startBottomRef = useRef(0)

  const onPointerDown = (e: React.PointerEvent) => {
    startYRef.current = e.clientY
    startBottomRef.current = bottom

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const onPointerMove = (e: PointerEvent) => {
    const deltaY = startYRef.current - e.clientY
    const nextBottom = startBottomRef.current + deltaY

    // 🔑 하한 clamp
    setBottom(Math.max(nextBottom, MIN_BOTTOM))
  }

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  return (
    <Drawer open modal={false}>
      <DrawerContent
        // ✅ 상태 기반 bottom
        style={{ bottom }}
        className="
        app-container 
          z-20
          rounded-t-3xl
          bg-[var(--bg)]
          mx-auto
          w-full
          max-w-[var(--app-max-width)]
        "
      >
        {/* 드래그 핸들 */}
        <div
          onPointerDown={onPointerDown}
          className="
            mx-auto
            mt-2
            mb-1
            h-1.5
            w-40
            rounded-full
            bg-[var(--border)]
            cursor-grab
            active:cursor-grabbing
            
          "
        />

        <DrawerHeader className="pb-2">
          <DrawerTitle className="sr-only">
            확정 장소 정보
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            모임의 확정된 장소, 주소, 연락처 및 카카오 공유 정보를 확인할 수 있습니다.
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto pb-[calc(24px+env(safe-area-inset-bottom))]">
          <CompleteSummaryCard meeting={meeting} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
