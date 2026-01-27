// src/app/HomeClient.tsx
"use client";
// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Button from "@/components/ui/Button";
// import Image from "next/image";
import BottomTabNavigation from "@/components/layout/BottomTabNavigation";
// import { useUser } from "@/context/UserContext";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  // MapPin,
  // Share2,
  // Navigation,
  Users,
  Clock,
  Frown,
} from "lucide-react";

export default function HomeClient() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { user, loading, setUser } = useUser();

//   const getPostLoginRedirectPath = () => {
//     const redirect = searchParams.get("redirect");
//     return redirect ?? "/meetings";
//   };

//   const handleKakaoLogin = () => {
//     const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
//     const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
//   if (!REST_API_KEY || !REDIRECT_URI) {
//     alert(
//       "카카오 로그인 설정이 완료되지 않았습니다.\n관리자에게 문의해주세요."
//     );
//     return;
//   }

//     const state = getPostLoginRedirectPath();

//     const kakaoAuthUrl =
//       "https://kauth.kakao.com/oauth/authorize" +
//       `?client_id=${REST_API_KEY}` +
//       `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
//       "&response_type=code" +
//       `&state=${encodeURIComponent(state)}`;

//     window.location.href = kakaoAuthUrl;
//   };

//   const handleLogout = async () => {
//     await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
//       { credentials: "include" }
//     );

//     setUser(null);
//     router.replace("/");
//   };

//   // 🔑 auth/me 확인 중일 때 깜빡임 방지
//   if (loading) return null;

  // 모선 관련 부분 
  const router = useRouter();


  const handleStartClick = () => {
    router.push("/meetings/new");
  };

  return (
      <div className="relative min-h-screen bg-white">
      <main className="pb-32">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#265AFC] via-[#4B7BFF] to-[#265AFC] px-6 py-20 text-white md:py-32">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#FFDA38] blur-3xl md:h-96 md:w-96" />
            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-[#FFDA38] blur-3xl md:h-96 md:w-96" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-block rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm font-medium">
                📍 스마트한 약속 장소 추천
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              어디서 만날지,
              <br />
              <span className="text-[#FFDA38]">아직도 고민해?</span>
            </h1>

            <p className="mb-10 text-lg text-white/90 md:text-xl">
              만날각이 모두에게 공평한 중간장소를 추천해드립니다
            </p>

            <motion.button
              onClick={handleStartClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFDA38] px-8 py-4 font-semibold text-[#00006A] shadow-lg"
            >
              중간장소 찾기
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </section>

        {/* Problem */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[#00006A]">
              약속 잡기, 왜 이렇게 힘들까요?
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: <Users size={32} className="text-[#265AFC]" />,
                  title: "항상 누군가는 멀어요",
                  desc: "각자 사는 곳이 다 달라서",
                },
                {
                  icon: <Clock size={32} className="text-[#265AFC]" />,
                  title: "장소 정하다 시간 다 가요",
                  desc: "단톡방은 계속 울리고",
                },
                {
                  icon: <Frown size={32} className="text-[#265AFC]" />,
                  title: "결국 늘 같은 곳…",
                  desc: "새로운 곳을 찾기 어려워요",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl border bg-white p-8 shadow-sm"
                >
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-[#265AFC] to-[#4B7BFF] p-12 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">
              지금 바로 시작해보세요
            </h2>
            <p className="mb-8 text-white/90">
              더 이상 약속 장소로 고민하지 마세요
            </p>
            <button
              onClick={handleStartClick}
              className="rounded-full bg-[#FFDA38] px-8 py-4 font-semibold text-[#00006A]"
            >
              무료로 시작하기
            </button>
          </div>
          </section>
        <BottomTabNavigation />
      </main>
    </div>

        /* {!user ? (
          <Button onClick={handleKakaoLogin}>로그인</Button>
        ) : (
          <Button
            type="button"
            onClick={handleLogout}
            className="bg-[var(--wf-accent)] text-white hover:opacity-90"
          >
            로그아웃
          </Button>
        )} */
  );
}
