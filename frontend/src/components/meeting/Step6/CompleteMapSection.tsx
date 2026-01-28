// src/components/meeting/Step6/CompleteMapSection.tsx
"use client"

import KakaoMap from "@/components/map/KakaoMap"

interface Props {
  lat?: number
  lng?: number
}

export default function CompleteMapSection({ lat, lng }: Props) {
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
    <div className="absolute inset-0 z-0">
      <KakaoMap
        center={center}
        markers={markers}
        level={4}
      />
    </div>
  )
}