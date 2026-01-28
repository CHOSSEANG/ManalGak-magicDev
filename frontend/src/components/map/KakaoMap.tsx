// src/components/map/KakaoMap.tsx
'use client'

import { useEffect, useMemo, useRef } from 'react'

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type KakaoLatLng = unknown
type KakaoMapInstance = {
  relayout: () => void
  setCenter: (center: KakaoLatLng) => void
}
type KakaoMarker = { setMap: (map: KakaoMapInstance | null) => void }

type LatLng = { lat: number; lng: number }

const FALLBACK_CENTER = { lat: 37.5665, lng: 126.978 }

interface KakaoMapProps {
  markers?: LatLng[]
  level?: number
  center?: LatLng
  className?: string
  style?: React.CSSProperties
  minHeight?: number | string
}

export default function KakaoMap({
  markers = [],
  level = 5,
  center,
  className,
  style,
  minHeight = 240,
}: KakaoMapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null)
  const markersRef = useRef<KakaoMarker[]>([])

  const initialCenter = useMemo(() => {
    if (center) return center
    if (markers.length > 0) return markers[0]
    return FALLBACK_CENTER
  }, [center, markers])

  /** =====================
   * SDK 초기화 + 지도 생성 (기존 로직 유지)
   * ===================== */
  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstanceRef.current) return

    const maps = window.kakao?.maps
    if (!maps?.load) return

    maps.load(() => {
      if (mapInstanceRef.current) return

      const kakaoCenter = new maps.LatLng(
        initialCenter.lat,
        initialCenter.lng
      )

      const map = new maps.Map(mapRef.current as HTMLElement, {
        center: kakaoCenter,
        level,
      })

      mapInstanceRef.current = map

      requestAnimationFrame(() => {
        map.relayout()
        map.setCenter(kakaoCenter)
      })
    })
  }, [initialCenter.lat, initialCenter.lng, level])

  /** =====================
   * 마커 처리 (기존 로직 유지)
   * ===================== */
  useEffect(() => {
    const map = mapInstanceRef.current
    const maps = window.kakao?.maps
    if (!map || !maps?.LatLng || !maps.Marker) return

    markersRef.current.forEach((marker) => {
      marker.setMap(null)
    })

    markersRef.current = markers.map(
      (p) =>
        new maps.Marker({
          map,
          position: new maps.LatLng(p.lat, p.lng),
        })
    )
  }, [markers])

  return (
    <Card className={`border-[var(--border)] bg-[var(--bg-soft)] ${className ?? ''}`}>
      {/* Header */}
      <CardHeader>
        <CardTitle className="text-[var(--text)]">
          중간 지점 지도
        </CardTitle>
        <CardDescription className="text-[var(--text-subtle)]">
          참여 멤버 기준으로 계산된 위치를 지도에서 확인하세요.
        </CardDescription>
      </CardHeader>

      {/* Map */}
      <CardContent>
        <div
          className="relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)]"
          style={{ minHeight }}
        >
          {/* 지도 영역 */}
          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight,
              ...style,
            }}
          />

          {/* SDK 로딩 전 Skeleton */}
          {!mapInstanceRef.current && (
            <div className="absolute inset-0 p-4">
              <Skeleton className="h-full w-full rounded-lg bg-[var(--neutral-soft)]" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
