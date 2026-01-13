// src/components/meeting/CompleteMapSection.tsx
'use client'

import StepCard from '@/components/meeting/StepCard'
import KakaoMap from '@/components/map/KakaoMap'

interface Props {
  lat: number
  lng: number
}

export default function CompleteMapSection({ lat, lng }: Props) {
  return (
    <StepCard className="space-y-3">
      <p className="text-sm font-semibold">확정된 모임 장소</p>
      <div className="h-56 rounded-xl border border-[var(--wf-border)] overflow-hidden">
        <KakaoMap
          markers={[{ lat, lng }]}
          level={4}
        />
      </div>
    </StepCard>
  )
}
