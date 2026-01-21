// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Image from "next/image";
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";

/**
 * 홈 = 로그인 + 서비스 인트로 페이지
 */
export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * 로그인 상태 판별
   * - 쿠키 기반 인증이므로 단순 플래그 용도
   * - 실제 인증 여부는 API 호출 시 서버에서 판단
   */
  useEffect(() => {
    const loggedIn = !!localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn);
  }, []);

  /**
   * 로그인 성공 후 이동 경로 결정
   * - 초대 링크 유입: redirect 파라미터 우선
   * - 일반 로그인: 모임 리스트
   */
  const getPostLoginRedirectPath = useCallback(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) return redirect;

    return "/meetings";
  }, [searchParams]);

  /**
   * 카카오 로그인 시작
   */
  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!REST_API_KEY || !REDIRECT_URI) {
      alert(
        "카카오 로그인 설정이 완료되지 않았습니다.\n관리자에게 문의해주세요."
      );
      return;
    }

    const state = getPostLoginRedirectPath();

    const kakaoAuthUrl =
      "https://kauth.kakao.com/oauth/authorize" +
      `?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      "&response_type=code" +
      `&state=${encodeURIComponent(state)}`;

    window.location.href = kakaoAuthUrl;
  };

  /**
   * 로그아웃
   * - 쿠키는 서버에서 제거
   * - 프론트는 상태만 초기화
   */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    router.replace("/");
  };

  return (
    <main className="flex flex-col justify-between gap-10">
      {/* ===== 서비스 인트로 영역 ===== */}
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            모두에게 부담 없는
            <br />
            중간 만남 장소 확정!
          </h2>
        </div>

          {/* 바깥 박스 사이즈 바뀌면 이미지도 같이 맞춰짐 */}
          <div
            className="
              relative w-full overflow-hidden rounded-xl bg-[var(--wf-bg-soft)]
              h-[40vh] min-h-[260px]
              md:h-[50vh] md:min-h-[360px]
              lg:h-[520px] 
            "
          >
            <Image
              src="/images/img0.png"
              alt="intro"
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>

        {!isLoggedIn ? (
          <Button type="button" onClick={handleKakaoLogin}>
            로그인
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleLogout}
            className="bg-[var(--wf-accent)] text-white hover:opacity-90"
          >
            로그아웃
          </Button>
        )}
      </section>

            <BottomTabNavigation />
    </main>
  );
}
