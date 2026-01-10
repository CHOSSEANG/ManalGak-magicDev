// src/app/meetings/[meetingId]/option-location/page.tsx
'use client'

import { useState, useEffect, useRef} from 'react'
import StepNavigation from '@/components/layout/StepNavigation'
import KakaoMap from '@/components/map/KakaoMap'

const middlePlaceMarkers = [
  { lat: 37.563617, lng: 126.997628 },
  { lat: 37.565, lng: 126.99 },
  { lat: 37.56, lng: 127.0 },
]

export default function OptionRealtimePage() {
  const [mapLevel, setMapLevel] = useState(5)
  const [status, setStatus] = useState<'idle' | 'tracking' | 'denied'>('idle')
  const watchIdRef = useRef<number | null>(null)

   /** 위치 추적 시작 */
  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 기능을 지원하지 않습니다.')
      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        console.log('📍 현재 위치', latitude, longitude)

        // TODO: 추후 상태 저장 or 마커 업데이트
        setStatus('tracking')
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setStatus('denied')
          return
        }

        // ❗ 진짜 예외 상황만 콘솔 에러로 출력
        console.error(error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    )
  }

  /** 위치 추적 중단 */
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setStatus('idle')
  }

  /** 언마운트 시 안전 처리 */
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return (
    <>
   
    <main className="w-full space-y-0">
      {/* ✅ 지도 섹션 (명확한 높이) */}
      <section
        className="
          relative w-full
          h-[65vh]
          md:h-[70vh]
          lg:h-[70vh]
          overflow-hidden
        "
      >
        {/* 지도 */}
        <KakaoMap
          markers={middlePlaceMarkers}
          level={mapLevel}
        />

        {/* 지도 위 오버레이 UI */}
        <div className="absolute inset-x-0 top-0 z-10 space-y-4 px-4 pt-6">
          <div className=''>
            <h1 className="text-2xl font-semibold">
              옵션 1. 실시간 위치 공유
            </h1>
            <p className="text-sm text-[var(--wf-subtle)]">
              위치공유를 on 하세요! 
            </p>
          </div>

          {/* 지도 위 버튼 */}
        <div className="absolute top-7 right-10 z-10 ">
          {status !== 'tracking' ? (
            <button
              onClick={startTracking}
              className="rounded-lg bg-yellow-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              위치 On
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="rounded-xl bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              위치 Off
            </button>
          )}
        </div>
        </div>
      </section>

      {/* 상태 안내 */}
      {status === 'denied' && (
        <p className="px-4 text-sm text-red-600">
            위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해 주세요. 
            <button>권한 설정 바로가기</button>
        </p>
      )}

      {/* ✅ footer 위 정상 콘텐츠 영역 */}
      <StepNavigation
        prevHref="/meetings/new/step5-place"
        prevLabel="이전"
        nextHref="/my"
        nextLabel="내 모임 리스트"
      />
      </main>
      </>
  )
}
