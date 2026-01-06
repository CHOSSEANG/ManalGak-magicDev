// src/app/create/step-4/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeShell from '@/components/wireframe/WireframeShell'
import Step4Form from '@/components/wireframe/Step4Form'

export default function Step4Page() {
  const router = useRouter()

  // 와이어프레임 단계: Step 4
  return (
    <WireframeShell>
      <main className="space-y-6 pb-24">
        <WireframeAppHeader />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 4. 출발지/교통수단</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            출발지 입력 버튼과 교통수단 선택 placeholder
          </p>
        </div>
        <Step4Form />
      </main>

      <div className="fixed inset-x-0 bottom-0 bg-transparent">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/create/step-3')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => router.push('/create/step-5')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            다음
          </button>
        </div>
      </div>
    </WireframeShell>
  )
}
