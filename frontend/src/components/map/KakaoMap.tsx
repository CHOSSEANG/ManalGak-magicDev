// src/components/map/KakaoMap.tsx
'use client'

import { useEffect, useMemo, useRef } from 'react'

type LatLng = { lat: number; lng: number }
type KakaoMapWithZoomable = KakaoMapInstance & { setZoomable: (zoomable: boolean) => void }

const FALLBACK_CENTER = { lat: 37.5665, lng: 126.978 }

export default function KakaoMap({
  markers = [],
  level = 5,
  center,
  className,
  style,
  minHeight = 240,
}: {
  markers?: LatLng[]
  level?: number
  center?: LatLng
  className?: string
  style?: React.CSSProperties
  minHeight?: number | string
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint: narrow map refs to avoid any
  const mapInstanceRef = useRef<KakaoMapInstance | null>(null)
  const markersRef = useRef<KakaoMapMarker[]>([])

  const initialCenter = useMemo(
    () => center ?? markers[0] ?? FALLBACK_CENTER,
    [center, markers]
  )

  /** ✅ SDK 초기화 + 지도 생성 (경쟁 상태 완전 제거) */
  useEffect(() => {
    if (!mapRef.current) return
    if (mapInstanceRef.current) return
    const maps = window.kakao?.maps
    if (!maps?.load) return

    maps.load(() => {
      // 🔒 여기 들어왔다는 건 SDK 내부 초기화 완료
      if (mapInstanceRef.current) return

      const kakaoCenter = new maps.LatLng(
        initialCenter.lat,
        initialCenter.lng
      )

      const map = new maps.Map(mapRef.current!, {
        center: kakaoCenter,
        level,
      })

      // ✅ 배경 지도 제스처 활성화
      map.setDraggable(true)
      ;(map as unknown as KakaoMapWithZoomable).setZoomable(true)

      mapInstanceRef.current = map

      requestAnimationFrame(() => {
        map.relayout()
        map.setCenter(kakaoCenter)
      })
    })
  }, [initialCenter.lat, initialCenter.lng, level])

  /** 마커 */
  useEffect(() => {
    const map = mapInstanceRef.current
    const maps = window.kakao?.maps
    if (!map || !maps?.LatLng || !maps.Marker) return

    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = markers.map(
      (p) =>
        new maps.Marker({
          map,
          position: new maps.LatLng(p.lat, p.lng),
        })
    )
  }, [markers])

  return (
    <div
      ref={mapRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight,
        background: '#eee',
        ...style,
      }}
    />
  )
}
