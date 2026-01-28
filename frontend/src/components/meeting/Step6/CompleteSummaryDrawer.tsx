// component/meetin/Step6/CompleteSummaryDrawer.tsx
'use client'

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

interface Props {
  meeting: MeetingSummary
}

export default function CompleteSummaryDrawer({ meeting }: Props) {
  const BOTTOM_NAV_HEIGHT = 72
  const DRAWER_HANDLE_HEIGHT = 28
  
  return (
    <Drawer open>
      <DrawerContent
        // 하단 네비와 겹치지 않도록 바닥 여백 확보
        style={{ bottom: `${BOTTOM_NAV_HEIGHT - DRAWER_HANDLE_HEIGHT}px` }}
        className="z-20 rounded-t-3xl bg-[var(--bg)]">

        <DrawerHeader className="pb-2">
          <DrawerTitle className="text-left text-base font-semibold text-[var(--text)]">
            확정 장소 정보
          </DrawerTitle>
          {/* 🔑 접근성용 설명 (화면에는 안 보임) */}
          <DrawerDescription className="sr-only">
            모임의 확정된 장소, 주소, 연락처 및 카카오 공유 정보를 확인할 수 있습니다.
          </DrawerDescription>
        </DrawerHeader>

        {/* 실제 카드 내용 */}
        <div className="overflow-y-auto px-4 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <CompleteSummaryCard meeting={meeting} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
