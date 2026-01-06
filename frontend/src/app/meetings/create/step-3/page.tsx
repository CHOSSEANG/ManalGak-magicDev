// src/app/meetings/create/step-3/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeHeader from '@/components/wireframe/WireframeHeader'
import Step3Members from '@/components/wireframe/Step3Members'

export default function Step3Page() {
  const router = useRouter()

  // 와이어프레임 단계: Step 3
  return (
    <>
      <main className="space-y-6 pb-24">
        <WireframeAppHeader />
        <WireframeHeader
          title="Step 3. 참여 멤버 및 상태 변경"
          backHref="/meetings/create/step-2"
        />
        <p className="text-sm text-[var(--wf-subtle)]">
          완료된 단계라도 수정 가능합니다.
        </p>

        <Step3Members />
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-[var(--wf-border)] bg-[var(--wf-bg)]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/meetings/create/step-2')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => router.push('/meetings/create/step-4')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            다음
          </button>
        </div>
      </div>
    </>
  )
}
