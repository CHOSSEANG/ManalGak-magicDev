// src/app/error.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm border-[var(--border)] bg-[var(--bg)]">
        <CardContent className="space-y-4 py-8 text-center">
          <h1 className="text-lg font-semibold text-[var(--text)]">
            문제가 발생했어요
          </h1>

          <p className="text-sm text-[var(--text-subtle)]">
            일시적인 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해 주세요.
          </p>

          <Button
            type="button"
            onClick={() => router.replace("/meetings/new")}
            className="w-full"
          >
            모임 리스트로 이동
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
