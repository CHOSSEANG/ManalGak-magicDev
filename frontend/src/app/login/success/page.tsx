// src/app/login/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@/context/UserContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginSuccessPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isRedirecting) {
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            withCredentials: true,
          }
        );

        const userData = {
          id: res.data.data.userId,
          name: res.data.data.nickname,
          profileImage: res.data.data.profileImageUrl,
        };

        setUser(userData);

        const redirectUrl = localStorage.getItem("loginRedirect");
        localStorage.removeItem("loginRedirect");

        setIsRedirecting(true);

        const targetUrl = redirectUrl || "/meetings/new";
        console.log("✅ 이동:", targetUrl);

        setTimeout(() => {
          router.replace(targetUrl);
        }, 100);
      } catch (err) {
        console.error("유저 정보 가져오기 실패", err);
        setIsRedirecting(true);
        router.replace("/meetings/new");
      }
    };

    fetchUser();
  }, [router, setUser, isRedirecting]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4">
      <Card className="w-full border-[var(--border)] bg-[var(--bg)]">
        <CardHeader className="space-y-1 pb-3 text-center">
          <CardTitle className="text-base text-[var(--text)]">
            로그인 완료
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-[var(--text-subtle)]">
            로그인에 성공했습니다.
            <br />
            잠시 후 자동으로 이동합니다.
          </p>

          {/* Loading State */}
          <div
            className="space-y-2"
            aria-busy="true"
            aria-live="polite"
          >
            <div className="mx-auto h-3 w-2/3 rounded-md bg-[var(--neutral-soft)]" />
            <div className="mx-auto h-3 w-1/2 rounded-md bg-[var(--neutral-soft)]" />
          </div>

          <div className="rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-3 py-2">
            <p className="text-xs text-[var(--text-subtle)]">
              이동이 되지 않으면 잠시 후 새로고침해 주세요.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
