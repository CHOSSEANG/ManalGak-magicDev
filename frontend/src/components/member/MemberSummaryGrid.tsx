// src/components/member/MemberSummaryGrid.tsx
import StepCard from '@/components/meeting/StepCard'
import { Member } from '@/components/meeting/Step3/Step3MemberList'

interface Props {
  members: Member[]
}

export default function MemberSummaryGrid({ members }: Props) {
  return (
    <StepCard className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">참여 확정 멤버</h2>
        <span className="text-xs text-[var(--wf-subtle)]">
          총 {members.length}인
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {members.map((member) => (
          <div
            key={member.id}
            className={`flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-[var(--wf-border)]
              ${
                member.status === 'confirmed'
                  ? 'bg-[var(--wf-accent)]'
                  : 'bg-[var(--wf-surface)]'
              }`}
          >
            <div className="h-6 w-6 rounded-full bg-[var(--wf-muted)]" />
            <span className="text-[10px]">{member.name}</span>
          </div>
        ))}
      </div>
    </StepCard>
  )
}
