import Link from 'next/link'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeHeader from '@/components/wireframe/WireframeHeader'

export default function OptionFeePage() {
  // 와이어프레임 단계: 옵션 2
  return (
    <main className="space-y-6">
      <WireframeHeader title="옵션 2. 회비 관리" backHref="/meetings/create" />
      <WireframeCard className="space-y-4">
        <p className="text-sm text-[var(--wf-subtle)]">
          회비 금액 입력과 카카오페이 링크 placeholder.
        </p>
        <div className="space-y-2">
          <label className="text-sm font-semibold" htmlFor="fee">
            회비 금액
          </label>
          <input
            id="fee"
            type="text"
            placeholder="예: 15,000"
            className="w-full rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-3 text-sm"
          />
        </div>
        <div className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-3 text-sm">
          카카오페이 링크 placeholder
        </div>
      </WireframeCard>

      <div className="flex justify-end">
        <Link
          href="/meetings/create/step-5"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          Step 5로 돌아가기
        </Link>
      </div>
    </main>
  )
}
