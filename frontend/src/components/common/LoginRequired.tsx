// src/components/common/LoginRequired.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CalendarPlus } from "lucide-react";

export default function LoginRequired(): JSX.Element {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGoLogin = (): void => {
    router.push("/");
  };

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
      <Card className="w-full max-w-md text-center border-[var(--border)] bg-[var(--bg-soft)] shadow-md">
        <CardHeader className="space-y-3">
          {/* 아이콘 */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)]">
            <CalendarPlus className="h-6 w-6 text-[var(--primary)]" />
          </div>

          <CardTitle className="text-lg font-semibold text-[var(--text)]">
            로그인이 필요해요
          </CardTitle>

          <CardDescription className="text-sm leading-relaxed text-[var(--text-subtle)]">
            서비스를 이용하려면
            <br />
            먼저 로그인해야 합니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <Button
            type="button"
            onClick={handleKakaoLogin}
            className="w-full gap-2 rounded-xl bg-[var(--primary)] py-5 text-[var(--primary-foreground)]"
          >
            카카오로 로그인하기
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
