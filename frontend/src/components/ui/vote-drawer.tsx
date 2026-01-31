//src/components/ui/vote-drawer.tsx
'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'

// 1/30[유리] - 투표 진행용 Drawer (기존 투표 UI 삽입용)
interface VoteDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export default function VoteDrawer({
  open,
  onOpenChange,
  children,
}: VoteDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="px-0">
          <DrawerTitle className="text-base text-[var(--text)]">
            추천 장소 투표
          </DrawerTitle>
          <DrawerDescription className="text-xs text-[var(--text-subtle)]">
            가장 가고 싶은 장소에 투표해주세요
          </DrawerDescription>
        </DrawerHeader>

        {/* 기존 Step3PlaceList의 투표 UI 그대로 삽입 */}
        <div className="mt-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
