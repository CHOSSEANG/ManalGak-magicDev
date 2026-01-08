// src/app/meetings/new/step1-date/page.tsx

import StepNavigation from '@/components/layout/StepNavigation'
import Step1Form from '@/components/meeting/Step1Form'

export default function Step1Page() {
  // 와이어프레임 단계: Step 1
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 1. 날짜/시간 선택</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            날짜 선택과 시간 선택 UI placeholder
          </p>
        </div>
        <Step1Form />
      </main>

      <StepNavigation
        prevHref="/meetings/new"
        nextHref="/meetings/new/step2-purpose"
      />
    </>
  )
}
