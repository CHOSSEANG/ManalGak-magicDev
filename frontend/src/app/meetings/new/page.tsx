// src/app/meetings/new/page.tsx

import StepNavigation from "@/components/layout/StepNavigation";
import StepCard from "@/components/meeting/StepCard";

const existingMeetings = [
  {
    id: "m-1024",
    title: "친구들과 친목모임",
    date: "2026.01.23 12:00",
    place: "서울시 어쩌구 저쩌동 12-34",
  },
  {
    id: "m-2048",
    title: "회사 점심 모임",
    date: "2026.02.02 13:00",
    place: "서울시 어쩌구 저쩌동 56-78",
  },
];

export default function CreateEntryPage() {
  // 와이어프레임 단계: 모임 생성 시작
  return (
    <>
      <main className="space-y-6 pb-28">
        <section className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">새 모임 생성하기</h1>
            <p className="text-sm text-[var(--wf-subtle)]">
              모임의 이름을 정하고, 설정을 시작해 주세요
            </p>
          </div>

          <StepCard className="space-y-2">
            <h2 className="text-base font-semibold">모임 이름</h2>
            <p className="text-xs text-[var(--wf-subtle)]">
              참여자들이 알아보기 쉬운 이름을 입력해 주세요
            </p>
            <input
              type="text"
              placeholder="예) 대학 동기 정기 모임"
              className="w-full rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] px-4 py-3 text-sm"
            />
          </StepCard>

          <div className="h-px w-full bg-[var(--wf-border)]" />

          <StepCard className="space-y-3">
            <h2 className="text-base font-semibold">기존 모임에서 시작하기</h2>
            <p className="text-xs text-[var(--wf-subtle)]">
              이전 모임을 불러와 빠르게 생성할 수 있어요
            </p>

            <div className="space-y-3">
              {existingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4 space-y-2"
                >
                  <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{meeting.title}</p>
                      <p className="text-xs text-[var(--wf-subtle)]">
                        {meeting.date} · 5명
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="rounded-lg bg-[var(--wf-accent)] px-3 py-1 text-xs font-medium text-white">
                        수정
                      </button>
                      <button className="rounded-lg bg-[var(--wf-accent)] px-3 py-1 text-xs font-medium text-white">
                        복사
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--wf-subtle)]">
                    {meeting.place}
                  </p>
                </div>
              ))}
            </div>
          </StepCard>
        </section>
      </main>

      <StepNavigation
        prevHref="/auth/kakao/callback"
        nextHref="/meetings/new/step1-date"
      />
    </>
  );
}
