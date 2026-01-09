// src/components/member/MemberStatusList.tsx
import StepCard from '@/components/meeting/StepCard'
import { Member, MemberStatus } from '@/components/meeting/Step3/Step3MemberList'
import MemberStatusSelect from '@/components/member/MemberStatusSelect'

interface Props {
  members: Member[]
  onStatusChange: (id: string, status: MemberStatus) => void
}

export default function MemberStatusList({
  members,
  onStatusChange,
}: Props) {
  return (
    <StepCard className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">멤버 상태 변경</h2>
        <button
          type="button"
          className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-3 py-1 text-xs"
        >
          멤버 추가
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-3"
          >
            <div className="h-10 w-10 rounded-full bg-[var(--wf-border)]" />

            <div className="flex-1">
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-xs text-[var(--wf-subtle)]">
                관리자 기준 상태 변경 가능
              </p>
            </div>

            <MemberStatusSelect
              value={member.status}
              onChange={(status) =>
                onStatusChange(member.id, status)
              }
            />
          </div>
        ))}
      </div>
    </StepCard>
  )
}
