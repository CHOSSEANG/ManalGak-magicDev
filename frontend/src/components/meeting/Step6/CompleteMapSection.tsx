// src/components/meeting/Step6/CompleteMapSection.tsx
"use client"

import KakaoMap from "@/components/map/KakaoMap"

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  lat?: number
  lng?: number
}

export default function CompleteMapSection({ lat, lng }: Props): JSX.Element {
  const hasCoords =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng)

  const center = hasCoords
    ? { lat: lat as number, lng: lng as number }
    : undefined

  const markers = hasCoords
    ? [{ lat: lat as number, lng: lng as number }]
    : []

  return (
    <Card className="relative h-full w-full border border-[var(--border)] bg-[var(--bg)]">
      {/* Header Overlay */}
      <CardHeader className="pointer-events-none absolute left-0 top-0 z-10 w-full bg-[var(--bg-soft)]/90 backdrop-blur">
        <CardTitle className="text-[var(--text)] text-base">
          모임 장소 지도
        </CardTitle>
        <CardDescription className="text-[var(--text-subtle)]">
          최종 확정된 만남 장소 위치입니다.
        </CardDescription>
      </CardHeader>

      {/* Map Area */}
      <CardContent className="relative h-full p-0">
        {!hasCoords && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-soft)]">
            <Skeleton className="h-full w-full bg-[var(--neutral-soft)]" />
          </div>
        )}

        <div className="absolute inset-0 z-0">
          <KakaoMap
            center={center}
            markers={markers}
            level={4}
          />
        </div>
      </CardContent>
    </Card>
  )
}
