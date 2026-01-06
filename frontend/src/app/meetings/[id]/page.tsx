// src/app/meetings/[id]/page.tsx

import Link from 'next/link'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'
import MeetingTabs from '@/components/wireframe/MeetingTabs'

const members = ['이름각', '이름각', '이름각', '이름각', '이름각']

export default function MeetingResultPage() {
  // 와이어프레임 단계: 모임 확정 결과
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeAppHeader />
        <p className="text-sm text-[var(--wf-subtle)]">
          선택한 정보 요약과 탭 콘텐츠를 확인합니다.
        </p>

        <WireframeCard className="space-y-4">
          <div className="h-36 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
          <div className="flex flex-wrap gap-3">
            {members.map((name, index) => (
              <div
                key={`${name}-${index}`}
                className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)]"
              >
                <div className="h-5 w-5 rounded-full bg-[var(--wf-muted)]" />
                <span className="text-[10px]">{name}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4 text-sm">
            모임명: 친구들과 친목모임 · 일시: 2026.01.23 12:00 · 인원: 5인
          </div>
        </WireframeCard>

        <MeetingTabs />

        <div className="flex justify-end">
          <Link
            href="/my"
            className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            내 모임 목록으로 이동
          </Link>
        </div>
      </main>
    </WireframeShell>
  )
}
