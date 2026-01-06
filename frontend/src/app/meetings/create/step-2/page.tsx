import Link from 'next/link'
import SingleSelectGrid from '@/components/wireframe/SingleSelectGrid'
import WireframeHeader from '@/components/wireframe/WireframeHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'

const purposes = [
  '친구',
  '가족',
  '회사',
  '대학',
  '운동',
  '번개',
  '조찬',
  '만찬',
  '디너',
  '연말',
  '신년',
  '명절',
]

export default function Step2Page() {
  // 와이어프레임 단계: Step 2
  return (
    <main className="space-y-6">
      <WireframeHeader title="Step 2. 모임 목적" backHref="/meetings/create/step-1" />
      <WireframeCard className="space-y-4">
        <h2 className="text-base font-semibold">모임 목적 선택</h2>
        <SingleSelectGrid
          items={purposes}
          initial="친구"
          helperText="단일 선택만 가능합니다."
        />
      </WireframeCard>

      <div className="flex items-center justify-between">
        <Link
          href="/meetings/create/step-1"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-6 py-3 text-sm"
        >
          이전
        </Link>
        <Link
          href="/meetings/create/step-3"
          className="rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
        >
          다음
        </Link>
      </div>
    </main>
  )
}
