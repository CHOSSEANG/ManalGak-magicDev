// src/app/create/step-1/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeShell from '@/components/wireframe/WireframeShell'
import Step1Form from '@/components/wireframe/Step1Form'

export default function Step1Page() {
  const router = useRouter()

  // 와이어프레임 단계: Step 1
  return (
    <WireframeShell>
      <main className="space-y-6 pb-24">
        <WireframeAppHeader />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 1. 날짜/시간 선택</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            날짜 선택과 시간 선택 UI placeholder
          </p>
        </div>
        <Step1Form />
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-[var(--wf-border)] bg-[var(--wf-bg)]">
        <div className="mx-auto flex w-full max-w-[1440px] justify-end px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/create/step-2')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            다음
          </button>
        </div>
      </div>
    </WireframeShell>
  )
}
