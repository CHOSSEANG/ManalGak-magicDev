// src/components/member/MemberStatusList.tsx
"use client";

import { useMemo } from "react";
import StepCard from "@/components/meeting/StepCard";
import MemberStatusSelect from "@/components/member/MemberStatusSelect";
import { Member, MemberStatus } from "../meeting/Step2/Step2MemberList";

interface Props {
  members: Member[];
  onStatusChange: (id: string, status: MemberStatus) => void;
}

interface KakaoUser {
  name: string;
  profileImage?: string;
}

export default function MemberStatusList({
  members,
  onStatusChange,
}: Props) {
  /**
   * ✅ 카카오 로그인 사용자 정보 (로컬 기준)
   * - HamburgerMenu와 동일한 저장 포맷 사용
   */
  const kakaoUser = useMemo<KakaoUser | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem("user");
    if (!stored) return null;

    try {
      return JSON.parse(stored) as KakaoUser;
    } catch {
      return null;
    }
  }, []);

  /**
   * ✅ members[0] = 나
   * 카카오 로그인 되어 있으면 name을 덮어쓴다
   */
  const myMember: Member | undefined = useMemo(() => {
    if (!members[0]) return undefined;

    if (!kakaoUser?.name) return members[0];

    return {
      ...members[0],
      name: kakaoUser.name,
    };
  }, [members, kakaoUser]);

  const otherMembers = members.slice(1);

  return (
    <StepCard className="space-y-4">
      <h2 className="text-sm font-semibold">참여자 리스트</h2>

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
              className="flex-1 rounded-md border border-[var(--wf-border)] bg-[var(--wf-surface)] px-2 py-1 outline-none"
            />
            <button className="rounded-md border border-[var(--wf-border)] px-2 py-1">
              저장
            </button>
          </div>
        </div>
      )}

      {/* 구분선 */}
      <div className="border-t border-[var(--wf-border)]" />

      {/* 2️⃣ 참여 멤버 */}
      <div className="grid gap-3  grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {otherMembers.map((member) => (
          <div
            key={member.id}
            className="space-y-1 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-3"
          >
            {/* 1줄 */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--wf-border)]" />
              <p className="flex-1 text-sm font-semibold">
                {member.name}
              </p>

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
              {member.nickname && `· ${member.nickname}`}
            </div>
          </div>
        ))}
      </div>
    </StepCard>
  );
}
