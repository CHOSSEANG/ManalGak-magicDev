// src/app/meetings/[meetingId]/join/page.tsx
"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import JoinMeetingSummary from "@/components/meeting/summary/JoinMeetingSummary";

export default function JoinMeetingPage() {
  const { meetingId } = useParams<{ meetingId: string }>();

  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;
    const REDIRECT_URI = `${window.location.origin}/auth/kakao/callback`;
    const state = `/meetings/${meetingId}/step3-members`;

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <>
      {/* Main Content */}
      <main className="mx-auto w-full max-w-md space-y-6 px-4 pb-36">
        {/* Page Header */}
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold text-[var(--text)]">
            모임 참여하기
          </h1>
          <p className="text-sm text-[var(--text-subtle)]">
            초대받은 모임의 정보를 확인하고 참여를 진행해 주세요.
          </p>
        </section>

        {/* Meeting Summary */}
        <Card className="border-[var(--border)] bg-[var(--bg)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">
              모임 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JoinMeetingSummary meetingId={meetingId} />
          </CardContent>
        </Card>
      </main>

      {/* Bottom Fixed CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--bg)] px-4 py-4">
        <div className="mx-auto w-full max-w-md space-y-2">
          <Button
            type="button"
            onClick={handleKakaoLogin}
            className="w-full"
          >
            카카오 로그인
          </Button>

          <p className="text-center text-xs text-[var(--text-subtle)]">
            카카오 계정으로 로그인 후 모임에 참여할 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
}
