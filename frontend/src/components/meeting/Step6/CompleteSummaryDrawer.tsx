'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import CompleteSummaryCard, {
  MeetingSummary,
} from '@/components/meeting/Step6/CompleteSummaryCard'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface Props {
  meeting: MeetingSummary
}

export default function CompleteSummaryDrawer({ meeting }: Props) {
  /* ---------- Drawer 열림/닫힘 ---------- */
  const OPEN_BOTTOM = 0
  const COLLAPSED_BOTTOM = 'var(--bottom-nav-height)'

  const [bottom, setBottom] = useState<string | number>(COLLAPSED_BOTTOM)
  const isOpen = bottom === OPEN_BOTTOM

  const toggleDrawer = () => {
    setBottom(isOpen ? COLLAPSED_BOTTOM : OPEN_BOTTOM)
  }

  return (
    <>
      {/* ================= 열기 버튼 ================= */}
      {!isOpen && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30">
          <Button
            onClick={toggleDrawer}
            className="
              flex items-center gap-1
              rounded-xl
              border border-[var(--danger-soft)]
              bg-[var(--danger-soft)]
              text-[var(--text)]
            "
          >
            확정장소 정보확인 <ChevronUp className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* ================= Drawer ================= */}
      <Drawer open>
        {/* ✅ 접근성 필수 요소 — 항상 존재 */}
          <DrawerHeader className="sr-only">
            <DrawerTitle>확정 장소 정보</DrawerTitle>
            <DrawerDescription>
              모임의 확정된 장소 정보를 확인할 수 있습니다.
            </DrawerDescription>
          </DrawerHeader>
        
  <DrawerContent
    style={{ bottom }}
    className="
      z-20
      border border-[var(--border)]
      bg-[var(--bg)]
      px-4
      shadow-none

      w-full
      md:w-[500px]
      mx-auto

      max-h-[85vh]

      transition-[bottom]
      duration-300
      ease-out
    "
  >
    {/* ===== 열기 / 닫기 버튼 (항상 보임) ===== */}
    <div className="flex justify-center py-2">
      <Button
        onClick={toggleDrawer}
        variant="ghost"
        size="sm"
        className="
          flex items-center gap-1
          text-base
          rounded-xl
          border border-[var(--danger-soft)]
          bg-[var(--danger-soft)]
          text-[var(--text)]
        "
      >
        {isOpen ? (
          <>
            창 닫기 <ChevronDown className="h-5 w-5" />
          </>
        ) : (
          <>
            확정장소 정보확인 <ChevronUp className="h-5 w-5" />
          </>
        )}
      </Button>
    </div>

    {/* ===== 드로워 열기/닫기 버튼 오류 수정 ===== */}
    {isOpen && (
      <>
        <DrawerHeader className="pb-2">
          <DrawerTitle className="sr-only">
            확정 장소 정보
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            모임의 확정된 장소 정보를 확인할 수 있습니다.
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          <CompleteSummaryCard meeting={meeting} />
        </div>
      </>
    )}
  </DrawerContent>
      </Drawer>
    </>
  )
}
