// src/app/option/realtime/page.tsx

import Link from 'next/link'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'

export default function OptionRealtimePage() {
  // 와이어프레임 단계: 옵션 1
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeAppHeader />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">옵션 1. 실시간 위치 공유</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            토글 UI만 제공 (추적 기능 없음)
          </p>
        </div>

        <WireframeCard className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3">
            <span className="text-sm font-semibold">실시간 위치 공유</span>
            <label className="flex items-center gap-2 text-xs text-[var(--wf-subtle)]">
              <input type="checkbox" className="h-4 w-4" />
              OFF
            </label>
          </div>
          <div className="h-48 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
        </WireframeCard>

        <Link
          href="/create/complete"
          className="inline-flex items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-3 text-sm font-semibold"
        >
          완료 화면으로
        </Link>
      </main>
    </WireframeShell>
  )
}
