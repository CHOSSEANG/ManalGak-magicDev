// src/components/common/CompletedMeetingNotice.tsx
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  meetingUuid: string;
}

export default function CompletedMeetingNotice({ meetingUuid }: Props) {
  const router = useRouter();

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md text-center border-[var(--border)] bg-[var(--bg-soft)] shadow-md">
        <CardHeader className="space-y-3">
          {/* 아이콘 */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>

          <CardTitle className="text-lg font-semibold text-[var(--text)]">
            이미 확정된 모임입니다
          </CardTitle>

          <CardDescription className="text-sm leading-relaxed text-[var(--text-subtle)]">
            확정된 모임은 수정할 수 없으며
            <br />
            내용만 조회할 수 있어요.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <Button
            onClick={() =>
              router.push(`/meetings/${meetingUuid}/complete`)
            }
            className="w-full gap-2 rounded-xl bg-[var(--primary)] py-5 text-[var(--primary-foreground)]"
          >
            확정된 모임 보러가기
          </Button>

          <p className="mt-3 text-xs text-[var(--text-subtle)]">
            모임 결과를 확인해보세요 🙂
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
