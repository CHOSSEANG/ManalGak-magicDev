// src/app/auth/kakao/callback/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StepCard from "@/components/meeting/StepCard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    /**
     * 1️⃣ 카카오 인증 실패 케이스
     * - KOE101
     * - access_denied
     * - 기타 설정 오류
     */
    const error = searchParams.get("error");
    if (error) {
      // 로그인 정보 초기화 (방어)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      router.replace("/auth/error");
      return;
    }

    /**
     * 2️⃣ 정상 인증 코드
     */
    const code = searchParams.get("code");
    if (!code) {
      router.replace("/auth/error");
      return;
    }

    /**
     * 3️⃣ TODO: 백엔드 인증 요청
     * - POST /api/auth/kakao
     * - code 전달
     * - accessToken / user 정보 수신
     */

    /**
     * 4️⃣ 로그인 성공 처리 (임시)
     * ※ 백엔드 연동 후 이 부분은 API 응답으로 교체
     */
    localStorage.setItem("accessToken", "kakao-temp-token");

    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "kakao-temp-user",
        name: "김만날",
        email: "mannal_kim@email.com",
        profileImage:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB3QGgGtn4zUi2Q5Ee1vmAFie8A-B9HrkyA3SLakKMzouzeQgmqLVy2eqlUGFW21W7Uhfwe_6B3LJhu7B6gqIH8PtxvZ5VuwmFjwMIfCdf8t0FFiEtzVno2GI9GmYpZPaHki3CvleZbugNP1J2-qcDO75kqexuHAqntXxRuRVEb_dZZpUrFPSidKPXL-PDzIxfzsi_hUKCgTSRcxv_A6HJoZtHV4zRKBRTrGJQEp9Nap8aCIHZAaCgD8zQd3fPgtB5hpxVGyEvBD9tr",
      })
    );

    /**
     * 5️⃣ 로그인 성공 후 이동 (확정)
     */
    router.replace("/login/success");
  }, [router, searchParams]);

  return (
    <main className="mx-auto w-full max-w-md px-4 py-10">
      {/* StepCard 유지(프로젝트 공통 UI) + 내부는 Card 기반으로 정렬 */}
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

            {/* Loading indicator (Skeleton 없이, 토큰만 사용) */}
            <div className="space-y-2" aria-busy="true" aria-live="polite">
              <div className="h-3 w-2/3 rounded-md bg-[var(--neutral-soft)]" />
              <div className="h-3 w-1/2 rounded-md bg-[var(--neutral-soft)]" />
              <div className="h-3 w-3/4 rounded-md bg-[var(--neutral-soft)]" />
            </div>

            <div className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
              <p className="text-xs text-[var(--text-subtle)]">
                잠시만 기다려 주세요. 자동으로 다음 화면으로 이동합니다.
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
                <div className="space-y-2" aria-busy="true" aria-live="polite">
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
