// src/app/meetings/none/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MeetingCompleteFallbackPage() {
  const router = useRouter();

  const handleGoStep1 = () => {
    router.push("/meetings/new/step1-basic");
  };

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md border border-[var(--border)] bg-[var(--bg)] p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold text-[var(--text)]">
            👋 아직 모임이 없어요
          </h1>
          <p className="text-sm text-[var(--text-subtle)]">
            먼저 Step1에서 모임을 생성해야 <br />
            서비스를 이용할 수 있습니다.
          </p>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            onClick={handleGoStep1}
            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            Step1로 이동
          </Button>
        </div>
      </Card>
    </main>
  );
}
