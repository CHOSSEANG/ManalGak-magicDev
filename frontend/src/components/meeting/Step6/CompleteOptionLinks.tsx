// src/components/meeting/CompleteOptionLinks.tsx
"use client";

import Link from "next/link";
import StepCard from "@/components/meeting/StepCard";

interface Props {
  meetingId: string;
}

export default function CompleteOptionLinks({ meetingId }: Props) {
  return (
    <StepCard className="space-y-3">
      <p className="text-sm font-semibold">옵션 페이지</p>

      <div className="flex w-full gap-3">
        <Link
          href={`/meetings/${meetingId}/option-location`}
          className="w-1/2 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-4 text-sm hover:bg-[var(--wf-accent)]"
        >
          옵션 1. 실시간 위치 공유
        </Link>

        <Link
          href={`/meetings/${meetingId}/option-fee`}
          className="w-1/2 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] px-4 py-4 text-sm hover:bg-[var(--wf-accent)]"
        >
          옵션 2. 회비 관리
        </Link>
      </div>
    </StepCard>
  );
}
