// src/app/meetings/create/step-1/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeHeader from '@/components/wireframe/WireframeHeader'
import Step1Form from '@/components/wireframe/Step1Form'

export default function Step1Page() {
  const router = useRouter()

  // 와이어프레임 단계: Step 1
  return (
    <>
      <main className="space-y-6 pb-24">
        <WireframeAppHeader />
        <WireframeHeader title="Step 1. 날짜/시간 선택" backHref="/meetings/create" />
        <p className="text-sm text-[var(--wf-subtle)]">
          달력 모달과 시간 선택 UI를 확인합니다.
        </p>

        <Step1Form />
      </main>

      <div className="fixed inset-x-0 bottom-0 bg-transparent">
        <div className="mx-auto flex w-full max-w-[1440px] justify-end px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/meetings/create/step-2')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            다음
          </button>
        </div>
      </div>
    </>
  )
}
