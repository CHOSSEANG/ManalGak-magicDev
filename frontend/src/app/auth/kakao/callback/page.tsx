// src/app/auth/kakao/callback/page.tsx
"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepCard from "@/components/meeting/StepCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const executedRef = useRef(false);

  useEffect(() => {
    // ✅ StrictMode / hydration 중복 실행 방어
    if (executedRef.current) return;
    executedRef.current = true;

    /**
     * 1️⃣ 카카오 인증 실패 케이스
     */
    const error = searchParams.get("error");
    if (error) {
      console.error("❌ 카카오 로그인 실패:", error);
      router.replace("/auth/error");
      return;
    }

    /**
     * 2️⃣ 인증 코드 확인
     */
    const code = searchParams.get("code");
    if (!code) {
      console.error("❌ 카카오 인증 코드 없음");
      router.replace("/auth/error");
      return;
    }

    /**
     * 3️⃣ 백엔드에서 이미 쿠키 세팅 완료된 상태
     * 👉 프론트는 아무 것도 하지 않는다
     */

    /**
     * 4️⃣ 로그인 성공 페이지로 이동
     */
    setTimeout(() => {
      router.replace("/login/success");
    }, 300);
  }, [router, searchParams]);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      <StepCard className="space-y-4">
        <Card className="border-[var(--border)] bg-[var(--bg)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">
              카카오 로그인 처리 중
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-sm text-[var(--text-subtle)]">
              카카오 인증 정보를 확인하고 있습니다.
            </p>

            <div aria-busy="true" aria-live="polite" className="space-y-2">
              <div className="h-3 w-2/3 rounded-md bg-[var(--neutral-soft)]" />
              <div className="h-3 w-1/2 rounded-md bg-[var(--neutral-soft)]" />
              <div className="h-3 w-3/4 rounded-md bg-[var(--neutral-soft)]" />
            </div>

            <div className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
              <p className="text-xs text-[var(--text-subtle)]">
                잠시만 기다려 주세요. 자동으로 이동합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </StepCard>
    </main>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-md px-4 py-10">
          <StepCard className="space-y-4">
            <Card className="border-[var(--border)] bg-[var(--bg)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-[var(--text)]">
                  카카오 로그인 처리 중
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-[var(--text-subtle)]">
                  인증 정보를 불러오는 중입니다.
                </p>
                <div aria-busy="true" aria-live="polite" className="space-y-2">
                  <div className="h-3 w-2/3 rounded-md bg-[var(--neutral-soft)]" />
                  <div className="h-3 w-1/2 rounded-md bg-[var(--neutral-soft)]" />
                </div>
              </CardContent>
            </Card>
          </StepCard>
        </main>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
