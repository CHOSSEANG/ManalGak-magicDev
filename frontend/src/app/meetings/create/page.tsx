import Link from 'next/link'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeHeader from '@/components/wireframe/WireframeHeader'

const existingMeetings = [
  {
    id: 'm-1024',
    title: '친구들과 친목모임',
    date: '2026.01.23 12:00',
    place: '서울시 어쩌구 저쩌동 12-34',
  },
  {
    id: 'm-2048',
    title: '회사 점심 모임',
    date: '2026.02.02 13:00',
    place: '서울시 어쩌구 저쩌동 56-78',
  },
]

export default function CreateEntryPage() {
  // 와이어프레임 단계: 모임 생성 시작
  return (
    <main className="space-y-6">
      <WireframeHeader title="모임 생성" backHref="/" />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">선택 카드</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <WireframeCard className="space-y-3">
            <h3 className="text-base font-semibold">새 모임 만들기</h3>
            <p className="text-sm text-[var(--wf-subtle)]">
              단계별 플로우로 모임 정보를 입력합니다.
            </p>
            <Link
              href="/meetings/create/step-1"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-4 py-2 text-sm font-semibold"
            >
              모임 생성 시작
            </Link>
          </WireframeCard>

          <WireframeCard className="space-y-3">
            <h3 className="text-base font-semibold">기존 모임 선택</h3>
            <p className="text-sm text-[var(--wf-subtle)]">
              최근 모임을 불러와 수정하거나 복사합니다.
            </p>
            <div className="space-y-3">
              {existingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{meeting.title}</p>
                      <p className="text-xs text-[var(--wf-subtle)]">
                        {meeting.date}
                      </p>
                      <p className="text-xs text-[var(--wf-subtle)]">
                        {meeting.place}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/meetings/${meeting.id}`}
                        className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
                      >
                        선택
                      </Link>
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
                      >
                        복사
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </WireframeCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">옵션 단계</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <WireframeCard className="space-y-2">
            <p className="text-sm font-semibold">옵션 1. 실시간 위치 공유</p>
            <p className="text-xs text-[var(--wf-subtle)]">
              토글 UI만 제공 (추적 기능 없음)
            </p>
            <Link
              href="/meetings/create/option-location"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-2 text-xs"
            >
              옵션 설정
            </Link>
          </WireframeCard>
          <WireframeCard className="space-y-2">
            <p className="text-sm font-semibold">옵션 2. 회비 관리</p>
            <p className="text-xs text-[var(--wf-subtle)]">
              회비 금액 입력 및 카카오페이 링크 placeholder
            </p>
            <Link
              href="/meetings/create/option-fee"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-2 text-xs"
            >
              옵션 설정
            </Link>
          </WireframeCard>
        </div>
      </section>
    </main>
  )
}
