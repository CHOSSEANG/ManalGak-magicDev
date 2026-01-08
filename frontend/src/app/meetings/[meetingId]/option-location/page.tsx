// src/app/meetings/[meetingId]/option-location/page.tsx
'use client'
import { useState } from 'react'
import StepCard from '@/components/meeting/StepCard'
import StepNavigation from '@/components/layout/StepNavigation'
import KakaoMap from '@/components/map/KakaoMap'

const middlePlaceMarkers = [
  { lat: 37.563617, lng: 126.997628 },
  { lat: 37.565, lng: 126.99 },
  { lat: 37.56, lng: 127.0 },
]

export default function OptionRealtimePage() {
  const [mapLevel, setMapLevel] = useState(5)
  // 와이어프레임 단계: 옵션 1
  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">옵션 1. 실시간 위치 공유</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          토글 UI만 제공 (추적 기능 없음)
        </p>
      </div>

      <StepCard className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-[var(--wf-border)] 
        bg-[var(--wf-muted)] px-4 py-3 hover:bg-[var(--wf-accent)]">
          <span className="text-sm font-semibold">실시간 위치 공유 동의 </span>
          <label className="flex items-center gap-2 text-xs text-[var(--wf-subtle)]">
            <input type="checkbox" className="h-4 w-4" />
            OFF
          </label>
        </div>
        
        {/* 지도 영역만 */}
        <div className="h-48 rounded-xl border border-[var(--wf-border)] overflow-hidden lg:h-full">
          <KakaoMap
            markers={middlePlaceMarkers}
            level={mapLevel}
          />
        </div>
      </StepCard>

      {/* 스텝 네비 */}
      <StepNavigation
        prevHref="/meetings/new/step5-place"
        prevLabel="이전"
        nextHref="/my"
        nextLabel="내 모임 리스트"
      />

    </main>
  )
}
