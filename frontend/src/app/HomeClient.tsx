// src/app/HomeClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Clock,
  Frown,
  MapPin,
  Navigation,
  Share2,
} from "lucide-react";

import BottomTabNavigation from "@/components/layout/BottomTabNavigation";

export default function HomeClient() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* =========================
   * 로그인 (데모용)
   * ========================= */
  const handleKakaoLogin = () => {
    // 🔒 실제 서비스용 (백엔드 OAuth 연동 시 사용)
    // const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    // const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
    // if (!REST_API_KEY || !REDIRECT_URI) return;
    // window.location.href = `https://kauth.kakao.com/oauth/authorize?...`;

    alert("카카오 로그인 (데모)");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleStartClick = () => {
    router.push("/meetings/new");
  };

  return (
    <div className="relative min-h-screen bg-white">
      <main className="pb-32">
        {/* ================= Hero ================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#265AFC] via-[#4B7BFF] to-[#265AFC] px-6 py-20 text-white md:py-32">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[--wf-highlight] blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-[#FFDA38] blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-block rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              📍 스마트한 약속 장소 추천
            </div>

            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              어디서 만날지,
              <br />
              <span className="text-[#FFDA38]">아직도 고민해?</span>
            </h1>

            <p className="mb-10 text-lg text-white/90 md:text-xl">
              만날각이 모두에게 공평한
              <br className="md:hidden" /> 중간장소를 추천해드립니다
            </p>

            <motion.button
              onClick={handleStartClick}
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#FFDA38] px-8 py-4 font-semibold text-[#00006A] shadow-lg"
            >
              중간장소 찾기
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </section>

        {/* ================= Problem ================= */}
        <section className="px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-[#00006A]">
              약속 잡기, 왜 이렇게 힘들까요?
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: <Users size={32} />,
                  title: "항상 누군가는 멀어요",
                  desc: "각자 사는 곳이 다 달라서",
                },
                {
                  icon: <Clock size={32} />,
                  title: "장소 정하다 시간 다 가요",
                  desc: "단톡방은 계속 울리고",
                },
                {
                  icon: <Frown size={32} />,
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
                  <div className="mb-4 text-[#265AFC]">{item.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= Solution ================= */}
        <section className="bg-[#FFFBF0] px-6 py-16 md:py-24">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="mb-12 text-3xl font-bold text-[#00006A]">
              만날각은 이렇게 해결합니다
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <MapPin />,
                  title: "정확한 중간지점",
                  desc: "실제 위치 기반 계산",
                },
                {
                  icon: <Navigation />,
                  title: "이동 경로 고려",
                  desc: "대중교통 · 자차 모두 지원",
                },
                {
                  icon: <Share2 />,
                  title: "간편 공유",
                  desc: "카카오톡으로 바로 공유",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white p-8 shadow-sm"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#265AFC]/10 text-[#265AFC]">
                    {item.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 bg-gray-50">
          <div className="mx-auto max-w-5xl text-center space-y-12">
            <h2 className="text-3xl font-bold">이럴 때 특히 좋아요</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                👩‍👩‍👧‍👦<br/>
                친구 모임
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                💼<br/>
                팀 회식
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                💑<br/>
                데이트
              </div>
            </div>
          </div>
        </section>
        
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-3xl font-bold text-center">자주 묻는 질문</h2>

            <details className="rounded-xl border p-4">
              <summary className="font-semibold">회원가입이 필요한가요?</summary>
              <p className="mt-2 text-gray-600">카카오 로그인으로 바로 사용 가능합니다.</p>
            </details>
            
          </div>
        </section>
        {/* ================= Final CTA ================= */}
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
              카카오로 3초만에 시작하기
            </button>
          </div>
        </section>

       
        

        <BottomTabNavigation />
      </main>
    </div>
  );
}
