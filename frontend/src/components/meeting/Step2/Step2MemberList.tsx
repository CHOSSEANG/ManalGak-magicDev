"use client";

import { useState } from "react";
// import MemberSummaryGrid from "@/components/member/MemberSummaryGrid";
import MemberStatusList from "@/components/member/MemberStatusList";

export type MemberStatus = "confirmed" | "pending" | "invited";

export interface Member {
  id: string;
  name: string;
  status: MemberStatus;
  // build: optional nickname used by MemberStatusList
  nickname?: string;
}

const initialMembers: Member[] = [
  { id: "u1", name: "김철수", status: "confirmed" },
  { id: "u2", name: "이름각", status: "pending" },
  { id: "u3", name: "이름각", status: "confirmed" },
  { id: "u4", name: "이름각", status: "invited" },
  { id: "u5", name: "이름각", status: "pending" },
];

export default function MemberList() {
  const [members, setMembers] = useState<Member[]>(initialMembers);

  const handleStatusChange = (id: string, status: MemberStatus) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  return (
    <div className="space-y-2">
      {/* 미노출 <MemberSummaryGrid members={members} /> */}
      <MemberStatusList members={members} onStatusChange={handleStatusChange} />
    </div>
  );
}
