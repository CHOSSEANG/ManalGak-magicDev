// src/app/meetings/create/step-5/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeHeader from '@/components/wireframe/WireframeHeader'
import Step5PlacePicker from '@/components/wireframe/Step5PlacePicker'

export default function Step5Page() {
  const router = useRouter()

  // 와이어프레임 단계: Step 5
  return (
    <>
      <main className="space-y-6 pb-24">
        <WireframeAppHeader />
        <WireframeHeader
          title="Step 5. 중간지점 & 추천 장소"
          backHref="/meetings/create/step-4"
        />
        <Step5PlacePicker />
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-[var(--wf-border)] bg-[var(--wf-bg)]">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/meetings/create/step-4')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => router.push('/meetings/m-1024')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            모임 확정
          </button>
        </div>
      </div>
    </>
  )
}
