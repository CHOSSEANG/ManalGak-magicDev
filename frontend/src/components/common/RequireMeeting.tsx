// src/components/common/RequireMeeting.tsx
"use client";

import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RequireMeeting(): JSX.Element {
  const router = useRouter();

  const handleGoStep1 = (): void => {
    router.push("/meetings/new/step1-basic");
  };

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <Card className="w-full max-w-md text-center border-[var(--border)] bg-[var(--bg-soft)] shadow-md">
        <CardHeader className="space-y-3">
          {/* 아이콘 */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)]">
            <CalendarPlus className="h-6 w-6 text-[var(--primary)]" />
          </div>

          <CardTitle className="text-lg font-semibold text-[var(--text)]">
            아직 모임이 없어요
          </CardTitle>

          <CardDescription className="text-sm leading-relaxed text-[var(--text-subtle)]">
            모임을 먼저 생성해야
            <br />
            만날각 서비스를 이용할 수 있어요.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <Button
            type="button"
            onClick={handleGoStep1}
            className="w-full gap-2 rounded-xl bg-[var(--primary)] py-5 text-[var(--primary-foreground)]"
          >
            <CalendarPlus className="h-4 w-4" />
            모임 만들기 시작하기
          </Button>

          <p className="mt-3 text-xs text-[var(--text-subtle)]">
             모임 준비, 지금 시작해요 🙂
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
