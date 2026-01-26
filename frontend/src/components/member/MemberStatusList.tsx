"use client";

import React, { useEffect, useMemo, useState } from "react";
import StepCard from "@/components/meeting/StepCard";
import { Member } from "../meeting/Step2/Step2MemberList";

interface Props {
  members: Member[];
  currentUserId: number;
  onPersonalChange: (participantId: number, nickname?: string) => void;
}

export default function MemberStatusList({ members, onPersonalChange }: Props) {
  const myMember = members[0];
  const otherMembers = useMemo(() => members.slice(1), [members]);

  const [myNickname, setMyNickname] = useState("");

  // members 변경 시 내 상태 동기화
  useEffect(() => {
    if (!myMember) return;
    setMyNickname(myMember.nickname || "");
  }, [myMember]);

  return (
    <StepCard className="space-y-4">
      <h2 className="text-sm font-semibold">참여자 리스트</h2>

      {/* 내 설정 */}
      {myMember && (
        <div className="space-y-2 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-3">
          <div className="flex items-center gap-3">
            {myMember.profileImageUrl ? (
              <img
                src={myMember.profileImageUrl}
                alt={myMember.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[var(--wf-border)]" />
            )}

            <p className="flex-1 text-sm font-semibold">{myMember.name}</p>
          </div>

          {/* 닉네임 설정 */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--wf-subtle)]">닉네임 설정 :</span>
            <input
              type="text"
              placeholder="미입력 시 이름으로 표시"
              value={myNickname}
              onChange={(e) => setMyNickname(e.target.value)}
              className="flex-1 rounded-md border border-[var(--wf-border)] bg-[var(--wf-surface)] px-2 py-1 outline-none"
            />
            <button
              className="rounded-md border border-[var(--wf-border)] px-2 py-1 hover:bg-[var(--wf-surface)]"
              onClick={() =>
                onPersonalChange(myMember.participantId, myNickname)
              }
            >
              저장
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-[var(--wf-border)]" />

      {/* 다른 멤버 */}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {otherMembers.map((member) => {
          return (
            <div
              key={member.id}
              className="space-y-1 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-3"
            >
              <div className="flex items-center gap-3">
                {member.profileImageUrl ? (
                  <img
                    src={member.profileImageUrl}
                    alt={member.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[var(--wf-border)]" />
                )}

                <p className="flex-1 text-sm font-semibold">{member.name}</p>
              </div>

              <div className="pl-13 text-xs text-[var(--wf-subtle)]">
                {member.nickname && `· ${member.nickname}`}
              </div>
            </div>
          );
        })}
      </div>
    </StepCard>
  );
}
