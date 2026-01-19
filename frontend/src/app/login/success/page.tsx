// src/app/login/success/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // 로그인 성공 후 실제 서비스로 이동
    router.replace("/meetings/new");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">
        로그인 성공! 잠시만 기다려 주세요.
      </p>
    </main>
  );
}
