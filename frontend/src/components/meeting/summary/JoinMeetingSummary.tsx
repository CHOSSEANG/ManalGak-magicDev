// src/components/meeting/JoinMeetingSummary.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

interface Props {
  meetingId: string
}

export default function JoinMeetingSummary({ meetingId }: Props) {
  // TODO: meetingId로 step1, step2 데이터 fetch
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- meetingId reserved for fetch
  void meetingId

  return (
    <div className="space-y-4">
      {/* Step 1 요약 */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-[var(--text)]">
            Step 1. 모임 정보
          </CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            모임의 날짜와 시간을 미리 확인해 주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-subtle)]">모임 이름</span>
              <span className="font-medium text-[var(--text)]">모임 이름 예시</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-subtle)]">날짜</span>
              <span className="font-medium text-[var(--text)]">2026.01.20</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-subtle)]">시간</span>
              <span className="font-medium text-[var(--text)]">오후 7:00</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-subtle)]">날씨</span>
              <span className="font-medium text-[var(--text)]">☀️ 맑음</span>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)] p-4">
            <p className="text-xs text-[var(--text-subtle)]">
              실제 데이터가 로딩되면 최신 일정 정보가 표시됩니다.
            </p>
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-32 bg-[var(--neutral-soft)]" />
              <Skeleton className="h-4 w-40 bg-[var(--neutral-soft)]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2 요약 */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-[var(--text)]">
            Step 2. 모임 목적
          </CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            이 모임은 아래 목적을 기준으로 장소가 추천돼요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
            <span className="inline-block rounded-full bg-[var(--neutral-soft)] px-3 py-1 text-sm font-medium text-[var(--text)]">
              🍽 식사 / 친목
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">다음 단계</p>
              <p className="text-xs text-[var(--text-subtle)]">
                위치 추천 결과를 확인하세요.
              </p>
            </div>
            <Button
              type="button"
              className="bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              결과 보기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
