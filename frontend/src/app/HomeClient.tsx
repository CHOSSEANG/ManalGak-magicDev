// src/app/HomeClient.tsx
"use client";

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

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function HomeClient() {
  const router = useRouter();

  /* =========================
   * 카카오 로그인 (실서비스용)
   * ========================= */
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

  const handleStartClick = () => {
    router.push("/meetings/new");
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <main className="pb-32 space-y-24">

        {/* ================= Hero ================= */}
        <section className="relative overflow-hidden px-6 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center space-y-8"
          >
            <span className="inline-block rounded-full bg-[var(--neutral-soft)] px-4 py-2 text-sm text-[var(--text-subtle)]">
              📍 스마트한 약속 장소 추천
            </span>

            <h1 className="text-4xl font-bold md:text-6xl">
              어디서 만날지,
              <br />
              <span className="text-[var(--primary)]">
                아직도 고민해?
              </span>
            </h1>

            <p className="text-lg text-[var(--text-subtle)] md:text-xl">
              만날각이 모두에게 공평한
              <br className="md:hidden" /> 중간장소를 추천해드립니다
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Button
                onClick={handleStartClick}
                size="lg"
                className="rounded-full px-8"
              >
                중간장소 찾기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* ================= Problem ================= */}
        <section className="px-6">
          <div className="mx-auto max-w-6xl space-y-12">
            <h2 className="text-center text-3xl font-bold">
              약속 잡기, 왜 이렇게 힘들까요?
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: <Users size={28} />,
                  title: "항상 누군가는 멀어요",
                  desc: "각자 사는 곳이 다 달라서",
                },
                {
                  icon: <Clock size={28} />,
                  title: "장소 정하다 시간 다 가요",
                  desc: "단톡방은 계속 울리고",
                },
                {
                  icon: <Frown size={28} />,
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
                >
                  <Card className="h-full p-8 space-y-3">
                    <div className="text-[var(--primary)]">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-subtle)]">
                      {item.desc}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= Solution ================= */}
        <section className="px-6 bg-[var(--bg-soft)] py-20">
          <div className="mx-auto max-w-6xl text-center space-y-12">
            <h2 className="text-3xl font-bold">
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
                <Card key={i} className="p-8 space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--neutral-soft)] text-[var(--primary)]">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-subtle)]">
                    {item.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ================= Use Cases ================= */}
        <section className="px-6">
          <div className="mx-auto max-w-5xl space-y-12 text-center">
            <h2 className="text-3xl font-bold">
              이럴 때 특히 좋아요
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {["친구 모임", "팀 회식", "데이트"].map((label) => (
                <Card key={label} className="p-6">
                  <span className="text-lg font-semibold">
                    {label}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="px-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-center text-3xl font-bold">
              자주 묻는 질문
            </h2>

            <Card className="p-4">
              <details>
                <summary className="cursor-pointer font-semibold">
                  회원가입이 필요한가요?
                </summary>
                <Separator className="my-2" />
                <p className="text-[var(--text-subtle)]">
                  카카오 로그인으로 바로 사용 가능합니다.
                </p>
              </details>
            </Card>
          </div>
        </section>

        {/* ================= Final CTA ================= */}
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
                className="rounded-full"
                onClick={handleKakaoLogin}
              >
                카카오로 3초만에 시작하기
              </Button>
            </Card>
          </div>
        </section>

      </main>
    </div>
  );
}
