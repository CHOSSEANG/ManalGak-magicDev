'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

export default function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return
    if (!window.kakao || !window.kakao.maps) return

    const center = new window.kakao.maps.LatLng(
      37.5665,
      126.9780
    )

    new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 5,
    })
  }, [])

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '300px',
        background: '#eee',
      }}
    />
  )
}
