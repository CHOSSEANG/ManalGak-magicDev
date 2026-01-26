// src/app/
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Image from "next/image";
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";
import { useUser } from "@/context/UserContext";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, setUser } = useUser();

  const getPostLoginRedirectPath = () => {
    const redirect = searchParams.get("redirect");
    return redirect ?? "/meetings";
  };

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

  const handleLogout = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
      { credentials: "include" }
    );

    setUser(null);
    router.replace("/");
  };

  // 🔑 auth/me 확인 중일 때 깜빡임 방지
  if (loading) return null;

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
              sizes="100vw"
              className="object-contain"
            />
          </div>

        {!user ? (
          <Button onClick={handleKakaoLogin}>로그인</Button>
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
