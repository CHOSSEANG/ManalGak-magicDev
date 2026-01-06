// src/app/my/page.tsx

import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'

export default function MyPage() {
  // 와이어프레임 단계: 내 모임
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeAppHeader />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">내 모임</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            내 모임 목록 및 설정 placeholder
          </p>
        </div>

        <WireframeCard className="space-y-3">
          <p className="text-sm font-semibold">최근 모임 리스트</p>
          <div className="space-y-2">
            {['친구들과 친목모임', '회사 점심 모임', '운동 번개'].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </WireframeCard>

        <WireframeCard className="space-y-3">
          <p className="text-sm font-semibold">설정</p>
          <div className="flex items-center justify-between rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
            알림 설정
            <span className="text-xs text-[var(--wf-subtle)]">OFF</span>
          </div>
        </WireframeCard>
      </main>
    </WireframeShell>
  )
}
