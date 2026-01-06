// src/app/login/page.tsx

import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'
import Link from 'next/link'

export default function LoginPage() {
  // 와이어프레임 단계: 로그인 화면
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeAppHeader />
        <WireframeCard className="space-y-4">
          <h1 className="text-2xl font-semibold">로그인</h1>
          <div className="h-40 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
          <p className="text-sm text-[var(--wf-subtle)]">
            카카오 로그인 UI placeholder
          </p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-3 text-sm font-semibold"
          >
            로그인 완료 (UI)
          </Link>
        </WireframeCard>
      </main>
    </WireframeShell>
  )
}
