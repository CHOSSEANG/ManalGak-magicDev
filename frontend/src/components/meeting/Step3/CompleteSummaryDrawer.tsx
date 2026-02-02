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
import PlaceInfoSection, {
  PlaceInfo,
} from '@/components/meeting/Step3/PlaceInfoSection'
import TravelTimeSection from '@/components/meeting/Step3/TravelTimeSection'

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface MemberTravel {
  name: string
  minutes: number
  transfers: number
}

export interface ConfirmedPlaceSummary extends PlaceInfo {
  stationName?: string | null
  walkingMinutes?: number | null
  kakaoMapUrl?: string | null
}

interface Props {
  open: boolean
  onClose: () => void
  place?: ConfirmedPlaceSummary | null
  members?: MemberTravel[]
}

export default function CompleteSummaryDrawer({
  open,
  onClose,
  place,
  members,
}: Props) {
  const walkingMinutes =
    typeof place?.walkingMinutes === 'number' ? place.walkingMinutes : null
  const stationName = place?.stationName?.trim() || null
  const walkSummary =
    stationName && walkingMinutes != null
      ? `${stationName}에서 도보 ${walkingMinutes}분`
      : null

  const kakaoMapUrl = place?.kakaoMapUrl?.trim() || null
  const canOpenKakaoMap = Boolean(kakaoMapUrl)

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="app-container max-h-[75vh] rounded-t-3xl bg-[var(--bg)]">
        {/* Header */}
        <DrawerHeader className="relative pb-3">
          <DrawerTitle className="text-left text-base font-semibold text-[var(--text)]">
            확정 장소 정보
          </DrawerTitle>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-[var(--text-subtle)] hover:bg-[var(--neutral-soft)]"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </DrawerHeader>

        {/* Body */}
        <div className="space-y-4 overflow-y-auto px-4 pb-4">
          <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[var(--text)]">
                장소 상세
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PlaceInfoSection place={place} />
              {walkSummary && (
                <p className="text-sm text-[var(--text-subtle)]">
                  {walkSummary}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[var(--text)]">
                이동 시간 요약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TravelTimeSection members={members ?? []} />
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA */}
        <DrawerFooter className="border-t border-[var(--border)] bg-[var(--bg)]">
          <Button
            disabled={!canOpenKakaoMap}
            onClick={() => {
              if (!kakaoMapUrl) return
              window.open(kakaoMapUrl, '_blank', 'noopener,noreferrer')
            }}
            className="h-12 w-full bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-40"
          >
            카카오맵에서 길찾기
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
