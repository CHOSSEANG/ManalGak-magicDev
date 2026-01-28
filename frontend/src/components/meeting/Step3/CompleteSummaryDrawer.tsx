// src/components/meeting/Step3/CompleteSummaryDrawer.tsx
'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { X } from 'lucide-react'
import PlaceInfoSection from './PlaceInfoSection'
import TravelTimeSection from './TravelTimeSection'

interface MemberTravel {
  name: string
  minutes: number
  transfers: number
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function CompleteSummaryDrawer({ open, onClose }: Props) {
  const members: MemberTravel[] = [
    { name: '나', minutes: 35, transfers: 1 },
    { name: '현수', minutes: 25, transfers: 2 },
    { name: '영희', minutes: 24, transfers: 1 },
    { name: '민수', minutes: 28, transfers: 1 },
  ]

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="max-h-[75vh] rounded-t-3xl bg-[var(--wf-surface)]">
        {/* Header */}
        <DrawerHeader className="relative pb-3">
          <DrawerTitle className="text-left text-base font-semibold">
            확정 장소 정보
          </DrawerTitle>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 hover:bg-muted"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </DrawerHeader>

        {/* Body */}
        <div className="space-y-6 overflow-y-auto px-4 pb-4">
          <PlaceInfoSection />
          <TravelTimeSection members={members} />

          <p className="text-sm text-[var(--wf-subtle)]">
            을지로입구역에서 도보 5분
          </p>
        </div>

        {/* Footer CTA */}
        <DrawerFooter className="border-t bg-[var(--wf-surface)]">
          <button className="h-12 w-full rounded-xl bg-[var(--wf-highlight)] text-sm font-semibold">
            카카오맵에서 길찾기
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}