// src/components/meeting/Step6/CompleteMapSection.tsx
"use client";

import KakaoMap from "@/components/map/KakaoMap";

interface Props {
  lat?: number;
  lng?: number;
}

export default function CompleteMapSection({ lat, lng }: Props) {
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng)
  const center = hasCoords ? { lat, lng } : undefined
  const markers = hasCoords ? [{ lat, lng }] : []

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
