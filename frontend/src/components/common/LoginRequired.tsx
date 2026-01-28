// src/components/common/LoginRequired.tsx
"use client";

import { useRouter } from "next/navigation";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginRequired(): JSX.Element {
  const router = useRouter();

  // const handleGoLogin = (): void => {
  //   router.push("/");
  // };

    const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!REST_API_KEY || !REDIRECT_URI) {
      alert("카카오 로그인 설정이 완료되지 않았습니다.");
      return;
    }

    const kakaoAuthUrl =
      "https://kauth.kakao.com/oauth/authorize" +
      `?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      "&response_type=code";

    window.location.href = kakaoAuthUrl;
  };

  // const handleStartClick = () => {
  //   router.push("/meetings/new");
  // };

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <Card className="w-full max-w-md border-[var(--border)] ">
        {/* Header */}
        <CardHeader className="text-center">
          <CardTitle className="text-[var(--text)]">
            로그인이 필요해요
          </CardTitle>
          <CardDescription className="text-[var(--text-subtle)]">
            서비스를 이용하려면 <br />
            먼저 로그인해야 합니다.
          </CardDescription>
        </CardHeader>

        {/* CTA */}
        <section className="px-6">
          <div className="mx-auto max-w-3xl">
            <Card className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">
                지금 바로 시작해보세요
              </h2>
              <p className="text-[var(--text-subtle)]">
                더 이상 약속 장소로 고민하지 마세요
              </p>
              <Button
                size="lg"
                className="rounded-full bg-[var(--kakao-yellow)] py-6"
                onClick={handleKakaoLogin}
              >
                카카오로 3초만에 시작하기
              </Button>
            </Card>
          </div>
        </section>
      </Card>
    </main>
  );
}
