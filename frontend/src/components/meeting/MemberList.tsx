// src/components/meeting/MemberList.tsx

"use client";

import { useState } from "react";
import StepCard from "@/components/meeting/StepCard";

const initialMembers = [
  { id: "u1", name: "이름각", status: "confirmed" },
  { id: "u2", name: "이름각", status: "pending" },
  { id: "u3", name: "이름각", status: "confirmed" },
  { id: "u4", name: "이름각", status: "invited" },
  { id: "u5", name: "이름각", status: "pending" },
];

const statusOptions = [
  { value: "confirmed", label: "확정" },
  { value: "pending", label: "대기" },
  { value: "invited", label: "초대" },
];

export default function MemberList() {
  const [members, setMembers] = useState(initialMembers);

  const handleStatusChange = (id: string, status: string) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, status } : member)),
    );
  };

  // 와이어프레임 단계: 멤버 관리 UI
  return (
    <div className="space-y-4">
      <StepCard className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">참여 확정 멤버</h2>
          <span className="text-xs text-[var(--wf-subtle)]">총 5인</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {members.map((member) => (
            <div
              key={`summary-${member.id}`}
              className={`flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-[var(--wf-border)] ${
                member.status === "confirmed"
                  ? "bg-[var(--wf-accent)]"
                  : "bg-[var(--wf-surface)]"
              }`}
            >
              <div className="h-6 w-6 rounded-full bg-[var(--wf-muted)]" />
              <span className="text-[10px]">{member.name}</span>
            </div>
          ))}
        </div>
      </StepCard>

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
              <select
                value={member.status}
                onChange={(event) =>
                  handleStatusChange(member.id, event.target.value)
                }
                className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-2 py-1 text-xs"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </StepCard>
    </div>
  );
}
