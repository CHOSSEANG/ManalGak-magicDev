// src/app/meetings/new/step3-members/page.tsx

import StepNavigation from '@/components/layout/StepNavigation'
import MemberList from '@/components/meeting/Step3/Step3MemberList'

export default function Step3Page() {
  // 와이어프레임 단계: Step 3
  return (
    <>
      <main className="space-y-6 pb-24">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 3. 참여 멤버</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            멤버 리스트와 상태 변경 영역 placeholder
          </p>
        </div>
        <MemberList />
      </main>

      <StepNavigation
        prevHref="/meetings/new/step2-purpose"
        nextHref="/meetings/new/step4-origin"
      />
    </>
  )
}
