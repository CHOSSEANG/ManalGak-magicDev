// src/components/common/CompletedMeetingNotice.tsx
"use client";

import { useRouter } from "next/navigation";

interface Props {
  meetingUuid: string;
}

export default function CompletedMeetingNotice({ meetingUuid }: Props) {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="max-w-md w-full bg-white border rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">📌 이미 확정된 모임입니다</h1>
        <p className="text-gray-600 mb-6">
          확정된 모임은 내용만 조회할 수 있습니다.
        </p>
        <button
          onClick={() =>
            router.push(`/meetings/${meetingUuid}/complete`)
          }
          className="px-6 py-3 bg-[var(--wf-accent)] text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          확정내용 보러가기
        </button>
      </div>
    </main>
  );
}
