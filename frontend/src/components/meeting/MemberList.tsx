// src/components/meeting/MemberList.tsx
"use client";

import { useState } from "react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      prev.map((member) => (member.id === id ? { ...member, status } : member))
    );
  };

  // 와이어프레임 단계: 멤버 관리 UI
  return (
    <div className="space-y-4">
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-[var(--text)]">
              참여 확정 멤버
            </CardTitle>
            <span className="text-xs text-[var(--text-subtle)]">총 5인</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {members.map((member) => {
              let cardClass =
                "flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-[var(--border)]";
              if (member.status === "confirmed") {
                cardClass += " bg-[var(--neutral-soft)]";
              } else {
                cardClass += " bg-[var(--bg)]";
              }

              return (
                <div key={`summary-${member.id}`} className={cardClass}>
                  <div className="h-6 w-6 rounded-full bg-[var(--neutral-soft)]" />
                  <span className="text-[10px] text-[var(--text)]">
                    {member.name}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-[var(--text)]">
              멤버 상태 변경
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              className="border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)]"
            >
              멤버 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3"
            >
              <div className="h-10 w-10 rounded-full bg-[var(--neutral-soft)]" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">
                  {member.name}
                </p>
                <p className="text-xs text-[var(--text-subtle)]">
                  관리자 기준 상태 변경 가능
                </p>
              </div>
              <select
                value={member.status}
                onChange={(event) =>
                  handleStatusChange(member.id, event.target.value)
                }
                className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--text)]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
