import Link from 'next/link'
import WireframeHeader from '@/components/wireframe/WireframeHeader'
import Step3Members from '@/components/wireframe/Step3Members'

export default function Step3Page() {
  // 와이어프레임 단계: Step 3
  return (
    <main className="space-y-6">
      <WireframeHeader
        title="Step 3. 참여 멤버 및 상태 변경"
        backHref="/meetings/create/step-2"
      />
      <p className="text-sm text-[var(--wf-subtle)]">
        완료된 단계라도 수정 가능합니다.
      </p>

      <Step3Members />

      <div className="flex items-center justify-between">
        <Link
          href="/meetings/create/step-2"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
        >
          이전
        </Link>
        <Link
          href="/meetings/create/step-4"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          다음
        </Link>
      </div>
    </main>
  )
}
