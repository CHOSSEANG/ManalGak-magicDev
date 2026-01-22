// src/components/member/MemberStatusSelect.tsx
"use client";

import { MemberStatus } from "../meeting/Step2/Step2MemberList";

const statusOptions: { value: MemberStatus; label: string }[] = [
  { value: "CONFIRMED", label: "확정" },
  { value: "INVITED", label: "대기" },
  { value: "DECLINED", label: "미참여" },
];

interface Props {
  value: MemberStatus;
  onChange: (status: MemberStatus) => void;
  disabled?: boolean;
}

export default function MemberStatusSelect({
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as MemberStatus)}
      disabled={disabled}
      className="rounded-lg border border-[var(--wf-border)] bg-[var(--wf-surface)] px-2 py-1 text-xs"
    >
      {statusOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
