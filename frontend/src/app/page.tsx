// src/app/page.tsx
"use client";

import { useEffect } from "react";
import StepCard from "@/components/meeting/StepCard";
import Button from "@/components/ui/Button";

declare global {
  interface Window {
    Kakao: any;
    kakao: any;
  }
}

export default function HomePage() {
  // 카카오 로그인 시작
  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;
    const REDIRECT_URI = `${window.location.origin}/auth/kakao/callback`;

    // 메인 페이지에서는 특정 모임이 없으므로 기본 이동 경로 지정
    const state = "/my";

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = kakaoAuthUrl;
  };

  // 카카오 지도 미리보기
  useEffect(() => {
    if (!window.kakao) return;

    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.5636, 126.9976),
        level: 5,
      };

      new window.kakao.maps.Map(container, options);
    });
  }, []);

  return (
    <main className="flex min-h-[80vh] flex-col justify-between gap-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-[var(--wf-subtle)]">
            우리 중간에서 만날각?
          </p>
          <h1 className="text-3xl font-semibold">만날각</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            모임 목적별 중간지점 추천 서비스{" "}
          </p>
        </div>

        <StepCard className="space-y-3">
          <div
            id="map"
            className="h-64 w-full rounded-xl border border-[var(--wf-border)]"
          />
          <p className="text-sm text-[var(--wf-subtle)]">
            카카오 지도 미리보기
          </p>
        </StepCard>
      </div>

      {/* 로그인 */}
      <div className="flex flex-col gap-3">
        <Button type="button" onClick={handleKakaoLogin}>
          카카오 로그인
        </Button>

        <p className="text-xs text-[var(--wf-subtle)]">
          카카오 계정으로 로그인
        </p>
      </div>
    </main>
  );
}
