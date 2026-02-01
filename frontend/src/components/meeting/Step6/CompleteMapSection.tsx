// src/components/meeting/Step6/CompleteMapSection.tsx
"use client"

import KakaoMap from "@/components/map/KakaoMap"
import Step6Map from "@/components/map/Step6Map"

interface Props {
  meetingUuid: string
  lat?: number
  lng?: number
  placeName?: string
}

export default function CompleteMapSection({
  meetingUuid,
  lat,
  lng,
  placeName,
}: Props): JSX.Element {
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
      {/* 지도 영역은 100% 높이를 유지해야 함 */}
      <div className="absolute inset-0">
        {hasCoords ? (
          <Step6Map
            meetingUuid={meetingUuid}
            destLat={lat as number}
            destLng={lng as number}
            placeName={placeName ?? "확정 장소"}
          />
        ) : (
          <KakaoMap center={center} markers={markers} level={4} />
        )}
      </div>

      {/* 좌표가 없을 때도 지도는 유지하고, 안내만 표시 */}
      {!hasCoords && (
        <div className="pointer-events-none absolute inset-x-0 top-4 z-10 mx-auto w-fit rounded-full bg-[var(--bg-soft)]/90 px-3 py-1 text-xs text-[var(--text-subtle)] shadow-sm">
          위치 정보를 불러오는 중입니다.
        </div>
      )}
    </div>
  )
}
