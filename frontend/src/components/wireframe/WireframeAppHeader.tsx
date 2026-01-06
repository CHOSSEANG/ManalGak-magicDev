// src/components/wireframe/WireframeAppHeader.tsx

export default function WireframeAppHeader() {
  // 와이어프레임 단계: 공통 헤더
  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)]">
          ≡
        </div>
        <div className="flex h-10 w-24 items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] text-xs">
          로고 영역
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--wf-border)] bg-[var(--wf-surface)] text-xs">
          알림
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--wf-border)] bg-[var(--wf-surface)] text-xs">
          프로필
        </div>
      </div>
    </header>
  )
}
