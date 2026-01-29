// src/components/meeting/ParticipantList.tsx
// 1/28 리팩토링시 임시 값 넣어둠 
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ParticipantList() {
  return (
    <section className="space-y-4">
      {/* Header */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-[var(--text)]">참여자 목록</CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            참여자 정보를 불러오면 여기에서 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Empty / Loading */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)] px-4 py-5 text-center">
            <p className="text-sm text-[var(--text-subtle)]">
              아직 참여자 정보가 없습니다.
            </p>
            <p className="mt-1 text-xs text-[var(--text-subtle)]">
              참가자 초대 후 목록이 표시됩니다.
            </p>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
            <Skeleton className="h-10 w-full bg-[var(--neutral-soft)]" />
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
        <CardContent className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">참여자 초대</p>
            <p className="text-xs text-[var(--text-subtle)]">
              초대를 보내면 목록이 자동으로 업데이트됩니다.
            </p>
          </div>
          <Button
            type="button"
            className="bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            초대하기
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
