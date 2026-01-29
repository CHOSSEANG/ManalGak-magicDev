// src/components/member/MemberSummaryGrid.tsx
import StepCard from "@/components/meeting/StepCard";
import { Member } from "../meeting/Step2/Step2MemberList";

// shadcn/ui
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  members: Member[];
}

export default function MemberSummaryGrid({ members }: Props) {
  return (
    <StepCard className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text)]">
          참여 멤버
        </h2>
        <span className="text-xs text-[var(--text-subtle)]">
          총 {members.length}인
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-wrap gap-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-[var(--neutral-soft)] text-[10px] text-[var(--text)]">
                {member.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>

            <span className="text-[10px] text-[var(--text)]">
              {member.name}
            </span>
          </div>
        ))}
      </div>
    </StepCard>
  );
}
