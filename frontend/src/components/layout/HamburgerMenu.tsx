// src/components/layout/HamburgerMenu.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";
import { useUser } from "@/context/UserContext";
import ProfileIdentity from "@/components/layout/ProfileIdentity";
import { motion } from "framer-motion";

import Footer from "@/components/layout/Footer";

import {
  X,
  User,
  Calendar,
  SquareMousePointer,
  Users,
  MapPin,
  CheckCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MY_MENUS = [
  { label: "내 페이지", href: "/my", icon: User },
  { label: "모임 리스트", href: "/meetings/new", icon: Calendar },
];
const MENUS = [
  {
    label: "모임 만들기",
    href: "/meetings/new/step1-basic",
    icon: SquareMousePointer,
  },
  {
    label: "참여자 설정",
    href: "/meetings/new/step2-meetingmembers",
    icon: Users,
  },
  { label: "추천 장소 선택", href: "/meetings/new/step3-result", icon: MapPin },
  { label: "모임 확정", href: "/meetings/complete", icon: CheckCircle },
];

const isValidUuid = (value: string | null): value is string => {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
};

// ✅ 실제 메뉴 내용
function HamburgerMenuContent({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, setUser } = useUser();
  const isLoggedIn = !!user;
  const isLoading = user === null;

  const readonlyParam = searchParams.get("readonly") === "true";

  const queryMeetingUuidRaw = searchParams.get("meetingUuid");
  const queryMeetingUuid = isValidUuid(queryMeetingUuidRaw)
    ? queryMeetingUuidRaw
    : null;

  const pathMeetingUuid = (() => {
    const match = pathname.match(/\/meetings\/([^/]+)/);
    const candidate = match ? match[1] : null;
    return isValidUuid(candidate) ? candidate : null;
  })();

  const meetingUuid = queryMeetingUuid ?? pathMeetingUuid;

  const withMeetingUuid = (href: string) => {
    if (!meetingUuid) return href;

    const params = new URLSearchParams();
    params.set("meetingUuid", meetingUuid);
    if (readonlyParam) params.set("readonly", "true");

    if (href.includes("?")) return `${href}&${params.toString()}`;
    return `${href}?${params.toString()}`;
  };

  const handleNavigate = (href: string) => {
    let finalHref = href;

    if (href === "/meetings/complete") {
      if (meetingUuid) {
        if (readonlyParam) {
          finalHref = `/meetings/${meetingUuid}/complete?readonly=true`;
        } else {
          finalHref = `/meetings/${meetingUuid}/complete`;
        }
      } else {
        finalHref = "/meetings/none";
      }
    } else {
      finalHref = withMeetingUuid(href);
    }

    router.push(finalHref);
    onClose();
  };

  // ✅ 카카오 로그인 (단 1회 선언)
  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!REST_API_KEY || !REDIRECT_URI) {
      alert("카카오 로그인 설정이 완료되지 않았습니다.");
      return;
    }

    const redirectPath = pathname + location.search;

    const kakaoAuthUrl =
      "https://kauth.kakao.com/oauth/authorize" +
      `?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      "&response_type=code" +
      `&state=${encodeURIComponent(redirectPath)}`;

    window.location.href = kakaoAuthUrl;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("로그아웃 API 실패", err);
    } finally {
      setUser(null);
      onClose();
      router.replace("/");
    }
  };

  const handleLoginClick = () => {
    onClose();
    handleKakaoLogin();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="fixed right-0 top-0 h-full w-[78%] max-w-sm bg-[var(--bg)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
      >
        <div className="flex h-full flex-col">
          {/* Top bar: close + title */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text)]">전체 메뉴</p>
              <p className="text-xs text-[var(--text-subtle)]">
                모임 생성 흐름과 내 메뉴로 이동
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onClose}
              aria-label="메뉴 닫기"
            >
              <X className="h-5 w-5 text-[var(--text)]" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {/* Profile Card */}
            <Card className="border border-[var(--border)] bg-[var(--bg-soft)]">
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <ProfileIdentity
                    src={user?.profileImage}
                    name={user?.name ?? "로그인 필요"}
                    isLoading={isLoading}
                    size={48}
                    layout="row"
                    shape="square"
                  />
                </div>

                <div className="mt-3 text-xs text-[var(--text-subtle)]">
                  {isLoggedIn ? (
                    <span>로그인 상태입니다.</span>
                  ) : (
                    <span>로그인 후 내 모임과 내 페이지를 사용할 수 있어요.</span>
                  )}
                </div>
              </div>
            </Card>

            {/* My menus (login only) */}
            <Card className="border border-[var(--border)] bg-[var(--bg)]">
              <div className="border-b border-[var(--border)] px-3 py-2">
                <p className="text-xs font-semibold text-[var(--text)]">
                  내 메뉴
                </p>
              </div>

              <div className="p-2">
                {!isLoggedIn ? (
                  <div className="px-2 py-3 text-sm text-[var(--text-subtle)]">
                    로그인하면 내 메뉴가 표시됩니다.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {MY_MENUS.map(({ label, href, icon: Icon }) => (
                      <Button
                        key={href}
                        type="button"
                        variant="outline"
                        onClick={() => handleNavigate(href)}
                        className="w-full justify-between border-[var(--border)] bg-[var(--bg)] px-3 py-3"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-[var(--text-subtle)]" />
                          <span className="text-sm text-[var(--text)]">
                            {label}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-[var(--text-subtle)]" />
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Meeting flow */}
            <Card className="border border-[var(--border)] bg-[var(--bg)]">
              <div className="border-b border-[var(--border)] px-3 py-2">
                <p className="text-xs font-semibold text-[var(--text)]">
                  모임 생성 흐름
                </p>
                <p className="text-xs text-[var(--text-subtle)]">
                  현재 meetingUuid가 있으면 동일 모임 컨텍스트로 이동합니다.
                </p>
              </div>

              <div className="p-2">
                <div className="space-y-1">
                  {MENUS.map(({ label, href, icon: Icon }) => (
                    <Button
                      key={href}
                      type="button"
                      variant="outline"
                      onClick={() => handleNavigate(href)}
                      className="w-full justify-between border-[var(--border)] bg-[var(--bg)] px-3 py-3"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-[var(--text-subtle)]" />
                        <span className="text-sm text-[var(--text)]">
                          {label}
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-[var(--text-subtle)]" />
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Global Footer */}
          <Footer />
          
          {/* Bottom CTA area */}
          <div className="border-t border-[var(--border)] bg-[var(--bg)] p-4">
            {isLoggedIn ? (
              <Button
                type="button"
                onClick={handleLogout}
                className="w-full gap-2 bg-[var(--danger)] text-[var(--primary-foreground)]"
              >
                <LogOut className="h-5 w-5" />
                로그아웃
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleLoginClick}
                className="w-full bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                카카오 로그인
              </Button>
            )}

            <div className="mt-2 text-center text-xs text-[var(--text-subtle)]">
              메뉴를 닫으려면 바깥 영역을 눌러도 됩니다.
            </div>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}

// ✅ Suspense로 감싸서 export
export default function HamburgerMenu(props: HamburgerMenuProps) {
  return (
    <Suspense fallback={null}>
      <HamburgerMenuContent {...props} />
    </Suspense>
  );
}
