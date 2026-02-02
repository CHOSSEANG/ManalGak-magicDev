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
    // 🔑 상/하한 clamp
    const maxBottom = window.innerHeight - 100; // 100px은 상단 여백 예시입니다.
    setBottom(Math.min(Math.max(nextBottom, MIN_BOTTOM), maxBottom))
  }

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }


  return (
    <Drawer open modal={false}>
      <DrawerContent
    style={{ bottom }}
        className="
      app-container z-20
      left-0 right-0 translate-x-0
      border border-[var(--border)] bg-[var(--bg)]
      shadow-none
      p-0
      pointer-events-none
    "
  >
        {/* ✅ 실제 패널 (이것만 클릭/드래그/스크롤) */}
    <div
      className="
        pointer-events-auto
        app-container
        mx-auto
        w-full
        max-w-[var(--app-max-width)]
        rounded-t-3xl
        bg-transparent 
      "
    >
      {/* 드래그 핸들 */}
      <div
        onPointerDown={onPointerDown}
        className="
          mx-auto
          mb-0
          h-1.5
          w-40
          rounded-full
          bg-[var(--border)]
          cursor-grab
          active:cursor-grabbing
          touch-pan-y
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

        <div className="overflow-y-auto pb-[calc(0px+env(safe-area-inset-bottom))] touch-pan-y">
          <CompleteSummaryCard meeting={meeting} />
          </div>
          </div>
      </DrawerContent>
    </Drawer>
  )
}
