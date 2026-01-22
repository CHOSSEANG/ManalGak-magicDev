"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@/context/UserContext";

export default function LoginSuccessPage() {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
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
        setUser(userData); // Context + localStorage 저장
      } catch (err) {
        console.error("유저 정보 가져오기 실패", err);
      } finally {
        router.replace("/meetings/new"); // 이동
      }
    };

    fetchUser();
  }, [router, setUser]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">
        로그인 성공! 잠시만 기다려 주세요.
      </p>
    </main>
  );
}
