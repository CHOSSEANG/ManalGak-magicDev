import Link from 'next/link'
import WireframeHeader from '@/components/wireframe/WireframeHeader'
import Step1Form from '@/components/wireframe/Step1Form'

export default function Step1Page() {
  // 와이어프레임 단계: Step 1
  return (
    <main className="space-y-6">
      <WireframeHeader title="Step 1. 날짜/시간 선택" backHref="/meetings/create" />
      <p className="text-sm text-[var(--wf-subtle)]">
        달력 모달과 시간 선택 UI를 확인합니다.
      </p>

      <Step1Form />

      <div className="flex justify-end">
        <Link
          href="/meetings/create/step-2"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          다음
        </Link>
      </div>
    </main>
  )
}
