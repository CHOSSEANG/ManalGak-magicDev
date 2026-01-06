// src/app/create/complete/page.tsx

import Link from 'next/link'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'

export default function CreateCompletePage() {
  // 와이어프레임 단계: 완료 화면
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeAppHeader />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">모임 확정 완료</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            선택 정보 요약 카드 placeholder
          </p>
        </div>

        <WireframeCard className="space-y-3">
          <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4 text-sm">
            모임명: 친구들과 친목모임
          </div>
          <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4 text-sm">
            일시: 2026.01.23 12:00
          </div>
          <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4 text-sm">
            중간지점: 중간지점 카페
          </div>
        </WireframeCard>

        <WireframeCard className="space-y-3">
          <p className="text-sm font-semibold">옵션 페이지 이동</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/option/realtime"
              className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-2 text-sm"
            >
              실시간 위치 공유
            </Link>
            <Link
              href="/option/payment"
              className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-2 text-sm"
            >
              회비 관리
            </Link>
            <Link
              href="/my"
              className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-2 text-sm font-semibold"
            >
              내 모임으로 이동
            </Link>
          </div>
        </WireframeCard>
      </main>
    </WireframeShell>
  )
}
