// component/meetin/Step6/CompleteSummaryDrawer.tsx
'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'

import CompleteSummaryCard, {
  MeetingSummary,
} from '@/components/meeting/Step6/CompleteSummaryCard'

interface Props {
  meeting: MeetingSummary
}

export default function CompleteSummaryDrawer({
  meeting,
}: Props): JSX.Element {
  // 하단 네비게이션과 겹치지 않도록 하는 레이아웃 상수 (기존 값 유지)
  const BOTTOM_NAV_HEIGHT = 72
  const DRAWER_HANDLE_HEIGHT = 15

  return (
    <Drawer open>
      <DrawerContent
        style={{
          bottom: `${BOTTOM_NAV_HEIGHT - DRAWER_HANDLE_HEIGHT}px`,
        }}
        className="z-30 rounded-t-3xl border border-[var(--border)] bg-[var(--bg)]"
      >
        {/* Header */}
        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-left text-base font-semibold text-[var(--text)]">
            확정 장소 정보
          </DrawerTitle>

          {/* 접근성용 설명 (시각적 노출 없음) */}
          <DrawerDescription className="sr-only">
            모임의 확정된 장소, 주소, 연락처 및 공유 정보를 확인할 수 있습니다.
          </DrawerDescription>
        </DrawerHeader>

        {/* Content */}
        <ScrollArea className="max-h-[60vh] px-4 pb-6">
          <CompleteSummaryCard meeting={meeting} />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
