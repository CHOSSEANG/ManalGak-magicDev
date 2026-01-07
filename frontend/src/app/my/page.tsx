// src/app/my/page.tsx

import StepCard from '@/components/meeting/StepCard'

export default function MyPage() {
  // 와이어프레임 단계: 내 페이지
  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">내 페이지</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          내 페이지 기본 정보 placeholder
        </p>
      </div>

      <StepCard className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full border border-[var(--wf-border)] bg-[var(--wf-muted)]" />
          <div className="space-y-1">
            <p className="text-base font-semibold">김철수</p>
            <p className="text-sm text-[var(--wf-subtle)]">
              kim@example.com
            </p>
          </div>
        </div>
      </StepCard>

      <button
        type="button"
        className="w-full rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
      >
        로그아웃
      </button>
    </main>
  )
}
