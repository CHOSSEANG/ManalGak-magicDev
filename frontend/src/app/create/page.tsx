// src/app/create/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import WireframeAppHeader from '@/components/wireframe/WireframeAppHeader'
import WireframeCard from '@/components/wireframe/WireframeCard'
import WireframeShell from '@/components/wireframe/WireframeShell'

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
  const router = useRouter()

  return (
    <WireframeShell>
      <main className="space-y-6 pb-28">
        <WireframeAppHeader />

        <section className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">새모임 생성하기</h1>
            <p className="text-sm text-[var(--wf-subtle)]">
              모임 명을 입력하고, 다음을 눌러 주세요
            </p>
          </div>

          <WireframeCard className="space-y-3">
            <h2 className="text-base font-semibold">모임 명 입력하기</h2>
            <input
              type="text"
              placeholder="친구들끼리 친목모임"
              className="w-full rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-3 text-sm"
            />
          </WireframeCard>

          <div className="h-px w-full bg-[var(--wf-border)]" />

          <WireframeCard className="space-y-3">
            <h2 className="text-base font-semibold">기존 모임 선택</h2>
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
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
                      >
                        수정
                      </button>
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
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 bg-transparent">
        <div className="mx-auto flex w-full max-w-[1440px] gap-3 px-4 py-4">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="w-1/2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-6 py-3 text-sm"
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => router.push('/create/step-1')}
            className="w-1/2 rounded-2xl border border-[var(--wf-border)] bg-[var(--wf-highlight)] px-6 py-3 text-sm font-semibold"
          >
            다음
          </button>
        </div>
      </div>
    </WireframeShell>
  )
}
