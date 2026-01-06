import Link from 'next/link'
import WireframeShell from '@/components/wireframe/WireframeShell'
import WireframeHeader from '@/components/wireframe/WireframeHeader'

export default function MeetingJoinPage() {
  // 와이어프레임 단계: 모임 참여 placeholder
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeHeader title="모임 참여" backHref="/" />
        <p className="text-sm text-[var(--wf-subtle)]">
          참여 플로우는 추후 확정됩니다. 현재는 결과 화면으로 이동합니다.
        </p>
        <Link
          href="/meetings/m-1024"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          모임 결과 보기
        </Link>
      </main>
    </WireframeShell>
  )
}
