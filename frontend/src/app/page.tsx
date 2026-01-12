// src/app/page.tsx
'use client'

import { useEffect } from 'react'
import StepCard from '@/components/meeting/StepCard'

declare global {
  interface Window {
    Kakao: any
    kakao: any
  }
}

export default function HomePage() {
  // 카카오 로그인 시작
  const handleKakaoLogin = () => {
    if (!window.Kakao) return

    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/auth/kakao/callback`,
    })
  }

  // 카카오 지도 미리보기
  useEffect(() => {
    if (!window.kakao) return

    window.kakao.maps.load(() => {
      const container = document.getElementById('map')
      if (!container) return

      const options = {
        center: new window.kakao.maps.LatLng(37.5636, 126.9976),
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

        <StepCard className="space-y-3">
          <div
            id="map"
            className="h-64 w-full rounded-xl border border-[var(--wf-border)]"
          />
          <p className="text-sm text-[var(--wf-subtle)]">
            카카오 지도 미리보기
          </p>
        </StepCard>
      </div>

      {/* 로그인 */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleKakaoLogin}
          className="flex w-full items-center justify-center rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-4 text-base font-semibold"
        >
          카카오 로그인
        </button>

        <p className="text-xs text-[var(--wf-subtle)]">
          카카오 계정으로 로그인
        </p>
      </div>
    </main>
  )
}
