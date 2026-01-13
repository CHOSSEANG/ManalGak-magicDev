// src/app/auth/kakao/callback/page.tsx
"use client";

import React, {useEffect, Suspense} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepCard from "@/components/meeting/StepCard";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;
    // TODO: 백엔드 API 연결
    // await fetch('/api/auth/kakao', { method: 'POST', body: JSON.stringify({ code }) })

    const state = searchParams.get("state");
    const redirectTo = state ?? "/meetings/new";

    router.replace(redirectTo);
  }, [router, searchParams]);

  return (
    <main className="space-y-6">
      <StepCard className="space-y-4">
        <h1 className="text-2xl font-semibold">카카오 로그인 처리 중</h1>
        <p className="text-sm text-[var(--wf-subtle)]">
          카카오 인증 정보를 확인하고 있습니다.
        </p>
      </StepCard>
    </main>
  );
}

export default function KakaoCallbackPage() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <KakaoCallbackContent />
      </Suspense>
  );
}