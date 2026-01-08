// src/app/meetings/new/step4-origin/page.tsx

import StepNavigation from '@/components/layout/StepNavigation'
import Step4Form from '@/components/ui/Step4Form'

export default function Step4Page() {
  // 와이어프레임 단계: Step 4
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 4. 출발지/교통수단</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            출발지 입력 버튼과 교통수단 선택 placeholder
          </p>
        </div>
        <Step4Form />
      </main>

      <StepNavigation
        prevHref="/meetings/new/step3-members"
        nextHref="/meetings/new/step5-place"
      />
    </>
  )
}
