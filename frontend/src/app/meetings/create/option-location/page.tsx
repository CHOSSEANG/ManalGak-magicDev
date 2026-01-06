// src/app/meetings/create/option-location/page.tsx

import Link from 'next/link'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeHeader from '@/components/wireframe/WireframeHeader'

export default function OptionLocationPage() {
  // 와이어프레임 단계: 옵션 1
  return (
    <main className="space-y-6">
      <WireframeAppHeader />
      <WireframeHeader
        title="옵션 1. 실시간 위치 공유"
        backHref="/meetings/create"
      />
      <WireframeCard className="space-y-4">
        <p className="text-sm text-[var(--wf-subtle)]">
          실제 위치 추적 없이 토글 UI만 제공합니다.
        </p>
        <div className="flex items-center justify-between rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
          <span className="text-sm font-semibold">실시간 위치 공유</span>
          <label className="flex items-center gap-2 text-xs text-[var(--wf-subtle)]">
            <input type="checkbox" className="h-4 w-4" />
            OFF
          </label>
        </div>
        <div className="h-40 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
      </WireframeCard>

      <div className="flex justify-end">
        <Link
          href="/meetings/create/step-5"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          Step 5로 돌아가기
        </Link>
      </div>
    </main>
  )
}
