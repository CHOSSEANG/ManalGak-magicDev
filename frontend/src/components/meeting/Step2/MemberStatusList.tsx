// src/components/meeting/Step2/MemberStatusList.tsx
"use client";

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { Member } from "./Step2MemberList";
// import { TransportMode } from "./Step2MemberList";
import { Input } from "@/components/ui/input";

// shadcn/ui
import { Button } from "@/components/ui/button";

interface Props {
  members: Member[];
  currentUserId: number;
  onPersonalChange: (participantId: number, nickname?: string) => void;
}

// const transportLabelMap: Record<TransportMode, string> = {
//   CAR: "자동차",
//   PUBLIC: "대중교통",
// };

// const transportIconMap: Record<TransportMode, string> = {
//   CAR: "🚗",
//   PUBLIC: "🚌",
// };

export default function MemberStatusList({
  members,
  currentUserId,
  onPersonalChange,
}: Props) {
  const myMember = useMemo(
  () => members.find((m) => m.id === currentUserId.toString()),
  [members, currentUserId]
);

const otherMembers = useMemo(
  () => members.filter((m) => m.id !== currentUserId.toString()),
  [members, currentUserId]
);

  const [myNickname, setMyNickname] = useState("");

  // members 변경 시 내 상태 동기화
  useEffect(() => {
    if (!myMember) return;
    setMyNickname(myMember.nickname || "");
  }, [myMember]);

  let mySection: ReactNode = null;
  if (myMember) {
    let myAvatar: ReactNode = (
      <div className="h-10 w-10 rounded-xl bg-[var(--neutral-soft)]" />
    );
    if (myMember.profileImageUrl) {
      myAvatar = (
        <Image
          src={myMember.profileImageUrl}
          alt={myMember.name}
          width={96}
          height={96}
          className="h-20 w-20 rounded-xl object-cover"
        />
      );
    }

    //
    // let myTransport: ReactNode = null;
    // if (myMember.originAddress && myMember.transport) {
    //   myTransport = (
    //     <div className="mt-1 flex items-center gap-2">
    //       <div className="flex items-center gap-1 rounded-full bg-[var(--neutral-soft)] px-3 py-1 text-xs font-semibold text-[var(--text)]">
    //         {transportIconMap[myMember.transport as TransportMode]}{" "}
    //         {transportLabelMap[myMember.transport as TransportMode]}
    //       </div>
    //       <div className="text-xs text-[var(--text-subtle)]">
    //         {myMember.originAddress}
    //       </div>
    //     </div>
    //   );
    // }

    mySection = (
      <div className="border-y border-[var(--border)] bg-[var(--bg-soft)] p-4 rounded-xl space-y-4">
  {/* ===== 상단: 내 프로필 ===== */}
  <div className="flex items-center gap-4">
    {/* ✅ 프로필 이미지 크게 */}
    
      {myAvatar}
    

    {/* 기존 이름 (고정 표시) */}
    <div className="flex-1">
      <p className="text-base font-semibold text-[var(--text)]">
        {myMember.name}
      </p>
      <p className="text-xs text-[var(--text-subtle)]">
        현재 내 이름
      </p>
    </div>
  </div>

  {/* ===== 하단: 닉네임 수정 ===== */}
  <div className="flex items-center gap-2">
    <span className="inline-block w-20 text-center text-base text-[var(--text-subtle)] whitespace-nowrap">
      닉네임
    </span>

    <Input
      type="text"
      placeholder="필요시 닉네임을 입력하세요"
      value={myNickname}
      onChange={(e) => setMyNickname(e.target.value)}
      className="h-11 flex-1 rounded-xl"
    />

    <Button
      type="button"
      variant="outline"
      className="
        h-11
        px-8
        rounded-xl
        border-[var(--border)]
        bg-[var(--primary)]
        text-[var(--primary-soft)]
        shrink-0
      "
      onClick={() =>
        onPersonalChange(myMember.participantId, myNickname)
      }
    >
      저장
    </Button>
  </div>
</div>
    );
  }

let othersSection: ReactNode = null;
if (otherMembers.length > 0) {
  othersSection = (
    <div>
      <div
        className="
          grid
          grid-cols-4
          md:grid-cols-4
          lg:grid-cols-5
          gap-2
        "
      >
        {otherMembers.map((member) => {
          const avatar = member.profileImageUrl ? (
            <Image
              src={member.profileImageUrl}
              alt={member.name}
              width={96}
              height={96}
              className="aspect-square w-full rounded-xl object-cover"
            />
          ) : (
            <div className="aspect-square w-full rounded-xl bg-[var(--neutral-soft)]" />
          );

          return (
            <div
              key={member.id}
              className="flex flex-col items-center gap-1"
            >
              {avatar}

              <p className="text-sm font-medium text-[var(--text)] text-center">
                {member.name}
              </p>

              {member.nickname && (
                <p className="text-xs text-[var(--text-subtle)] text-center">
                  {member.nickname}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


  return (
    <div className="space-y-4">
      

      {mySection}
      {othersSection}
    </div>
  );
}
