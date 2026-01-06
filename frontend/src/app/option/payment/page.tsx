// src/app/option/payment/page.tsx

import Link from 'next/link'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'

export default function OptionPaymentPage() {
  // 와이어프레임 단계: 옵션 2
  return (
    <WireframeShell>
      <main className="space-y-6">
        <WireframeAppHeader />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">옵션 2. 회비 관리</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            회비 금액 입력 및 카카오페이 링크 placeholder
          </p>
        </div>

        <WireframeCard className="space-y-4">
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

        <Link
          href="/create/complete"
          className="inline-flex items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-3 text-sm font-semibold"
        >
          완료 화면으로
        </Link>
      </main>
    </WireframeShell>
  )
}
