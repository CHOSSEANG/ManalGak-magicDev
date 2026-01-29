// src/components/meeting/MemberStatusList.tsx
"use client";

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { Member } from "../meeting/Step2/Step2MemberList";
import { TransportMode } from "../meeting/Step2/Step2MemberList";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  members: Member[];
  currentUserId: number;
  onPersonalChange: (participantId: number, nickname?: string) => void;
}

const transportLabelMap: Record<TransportMode, string> = {
  CAR: "자동차",
  PUBLIC: "대중교통",
};

const transportIconMap: Record<TransportMode, string> = {
  CAR: "🚗",
  PUBLIC: "🚌",
};

export default function MemberStatusList({ members, onPersonalChange }: Props) {
  const myMember = members[0];
  const otherMembers = useMemo(() => members.slice(1), [members]);

  const [myNickname, setMyNickname] = useState("");

  // members 변경 시 내 상태 동기화
  useEffect(() => {
    if (!myMember) return;
    setMyNickname(myMember.nickname || "");
  }, [myMember]);

  let mySection: ReactNode = null;
  if (myMember) {
    let myAvatar: ReactNode = (
      <div className="h-10 w-10 rounded-full bg-[var(--neutral-soft)]" />
    );
    if (myMember.profileImageUrl) {
      myAvatar = (
        <Image
          src={myMember.profileImageUrl}
          alt={myMember.name}
          width={48}
          height={48}
          className="h-10 w-10 rounded-full object-cover"
        />
      );
    }

    let myTransport: ReactNode = null;
    if (myMember.originAddress && myMember.transport) {
      myTransport = (
        <div className="mt-1 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-[var(--neutral-soft)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
            {transportIconMap[myMember.transport as TransportMode]}{" "}
            {transportLabelMap[myMember.transport as TransportMode]}
          </div>
          <div className="text-xs text-[var(--text-subtle)]">
            {myMember.originAddress}
          </div>
        </div>
      );
    }

    mySection = (
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[var(--text)]">
            내 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            {myAvatar}
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--text)]">
                {myMember.name}
              </p>
              {myTransport}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--text-subtle)]">닉네임 설정 :</span>
            <input
              type="text"
              placeholder="미입력 시 이름으로 표시"
              value={myNickname}
              onChange={(e) => setMyNickname(e.target.value)}
              className="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[var(--text)] outline-none"
            />
            <Button
              type="button"
              variant="outline"
              className="border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              onClick={() =>
                onPersonalChange(myMember.participantId, myNickname)
              }
            >
              저장
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  let othersSection: ReactNode = null;
  if (otherMembers.length > 0) {
    othersSection = (
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[var(--text)]">
            다른 참여자
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {otherMembers.map((member) => {
            let memberAvatar: ReactNode = (
              <div className="h-10 w-10 rounded-full bg-[var(--neutral-soft)]" />
            );
            if (member.profileImageUrl) {
              memberAvatar = (
                <Image
                  src={member.profileImageUrl}
                  alt={member.name}
                  width={48}
                  height={48}
                  className="h-10 w-10 rounded-full object-cover"
                />
              );
            }

            let memberTransport: ReactNode = null;
            if (member.originAddress && member.transport) {
              memberTransport = (
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-[var(--neutral-soft)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
                    {transportIconMap[member.transport as TransportMode]}{" "}
                    {transportLabelMap[member.transport as TransportMode]}
                  </div>
                  <div className="text-xs text-[var(--text-subtle)]">
                    {member.originAddress}
                  </div>
                </div>
              );
            }

            let nicknameLine: ReactNode = null;
            if (member.nickname) {
              nicknameLine = (
                <div className="text-xs text-[var(--text-subtle)]">
                  · {member.nickname}
                </div>
              );
            }

            return (
              <div
                key={member.id}
                className="space-y-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3"
              >
                <div className="flex items-center gap-3">
                  {memberAvatar}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text)]">
                      {member.name}
                    </p>
                    {memberTransport}
                  </div>
                </div>
                {nicknameLine}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-[var(--text)]">
            참여자 리스트
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-[var(--text-subtle)]">
          참여자 정보와 교통수단을 확인할 수 있습니다.
        </CardContent>
      </Card>

      {mySection}
      {othersSection}
    </div>
  );
}
