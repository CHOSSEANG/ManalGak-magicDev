// src/components/common/MeetingAccessBoundary.tsx
"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LoginRequired from "@/components/common/LoginRequired";

interface MeetingAccessBoundaryProps {
  meetingUuid?: string | null;
  loading: boolean;
  user: unknown;
  redirectStep?: string;
  children: ReactNode;
}

export default function MeetingAccessBoundary({
  meetingUuid,
  loading,
  user,
  redirectStep = "/meetings/new/step1-basic",
  children,
}: MeetingAccessBoundaryProps) {
  const router = useRouter();

  // 1️⃣ meetingUuid 없음
  if (!meetingUuid) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md border-[var(--border)] bg-[var(--bg-soft)] shadow-none">
          <CardHeader>
            <CardTitle className="text-[var(--text)]">
              아직 모임이 없어요
            </CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              Step1에서 모임을 생성해야 다음 단계를 진행할 수 있어요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
              onClick={() => router.push(redirectStep)}
            >
              Step1로 이동
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  // 2️⃣ loading
  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-20">
        <Skeleton className="h-24 w-full rounded-xl bg-[var(--neutral-soft)]" />
        <Skeleton className="h-40 w-full rounded-xl bg-[var(--neutral-soft)]" />
      </div>
    );
  }

  // 3️⃣ 로그인 안됨
  if (!user) {
    const currentUrl = `/meetings/new/step2-meetingmembers?meetingUuid=${meetingUuid}&readonly=true`;
    if (typeof window !== "undefined") {
      localStorage.setItem("loginRedirect", currentUrl);
    }
    return <LoginRequired />;
  }

  // 4️⃣ 정상 접근
  return <>{children}</>;
}
