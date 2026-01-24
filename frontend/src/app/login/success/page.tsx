"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@/context/UserContext";

export default function LoginSuccessPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isRedirecting) return; // 이미 리다이렉트 중이면 무시

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        const userData = {
          id: res.data.data.userId,
          name: res.data.data.nickname,
          profileImage: res.data.data.profileImageUrl,
        };
        setUser(userData);

        // localStorage 읽기
        const redirectUrl = localStorage.getItem("loginRedirect");
        localStorage.removeItem("loginRedirect");

        setIsRedirecting(true);

        // 리다이렉트
        const targetUrl = redirectUrl || "/meetings/new";
        console.log("✅ 이동:", targetUrl);

        // 약간의 딜레이 후 이동 (안전하게)
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
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">
        로그인 성공! 잠시만 기다려 주세요.
      </p>
    </main>
  );
}