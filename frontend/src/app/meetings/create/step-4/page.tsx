import Link from 'next/link'
import WireframeHeader from '@/components/wireframe/WireframeHeader'
import Step4Form from '@/components/wireframe/Step4Form'

export default function Step4Page() {
  // 와이어프레임 단계: Step 4
  return (
    <main className="space-y-6">
      <WireframeHeader
        title="Step 4. 출발지 & 교통수단"
        backHref="/meetings/create/step-3"
      />
      <Step4Form />

      <div className="flex items-center justify-between">
        <Link
          href="/meetings/create/step-3"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
        >
          이전
        </Link>
        <Link
          href="/meetings/create/step-5"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          다음
        </Link>
      </div>
    </main>
  )
}
