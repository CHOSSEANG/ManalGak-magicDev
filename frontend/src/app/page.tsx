// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StepCard from "@/components/meeting/StepCard";
import Button from "@/components/ui/Button";

export default function HomePage() {
  const router = useRouter();

  /**
   * ✅ 이미 로그인된 상태면
   * 홈(/) 접근 시 서비스 페이지로 이동
   */
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      router.replace("/meetings/new");
    }
  }, [router]);

  /**
   * 카카오 로그인 시작
   */
  const handleKakaoLogin = () => {
    const REST_API_KEY =
      process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

    // 🔴 필수 방어: REST API KEY 없으면 진행 금지
    if (!REST_API_KEY) {
      alert(
        "카카오 로그인 설정이 완료되지 않았습니다.\n관리자에게 문의해주세요."
      );
      return;
    }

    const REDIRECT_URI = `${window.location.origin}/auth/kakao/callback`;
    const state = "/meetings/new";

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = kakaoAuthUrl;
  };

  /**
   * 카카오 지도 미리보기
   */
  useEffect(() => {
    const maps = window.kakao?.maps;
    if (!maps?.load) return;

    maps.load(() => {
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new maps.LatLng(37.5636, 126.9976),
        level: 5,
      };

      new maps.Map(container, options);
    });
  }, []);

  return (
    <main className="flex min-h-[80vh] flex-col justify-between gap-8">
      {/* 상단 소개 */}
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-[var(--wf-subtle)]">
            우리 중간에서 만날각?
          </p>
          <h1 className="text-3xl font-semibold">만날각</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            모임 목적별 중간지점 추천 서비스
          </p>
        </div>

        {/* 지도 미리보기 */}
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

      {/* 로그인 영역 */}
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
