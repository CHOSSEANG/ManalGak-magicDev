// src/app/meetings/none/page.tsx
"use client";

import { useRouter } from "next/navigation";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MeetingNonePage(): JSX.Element {
  const router = useRouter();

  const handleGoStep1 = (): void => {
    router.push("/meetings/new/step1-basic");
  };

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <Card className="w-full max-w-md border-[var(--border)] bg-[var(--bg-soft)]">
        {/* Empty Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-[var(--text)]">
            아직 모임이 없어요
          </CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            모임을 먼저 생성해야 <br />
            만날각 서비스를 이용할 수 있어요.
          </CardDescription>
        </CardHeader>

        {/* CTA */}
        <CardContent>
          <Button
            type="button"
            onClick={handleGoStep1}
            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            Step1에서 모임 만들기
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
