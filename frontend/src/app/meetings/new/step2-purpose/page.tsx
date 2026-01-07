// src/app/meetings/new/step2-purpose/page.tsx

import StepNavigation from '@/components/layout/StepNavigation'
import StepCard from '@/components/meeting/StepCard'
import SingleSelectGrid from '@/components/ui/SingleSelectGrid'

const purposes = ['친구', '가족', '회사', '대학', '운동', '번개']

export default function Step2Page() {
  // 와이어프레임 단계: Step 2
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 2. 모임 목적</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            목적 선택 버튼 리스트 placeholder
          </p>
        </div>
        <StepCard className="space-y-4">
          <SingleSelectGrid items={purposes} helperText="단일 선택만 가능합니다." />
        </StepCard>
      </main>

      <StepNavigation
        prevHref="/meetings/new/step1-date"
        nextHref="/meetings/new/step3-members"
      />
    </>
  )
}
