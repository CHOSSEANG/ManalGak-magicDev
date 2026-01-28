// src/components/meeting/Step3/TravelTimeSection.tsx
'use client'

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

interface MemberTravel {
  name: string
  minutes: number
  transfers: number
}

export default function TravelTimeSection({
  members,
}: {
  members: MemberTravel[]
}): JSX.Element {
  return (
    <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
      {/* Section Header */}
      <CardHeader className="space-y-1">
        <CardTitle className="text-base text-[var(--text)]">
          이동 시간
        </CardTitle>
        <CardDescription className="text-[var(--text-subtle)]">
          각 멤버 기준 예상 이동 시간입니다.
        </CardDescription>
      </CardHeader>

      {/* Travel Time Grid */}
      <CardContent>
        {members.length === 0 && (
          <div className="flex items-center justify-center py-8 text-sm text-[var(--text-subtle)]">
            이동 시간 정보가 아직 없어요.
          </div>
        )}

        {members.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {members.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-center"
              >
                <p className="text-xs font-medium text-[var(--text)]">
                  {member.name}
                </p>

                <p className="mt-1 text-lg font-semibold text-[var(--text)]">
                  {member.minutes}분
                </p>

                <p className="mt-0.5 text-[11px] text-[var(--text-subtle)]">
                  환승 {member.transfers}회
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
