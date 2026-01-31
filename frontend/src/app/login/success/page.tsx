// src/app/login/success/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginSuccessPage() {
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    // ✅ StrictMode / 재마운트 방어
    if (redirectedRef.current) return;
    redirectedRef.current = true;

    const redirectUrl = localStorage.getItem("loginRedirect");
    localStorage.removeItem("loginRedirect");

    const targetUrl = redirectUrl || "/meetings/new";
    console.log("✅ 로그인 성공 후 이동:", targetUrl);

    // UX용 약간의 딜레이만 유지
    setTimeout(() => {
      router.replace(targetUrl);
    }, 300);
  }, [router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4">
      <Card className="w-full border-[var(--border)] bg-[var(--bg)]">
        <CardHeader className="space-y-1 pb-3 text-center">
          <CardTitle className="text-base text-[var(--text)]">
            로그인 완료
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-[var(--text-subtle)]">
            로그인에 성공했습니다.
            <br />
            잠시 후 자동으로 이동합니다.
          </p>

          {/* Loading Skeleton */}
          <div aria-busy="true" aria-live="polite" className="space-y-2">
            <div className="mx-auto h-3 w-2/3 rounded-md bg-[var(--neutral-soft)]" />
            <div className="mx-auto h-3 w-1/2 rounded-md bg-[var(--neutral-soft)]" />
          </div>

          <div className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
            <p className="text-xs text-[var(--text-subtle)]">
              이동이 되지 않으면 잠시 후 새로고침해 주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
