"use client";

import { useParams } from "next/navigation";
import Button from "@/components/ui/button";
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
      <main className="space-y-6 pb-28">
        {/* 상단 타이틀 영역 */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">모임 참여하기</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            초대받은 모임의 정보를 확인하고 참여를 진행해 주세요.
          </p>
        </div>

        <JoinMeetingSummary meetingId={meetingId} />
      </main>

      {/* 하단 고정 CTA */}
      {/* 로그인 */}
      <div className="flex flex-col gap-3">
        <Button type="button" onClick={handleKakaoLogin}>
          카카오 로그인
        </Button>

        <p className="text-xs text-[var(--wf-subtle)]">
          카카오 계정으로 로그인
        </p>
      </div>
    </>
  );
}
