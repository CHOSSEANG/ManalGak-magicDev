// src/app/meetings/new/page.tsx

import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'

export default function MeetingsNewPage() {
  // 와이어프레임 단계: 신규 모임 placeholder
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeAppHeader />
        <WireframeCard className="space-y-3">
          <h1 className="text-2xl font-semibold">신규 모임</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            신규 모임 페이지는 추후 /create 플로우로 대체됩니다.
          </p>
        </WireframeCard>
      </main>
    </WireframeShell>
  )
}
