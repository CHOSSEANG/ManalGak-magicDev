// src/components/map/KakaoMapLoader.tsx
'use client'

import Script from 'next/script'

export default function KakaoMapLoader() {
  return (
    <Script
      src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`}
      strategy="afterInteractive"
      onLoad={() => {
        console.log('[KakaoMap] SDK loaded')
        window.__kakaoMapLoaded = true
      }}
    />
  )
}
