import Link from 'next/link'
import WireframeHeader from '@/components/wireframe/WireframeHeader'
import Step5PlacePicker from '@/components/wireframe/Step5PlacePicker'

export default function Step5Page() {
  // 와이어프레임 단계: Step 5
  return (
    <main className="space-y-6">
      <WireframeHeader
        title="Step 5. 중간지점 & 추천 장소"
        backHref="/meetings/create/step-4"
      />
      <Step5PlacePicker />

      <div className="flex items-center justify-between">
        <Link
          href="/meetings/create/step-4"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
        >
          이전
        </Link>
        <Link
          href="/meetings/m-1024"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          모임 확정
        </Link>
      </div>
    </main>
  )
}
