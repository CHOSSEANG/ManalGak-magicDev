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

  useEffect(() => {
    if (!mapRef.current) return
    if (!window.kakao || !window.kakao.maps) return
    if (mapInstanceRef.current) return

    const kakaoCenter = new window.kakao.maps.LatLng(
      initialCenter.lat,
      initialCenter.lng
    )
    const map = new window.kakao.maps.Map(mapRef.current, {
      center: kakaoCenter,
      level,
    })

    mapInstanceRef.current = map

    const rafId = requestAnimationFrame(() => {
      map.relayout()
      map.setCenter(kakaoCenter)
    })

    return () => cancelAnimationFrame(rafId)
  }, [initialCenter.lat, initialCenter.lng, level])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !window.kakao?.maps) return

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = markers.map((point) => {
      const position = new window.kakao.maps.LatLng(point.lat, point.lng)
      return new window.kakao.maps.Marker({
        map,
        position,
      })
    })
  }, [markers])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    map.setLevel(level)
  }, [level])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !center || !window.kakao?.maps) return

    const nextCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
    map.setCenter(nextCenter)
  }, [center])

  useEffect(() => {
    const map = mapInstanceRef.current
    const container = mapRef.current
    if (!map || !container) return

    const relayout = () => {
      requestAnimationFrame(() => {
        map.relayout()
        if (center && window.kakao?.maps) {
          const nextCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
          map.setCenter(nextCenter)
        }
      })
    }

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => relayout())
    observer.observe(container)

    return () => observer.disconnect()
  }, [center])

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
