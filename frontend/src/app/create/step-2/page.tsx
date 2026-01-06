// src/app/create/step-2/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import SingleSelectGrid from '@/components/wireframe/SingleSelectGrid'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'

const purposes = ['친구', '가족', '회사', '대학', '운동', '번개']

export default function Step2Page() {
  const router = useRouter()

  // 와이어프레임 단계: Step 2
  return (
    <WireframeShell>
      <main className="space-y-6 pb-24">
        <WireframeAppHeader />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Step 2. 모임 목적</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            목적 선택 버튼 리스트 placeholder
          </p>
        </div>
        <WireframeCard className="space-y-4">
          <SingleSelectGrid items={purposes} helperText="단일 선택만 가능합니다." />
        </WireframeCard>
      </main>

      <div className="fixed inset-x-0 bottom-0 bg-transparent">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/create/step-1')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => router.push('/create/step-3')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            다음
          </button>
        </div>
      </div>
    </WireframeShell>
  )
}
