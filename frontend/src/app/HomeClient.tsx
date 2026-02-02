// src/app/HomeClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Users,
  Clock,
  Frown,
  MapPin,
  Navigation,
  Share2,
  Sparkles,
  ChevronDown,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomeClient() {
  const router = useRouter();

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

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
    <div
      className="relative min-h-screen text-[var(--text)]"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 245, 210, 0.55) 0%, rgba(255, 250, 225, 0.45) 40%, rgba(255, 255, 255, 0.9) 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute -top-48 left-1/3 w-[520px] h-[520px] rounded-full bg-[var(--wf-highlight)] opacity-10 blur-[220px]"
        />
        <motion.div
          style={{ y: backgroundY }}
          className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-[var(--wf-accent)] opacity-[0.08] blur-[240px]"
        />
      </div>

      {/* Removed animated background blobs */}
      <main className="relative z-10 pb-32">
        {/* ================= Hero ================= */}
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
          {/* Removed hero radial glow */}
          <motion.div
            {...floatingAnimation}
            className="absolute top-32 left-[15%] w-4 h-4 rounded-full bg-[var(--wf-highlight-soft)]"
          />
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: 0.5,
            }}
            className="absolute top-48 right-[20%] w-6 h-6 rounded-full bg-[var(--wf-highlight-soft)] rotate-12"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut" as const,
              delay: 1,
            }}
            className="absolute bottom-40 left-[10%] w-3 h-3 rounded-full bg-[var(--wf-border)]"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mx-auto max-w-5xl text-center space-y-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--wf-border)] bg-white/60 px-4 py-2 text-sm font-medium backdrop-blur">
                <Sparkles className="w-4 h-4 text-primary " />
                스마트한 약속 장소 추천
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-5xl font-bold md:text-7xl lg:text-8xl tracking-tight"
            >
              어디서 만날지,
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-[var(--primary)] inline-block"
              >
                아직도 고민해?
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-muted-foreground md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed"
            >
              만날각이 모두에게 공평한
              <br className="md:hidden" /> 중간장소를 추천해드립니다
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleStartClick}
                  size="lg"
                  type="button"
                  className="rounded-full px-10 py-6 text-lg font-semibold bg-[var(--wf-highlight)] text-primary-foreground hover:bg-[var(--wf-highlight)] active:bg-[var(--wf-highlight)] shadow-lg shadow-primary/30 transition-all duration-300"
                >
                  중간장소 찾기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-muted-foreground"
              >
                <span className="text-xs font-medium">스크롤</span>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ================= Problem ================= */}
        <section className="px-6 py-24 bg-white/60 backdrop-blur-[1px]">
          <div className="mx-auto max-w-6xl space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <span className="text-[var(--wf-accent)] text-sm font-medium uppercase tracking-wider">
                Problem
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
                약속 잡기, 왜 이렇게 힘들까요?
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {[
                {
                  icon: <Users size={32} />,
                  title: "항상 누군가는 멀어요",
                  desc: "각자 사는 곳이 다 달라서 한 쪽은 늘 먼 거리를 이동해야 해요",
                },
                {
                  icon: <Clock size={32} />,
                  title: "장소 정하기 어려워요",
                  desc: "단톡방에서 끝없는 논의... 결국 결정은 안 나고 시간만 흘러요",
                },
                {
                  icon: <Frown size={32} />,
                  title: "결국 늘 같은 곳…",
                  desc: "새로운 장소를 찾기 귀찮아서 맨날 갔었던 같은 곳만 가게 돼요",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  <motion.div variants={cardHover}>
                    <Card className="h-full p-8 space-y-4 bg-white border border-[var(--wf-border)] hover:border-[var(--wf-accent)] transition-colors">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-2xl bg-[var(--wf-accent)]/10 flex items-center justify-center text-[var(--wf-accent)]"
                      >
                        {item.icon.type === Users && (
                          <Users className="h-6 w-6 text-[var(--wf-accent)]" />
                        )}
                        {item.icon.type === Clock && (
                          <Clock className="h-6 w-6 text-[var(--wf-accent)]" />
                        )}
                        {item.icon.type === Frown && (
                          <Frown className="h-6 w-6 text-[var(--wf-accent)]" />
                        )}
                      </motion.div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= Solution ================= */}
        <section className="px-6 py-24 relative bg-[var(--wf-highlight)]/20">
          <div className="relative mx-auto max-w-6xl text-center space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-[var(--wf-accent)] text-sm font-medium uppercase tracking-wider">
                Solution
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
                만날각은 이렇게 해결합니다
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid gap-8 md:grid-cols-3"
            >
              {[
                {
                  icon: <MapPin className="w-7 h-7" />,
                  title: "정확한 중간지점",
                  desc: "실제 위치 기반으로 모두에게 공평한 지점을 계산해요",
                  gradient: "from-primary to-primary/70",
                },
                {
                  icon: <Navigation className="w-7 h-7" />,
                  title: "이동 경로 고려",
                  desc: "대중교통, 자차 등 이동 수단별 최적의 장소를 추천해요",
                  gradient: "from-primary/90 to-primary/60",
                },
                {
                  icon: <Share2 className="w-7 h-7" />,
                  title: "간편 공유",
                  desc: "결정된 장소를 카카오톡으로 바로 친구들에게 공유해요",
                  gradient: "from-primary/80 to-primary/50",
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  <motion.div variants={cardHover}>
                    <Card className="p-8 space-y-5 bg-white border border-[var(--wf-border)] hover:border-[var(--wf-accent)] transition-colors">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--wf-highlight-soft)] text-[var(--wf-accent)] shadow-lg"
                      >
                        {item.icon.type === MapPin && (
                          <MapPin className="w-7 h-7 text-[var(--wf-accent)]" />
                        )}
                        {item.icon.type === Navigation && (
                          <Navigation className="w-7 h-7 text-[var(--wf-accent)]" />
                        )}
                        {item.icon.type === Share2 && (
                          <Share2 className="w-7 h-7 text-[var(--wf-accent)]" />
                        )}
                      </motion.div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= Use Cases ================= */}
        <section className="px-6 py-24 bg-white/70">
          <div className="mx-auto max-w-5xl space-y-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <span className="text-[var(--wf-accent)] text-sm font-medium uppercase tracking-wider">
                Use Cases
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">
                이럴 때 특히 좋아요
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {[
                {
                  label: "친구 모임",
                  emoji: "👫",
                  desc: "오랜만에 만나는 친구들과",
                },
                {
                  label: "팀 회식",
                  emoji: "🍻",
                  desc: "회사 동료들과 회식 장소",
                },
                {
                  label: "데이트",
                  emoji: "💕",
                  desc: "연인과의 특별한 데이트",
                },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeInUp}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Card className="p-8 bg-white border border-[var(--wf-border)] hover:border-[var(--wf-accent)] transition-colors cursor-pointer group">
                      <motion.span
                        className="text-5xl block mb-4"
                        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        {item.emoji}
                      </motion.span>
                      <h3 className="text-xl font-bold mb-2">{item.label}</h3>
                      <p className="text-muted-foreground text-sm">
                        {item.desc}
                      </p>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="px-6 py-24 bg-[var(--wf-highlight)]/15">
          <div className="mx-auto max-w-3xl space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <span className="text-[var(--wf-accent)] text-sm font-medium uppercase tracking-wider">
                FAQ
              </span>
              <h2 className="text-3xl md:text-5xl font-bold">자주 묻는 질문</h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-4"
            >
              {[
                {
                  q: "회원가입이 필요한가요?",
                  a: "카카오 로그인으로 3초만에 바로 시작할 수 있습니다!",
                },
                {
                  q: "무료로 사용할 수 있나요?",
                  a: "네, 기본 기능은 모두 무료입니다. 마음껏 사용하세요!",
                },
                {
                  q: "몇 명까지 장소를 찾을 수 있나요?",
                  a: "최대 10명까지 위치를 입력할 수 있어요.",
                },
              ].map((item) => (
                <motion.div key={item.q} variants={fadeInUp}>
                  <Card className="p-6 bg-white border border-[var(--wf-border)] hover:border-[var(--wf-accent)] transition-colors">
                    <details className="group">
                      <summary className="cursor-pointer font-semibold text-lg flex items-center justify-between list-none">
                        {item.q}
                        <motion.span
                          className="text-[var(--wf-accent)]"
                          initial={false}
                        >
                          <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                        </motion.span>
                      </summary>
                      <motion.p className="text-muted-foreground mt-4 leading-relaxed">
                        {item.a}
                      </motion.p>
                    </details>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= Final CTA ================= */}
        <section className="px-6 py-24 bg-white/80">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl"
          >
            <Card className="relative p-12 md:p-16 text-center space-y-8 bg-[var(--wf-highlight-soft)] border border-[var(--wf-border)] hover:border-[var(--wf-accent)] transition-colors overflow-hidden">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: 0.2 }}
                className="relative"
              >
                <span className="text-6xl">🎯</span>
              </motion.div>

              <h2 className="text-2xl md:text-4xl font-bold">
                지금 바로 시작해보세요
              </h2>

              <p className="text-[var(--text-subtle)] text-m">
                더 이상 약속 장소로 고민하지 마세요
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  type="button"
                  className="bg-[#371D1E] hover:bg-[#371D1E] active:bg-[#371D1E] text-white rounded-full px-10 py-6 text-lg font-semibold shadow-lg"
                  onClick={handleKakaoLogin}
                >
                  카카오로 3초만에 시작하기
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
