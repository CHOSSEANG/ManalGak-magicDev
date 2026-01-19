// src/components/member/MemberStatusList.tsx
import StepCard from "@/components/meeting/StepCard";
import MemberStatusSelect from "@/components/member/MemberStatusSelect";
import { Member, MemberStatus } from "../meeting/Step2/Step2MemberList";

interface Props {
  members: Member[];
  onStatusChange: (id: string, status: MemberStatus) => void;
}

export default function MemberStatusList({ members, onStatusChange }: Props) {
  const myMember = members[0];
  const otherMembers = members.slice(1);

  return (
    <StepCard className="space-y-4">
      <h2 className="text-sm font-semibold">멤버 상태 조회</h2>

      {/* 1️⃣ 내 설정 */}
      {myMember && (
        <div className="space-y-2 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-3">
          {/* 1줄 */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--wf-border)]" />

            <p className="flex-1 text-sm font-semibold">
              {myMember.name}
            </p>

            <label className="flex items-center gap-1 text-xs">
              <input type="checkbox" />
              핸디캡
            </label>

            <MemberStatusSelect
              value={myMember.status}
              onChange={(status) =>
                onStatusChange(myMember.id, status)
              }
            />
          </div>

          {/* 2줄 */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--wf-subtle)]">
              닉네임 설정 :
            </span>
            <input
              type="text"
              placeholder="미입력 시 이름으로 표시"
              className="flex-1 rounded-md border border-[var(--wf-border)] bg-transparent px-2 py-1 outline-none"
            />
            <button className="rounded-md border border-[var(--wf-border)] px-2 py-1">
              저장
            </button>
          </div>
        </div>
      )}

      {/* 구분선 */}
      <div className="border-t border-[var(--wf-border)]" />

      {/* 2️⃣ 멤버 설정 공간 */}
      <div className="grid grid-cols-2 gap-3">
        {otherMembers.map((member) => (
          <div
            key={member.id}
            className="space-y-1 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-3"
          >
            {/* 1줄 */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--wf-border)]" />

              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" />
                핸디캡
              </label>

              <MemberStatusSelect
                value={member.status}
                onChange={(status) =>
                  onStatusChange(member.id, status)
                }
              />
            </div>

            {/* 2줄 */}
            <div className="pl-13 text-xs text-[var(--wf-subtle)]">
              {member.name}
              {member.nickname && ` · ${member.nickname}`}
            </div>
          </div>
        ))}
      </div>
    </StepCard>
  );
}
