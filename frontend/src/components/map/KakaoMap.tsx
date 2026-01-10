// src/components/map/KakaoMap.tsx
'use client'

import { useEffect, useMemo, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

type LatLng = {
  lat: number
  lng: number
}

type Props = {
  markers?: LatLng[]
  level?: number
  center?: LatLng
  className?: string
  style?: React.CSSProperties
  minHeight?: number | string
}

const FALLBACK_CENTER = { lat: 37.5665, lng: 126.978 }

export default function KakaoMap({
  markers = [],
  level = 5,
  center,
  className,
  style,
  minHeight = 240,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  const initialCenter = useMemo<LatLng>(() => {
    return center ?? markers[0] ?? FALLBACK_CENTER
  }, [center, markers])

  /** ✅ 지도 최초 생성 */
  useEffect(() => {
    if (!mapRef.current) return
    if (!window.kakao || !window.kakao.maps) return
    if (mapInstanceRef.current) return

    window.kakao.maps.load(() => {
      if (mapInstanceRef.current) return

      const kakaoCenter = new window.kakao.maps.LatLng(
        initialCenter.lat,
        initialCenter.lng
      )

      const map = new window.kakao.maps.Map(mapRef.current!, {
        center: kakaoCenter,
        level,
      })

      /** 🔹 확대 / 축소 컨트롤 */
      const zoomControl = new window.kakao.maps.ZoomControl()
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

      /** 🔹 지도 / 스카이뷰 전환 */
      const mapTypeControl = new window.kakao.maps.MapTypeControl()
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

      mapInstanceRef.current = map

      requestAnimationFrame(() => {
        map.relayout()
        map.setCenter(kakaoCenter)
      })
    })
  }, [initialCenter.lat, initialCenter.lng])

  /** 🔴 마커 업데이트 (빨간 마커 + InfoWindow) */
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !window.kakao?.maps) return

    markersRef.current.forEach((marker) => marker.setMap(null))

    // 🔴 기본 빨간 마커 이미지
    const markerImage = new window.kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
      new window.kakao.maps.Size(64, 69),
      { offset: new window.kakao.maps.Point(27, 69) }
    )

    markersRef.current = markers.map((point, index) => {
      const position = new window.kakao.maps.LatLng(point.lat, point.lng)

      const marker = new window.kakao.maps.Marker({
        map,
        position,
        image: markerImage,
      })

      /** ℹ️ 마커 클릭 InfoWindow */
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:6px;font-size:12px;">
            📍 후보 위치 ${index + 1}
          </div>
        `,
      })

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker)
      })

      return marker
    })
  }, [markers])

  /** 줌 레벨 변경 */
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    map.setLevel(level)
  }, [level])

  /** 중심 좌표 변경 */
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !center || !window.kakao?.maps) return

    const nextCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
    map.setCenter(nextCenter)
  }, [center])

  /** 리사이즈 대응 */
  useEffect(() => {
    const map = mapInstanceRef.current
    const container = mapRef.current
    if (!map || !container) return
    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => map.relayout())
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

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
