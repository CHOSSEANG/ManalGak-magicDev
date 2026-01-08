// src/components/map/KakaoMap.tsx
'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

export default function KakaoMap() {
  console.log('[KakaoMap] render')

  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log('[KakaoMap] effect start')

    if (!mapRef.current) {
      console.log('[KakaoMap] mapRef not ready')
      return
    }

    // 이미 SDK가 로드된 경우
    if (window.kakao && window.kakao.maps) {
      console.log('[KakaoMap] kakao exists')
      window.kakao.maps.load(initMap)
      return
    }

    console.log('[KakaoMap] loading kakao sdk')

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`
    script.async = true

    script.onload = () => {
      console.log('[KakaoMap] sdk loaded')
      window.kakao.maps.load(initMap)
    }

    document.head.appendChild(script)

    function initMap() {
      console.log('[KakaoMap] initMap')

      if (!mapRef.current) return

      const center = new window.kakao.maps.LatLng(37.563617, 126.997628)

      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      })

      new window.kakao.maps.Marker({
        position: center,
        map,
      })
    }
  }, [])

  return (
    <div
      ref={mapRef}
      className="h-full w-full rounded-2xl bg-gray-200"
    />
  )
}
