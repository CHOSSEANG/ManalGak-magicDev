interface Props {
  meetingId: string;
}

export default function JoinMeetingSummary({ meetingId }: Props) {
  // TODO: meetingId로 step1, step2 데이터 fetch
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- meetingId reserved for fetch
  void meetingId;

  return (
    <div className="space-y-8">
      {/* Step 1 요약 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Step 1. 모임 정보</h2>
        <p className="text-sm text-[var(--wf-subtle)]">
          모임의 날짜와 시간을 미리 확인해 주세요.
        </p>

        <div className="mt-4 rounded-xl border bg-white p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--wf-subtle)]">모임 이름</span>
            <span className="font-medium">모임 이름 예시</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-[var(--wf-subtle)]">날짜</span>
            <span className="font-medium">2026.01.20</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-[var(--wf-subtle)]">시간</span>
            <span className="font-medium">오후 7:00</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-[var(--wf-subtle)]">날씨</span>
            <span className="font-medium">☀️ 맑음</span>
          </div>
        </div>
      </section>

      {/* Step 2 요약 */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Step 2. 모임 목적</h2>
        <p className="text-sm text-[var(--wf-subtle)]">
          이 모임은 아래 목적을 기준으로 장소가 추천돼요.
        </p>

        <div className="mt-4 rounded-xl border bg-white p-4">
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium">
            🍽 식사 / 친목
          </span>
        </div>
      </section>
    </div>
  );
}
