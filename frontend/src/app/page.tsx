// src/app/page.tsx
// 만날각 첫페이지 + FE 단독 로그인/지도 확인

'use client'

import { useEffect, useState } from 'react'
import StepCard from '@/components/meeting/StepCard'

declare global {
  interface Window {
    kakao: any
  }
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // FE 단독 Mock 로그인
  const handleKakaoLogin = () => {
    setIsLoggedIn(true)
  }

  // 카카오 지도 로드
  useEffect(() => {
    if (!window.kakao) return

    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      if (!container) return

      const options = {
        center: new window.kakao.maps.LatLng(37.5636, 126.9976), // 서울 중구
        level: 5,
      }

      new window.kakao.maps.Map(container, options)
    })
  }, [])

  return (
    <main className="flex min-h-[80vh] flex-col justify-between gap-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-[var(--wf-subtle)]">모임 추천 서비스</p>
          <h1 className="text-3xl font-semibold">만날각</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            중간 만남 장소 추천을 위한 step-based UX 흐름
          </p>
        </div>

        {/* 지도 영역 */}
        <StepCard className="space-y-3">
          <div
            id="map"
            className="h-64 w-full rounded-xl border border-[var(--wf-border)]"
          />
          <p className="text-sm text-[var(--wf-subtle)]">
            카카오 지도 미리보기 (서울 중구 기준)
          </p>
        </StepCard>
      </div>

      {/* 로그인 영역 */}
<div className="flex flex-col gap-3">
  <button
    type="button"
    onClick={() => {
      // FE 단독: 다음 단계로 이동만 확인
      window.location.href = '/auth/kakao/callback'
      // 또는
      // window.location.href = '/auth/kakao/callback'
    }}
    className="flex w-full items-center justify-center rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-4 text-base font-semibold"
  >
    카카오 로그인
  </button>

  <p className="text-xs text-[var(--wf-subtle)]">
    로그인 후 다음 단계 이동 (FE 플로우 확인용)
  </p>
</div>
    </main>
  )
}
