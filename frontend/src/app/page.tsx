// src/app/page.tsx

import Link from 'next/link'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'

export default function HomePage() {
  // 와이어프레임 단계: 앱 진입 화면
  return (
    <WireframeShell>
      <main className="flex min-h-[80vh] flex-col justify-between gap-8">
        <WireframeAppHeader />
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-[var(--wf-subtle)]">모임 추천 서비스</p>
            <h1 className="text-3xl font-semibold">만날각</h1>
            <p className="text-sm text-[var(--wf-subtle)]">
              중간 만남 장소 추천을 위한 step-based UX 흐름
            </p>
          </div>

          <WireframeCard className="space-y-4">
            <div className="h-48 rounded-xl border border-dashed border-[var(--wf-border)] bg-[var(--wf-muted)]" />
            <div className="flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--wf-border)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--wf-border)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--wf-border)]" />
              <span className="h-2 w-2 rounded-full bg-[var(--wf-border)]" />
            </div>
            <p className="text-sm text-[var(--wf-subtle)]">
              앱 소개 이미지 영역 (placeholder)
            </p>
          </WireframeCard>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-4 text-base font-semibold"
          >
            카카오 로그인 버튼
          </Link>
          <p className="text-xs text-[var(--wf-subtle)]">
            로그인 성공 시 /create 이동 (UI만 구현)
          </p>
        </div>
      </main>
    </WireframeShell>
  )
}
