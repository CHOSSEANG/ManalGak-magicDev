// src/app/meetings/[id]/result/page.tsx

import Link from 'next/link'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeShell from '@/components/wireframe/WireframeShell'

export default function MeetingResultAliasPage() {
  // 와이어프레임 단계: 결과 페이지 placeholder
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeAppHeader />
        <p className="text-sm text-[var(--wf-subtle)]">
          이 페이지는 /meetings/[id] 결과 화면으로 이동합니다.
        </p>
        <Link
          href="/meetings/m-1024"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          결과 화면 보기
        </Link>
      </main>
    </WireframeShell>
  )
}
