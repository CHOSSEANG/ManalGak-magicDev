// src/app/meetings/create/step-2/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import SingleSelectGrid from '@/components/wireframe/SingleSelectGrid'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeHeader from '@/components/wireframe/WireframeHeader'

const purposes = [
  '친구',
  '가족',
  '회사',
  '대학',
  '운동',
  '번개',
  '조찬',
  '만찬',
  '디너',
  '연말',
  '신년',
  '명절',
]

export default function Step2Page() {
  const router = useRouter()

  // 와이어프레임 단계: Step 2
  return (
    <>
      <main className="space-y-6 pb-24">
        <WireframeAppHeader />
        <WireframeHeader title="Step 2. 모임 목적" backHref="/meetings/create/step-1" />
        <WireframeCard className="space-y-4">
          <h2 className="text-base font-semibold">모임 목적 선택</h2>
          <SingleSelectGrid
            items={purposes}
            initial="친구"
            helperText="단일 선택만 가능합니다."
          />
        </WireframeCard>
      </main>

      <div className="fixed inset-x-0 bottom-0 bg-transparent">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/meetings/create/step-1')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => router.push('/meetings/create/step-3')}
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            다음
          </button>
        </div>
      </div>
    </>
  )
}
