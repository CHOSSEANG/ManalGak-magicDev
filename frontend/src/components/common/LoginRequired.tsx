// src/components/common/LoginRequired.tsx
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

export default function LoginRequired(): JSX.Element {
  const router = useRouter();

  const handleGoLogin = (): void => {
    router.push("/");
  };

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <Card className="w-full max-w-md border-[var(--border)] bg-[var(--bg-soft)]">
        {/* Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-[var(--text)]">
            로그인이 필요해요
          </CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            서비스를 이용하려면 <br />
            먼저 로그인해야 합니다.
          </CardDescription>
        </CardHeader>

        {/* CTA */}
        <CardContent>
          <Button
            type="button"
            onClick={handleGoLogin}
            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            로그인하러 가기
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
