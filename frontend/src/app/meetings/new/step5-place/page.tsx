// src/app/meetings/new/step5-place/page.tsx
'use client'

import StepNavigation from '@/components/layout/StepNavigation'
import Step5PlaceList from '@/components/meeting/Step5/Step5PlaceList'

export default function Step5Page() {
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Step 5. 중간지점/추천장소
          </h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            지도 영역과 추천 장소 리스트 placeholder
          </p>
        </div>

        <Step5PlaceList />
      </main>

      <StepNavigation
        prevHref="/meetings/new/step4-origin"
        nextHref="/meetings/meeting-001/complete"
        nextLabel="모임 확정"
      />
    </>
  )
}
