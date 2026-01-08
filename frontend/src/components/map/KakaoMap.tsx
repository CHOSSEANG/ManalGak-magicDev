// src/components/map/KakaoMap.tsx
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
    const initMap = () => {
      if (!window.kakao || !window.kakao.maps || !mapRef.current) {
        // SDK 아직 안 로드됐으면 잠깐 기다렸다가 재시도
        setTimeout(initMap, 100)
        return
      }

      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(37.563617, 126.997628)
        const map = new window.kakao.maps.Map(mapRef.current!, {
          center,
          level: 5,
        })

        new window.kakao.maps.Marker({
          position: center,
          map,
        })
      })
    }

    initMap()
  }, [])

  return <div ref={mapRef} className="h-full w-full rounded-2xl" />
}
