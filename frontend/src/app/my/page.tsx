// src/pages/my/page.tsx
"use client";

import WireframeModal from "@/components/ui/WireframeModal";
import AddressSearch from "@/components/map/AddressSearch";
import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import ProfileIdentity from "@/components/layout/ProfileIdentity";
import Link from "next/link";
import clsx from "clsx";
import { LocateFixed, Calculator } from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

/* ======================
 * Config (변경 없음)
 * ====================== */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

/** ===== 타입 ===== */
interface Bookmark {
  id: number; // userAddressId (신규는 0)
  label: string; // category
  address: string;
  latitude?: number;
  longitude?: number;
  isEditing: boolean;
}

/** 🔥 주소 API 응답 타입 */
interface UserAddressResponse {
  id: number;
  category: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

function LoadingBlock() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-40 bg-[var(--neutral-soft)]" />
      <Skeleton className="h-4 w-64 bg-[var(--neutral-soft)]" />
      <Skeleton className="h-16 w-full bg-[var(--neutral-soft)]" />
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] px-4 py-3">
      <p className="text-sm text-[var(--text-subtle)]">{text}</p>
    </div>
  );
}

export default function MyPage() {
  const router = useRouter();

  /** ===== 로그인 사용자 ===== */
  const { user, setUser } = useUser(); // 🔥 Context에서 가져오기

  /** ===== 주소 북마크 ===== */
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  /** ===== 주소 검색 ===== */
  const [activeBookmarkIndex, setActiveBookmarkIndex] = useState<number | null>(null);
  const [searchAddressOpen, setSearchAddressOpen] = useState(false);

  /** ===== 초기 로드 ===== */
  useEffect(() => {
    fetchAddresses();
  }, []);

  /** ===== 주소 조회 (항상 3개 유지) ===== */
  const fetchAddresses = async () => {
    const res = await axios.get(`${API_BASE_URL}/v1/addresses/user`, {
      withCredentials: true,
    });

    const data: UserAddressResponse[] = res.data.data || [];

    const mapped: Bookmark[] = data.map((item) => ({
      id: item.id,
      label: item.category,
      address: item.address,
      latitude: item.latitude,
      longitude: item.longitude,
      isEditing: false,
    }));

    // 🔥 항상 3칸 유지
    const filled: Bookmark[] = [
      ...mapped,
      ...Array.from({ length: 3 - mapped.length }).map(() => ({
        id: 0,
        label: "",
        address: "",
        isEditing: true,
      })),
    ].slice(0, 3);

    setBookmarks(filled);
  };

  /** ===== 주소 저장 / 수정 ===== */
  const saveBookmark = async (index: number) => {
    const target = bookmarks[index];

    const payload = {
      address: target.address,
      category: target.label,
    };

    if (target.id !== 0) {
      await axios.patch(`${API_BASE_URL}/v1/addresses/${target.id}`, payload, {
        withCredentials: true,
      });
    } else {
      await axios.post(`${API_BASE_URL}/v1/addresses`, payload, {
        withCredentials: true,
      });
    }

    fetchAddresses();
  };

  /** ===== 주소 삭제 ===== */
  const deleteBookmark = async (id: number) => {
    await axios.delete(`${API_BASE_URL}/v1/addresses/${id}`, {
      withCredentials: true,
    });
    fetchAddresses();
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) setIsLoading(false);
  }, [user]);

  /** ===== 로그아웃 ===== */
  const handleAuthButton = async () => {
    if (user) {
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      setUser(null); // Context 상태 업데이트
    }
    router.replace("/");
  };

  let authLabel = "로그인";
  if (user) {
    authLabel = "로그아웃";
  }

  let authHint: ReactNode = null;
  if (!user) {
    authHint = (
      <p className="text-xs text-[var(--text-subtle)]">
        로그인하면 저장된 북마크를 불러올 수 있어요.
      </p>
    );
  }

  let bookmarkIntro: ReactNode = null;
  if (bookmarks.length === 0) {
    bookmarkIntro = (
      <EmptyHint text="출발지 북마크가 아직 없습니다. 첫 주소를 저장해 보세요." />
    );
  }

  return (
    <>
      <main className="min-h-[calc(100dvh-1px)] bg-[var(--bg)] px-4 py-6">
        <div className="mx-auto w-full max-w-3xl space-y-4">
          {/* ===== Header ===== */}
          <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
            <CardHeader className="space-y-2">
              <CardTitle className="text-[var(--text)]">내 페이지</CardTitle>
              <CardDescription className="text-[var(--text-subtle)]">
                북마크 출발지와 최근 모임을 확인할 수 있어요.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* ===== Profile ===== */}
          <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[var(--text)]">프로필</CardTitle>
              <CardDescription className="text-[var(--text-subtle)]">
                내 계정 상태를 확인하고 로그아웃할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center rounded-xl">
                  {isLoading ? (
                    <LoadingBlock />
                  ) : (
                    <ProfileIdentity
                      src={user?.profileImage}
                      name={user?.name ?? "로그인이 필요합니다"}
                      isLoading={isLoading}
                      size={52}
                      layout="row"
                      shape="square"
                    />
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleAuthButton}
                  className="shrink-0 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]"
                >
                  {authLabel}
                </Button>
              </div>
              {authHint}
            </CardContent>
          </Card>

          {/* ===== Bookmark ===== */}
          <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[var(--text)]">
                출발지 북마크
              </CardTitle>
              <CardDescription className="text-[var(--text-subtle)]">
                자주 가는 출발지를 최대 3개까지 등록하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookmarkIntro}

              {bookmarks.map((item, index) => {
                let rowAction: ReactNode = null;
                if (item.isEditing) {
                  rowAction = (
                    <Button
                      type="button"
                      disabled={!item.address}
                      onClick={() => saveBookmark(index)}
                      className="rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-40"
                    >
                      저장
                    </Button>
                  );
                } else {
                  rowAction = (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() =>
                          setBookmarks((prev) =>
                            prev.map((b, i) =>
                              i === index ? { ...b, isEditing: true } : b
                            )
                          )
                        }
                        className="rounded-md border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                      >
                        수정
                      </Button>
                      {item.id !== 0 && (
                        <Button
                          type="button"
                          onClick={() => deleteBookmark(item.id)}
                          className="rounded-md bg-[var(--danger-soft)] text-[var(--danger)]"
                        >
                          삭제
                        </Button>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-3 sm:flex-row sm:items-center"
                  >
                    <input
                      type="text"
                      placeholder="라벨"
                      value={item.label}
                      disabled={!item.isEditing}
                      onChange={(e) =>
                        setBookmarks((prev) =>
                          prev.map((b, i) =>
                            i === index ? { ...b, label: e.target.value } : b
                          )
                        )
                      }
                      className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] disabled:bg-[var(--neutral-soft)]"
                    />

                    <Button
                      type="button"
                      disabled={!item.isEditing}
                      onClick={() => {
                        setActiveBookmarkIndex(index);
                        setSearchAddressOpen(true);
                      }}
                      className="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg)] text-left text-sm text-[var(--text)] disabled:bg-[var(--neutral-soft)]"
                    >
                      {item.address || "주소 검색"}
                    </Button>

                    {rowAction}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ===== Quick Actions ===== */}
          <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-[var(--text)]">
                빠른 이동
              </CardTitle>
              <CardDescription className="text-[var(--text-subtle)]">
                자주 사용하는 기능을 바로 실행합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  href="/meetings/location"
                  className={clsx(
                    "flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--neutral-soft)] px-6 py-4 text-base font-semibold text-[var(--text)]"
                  )}
                >
                  <LocateFixed />
                  지도 서비스
                </Link>
                <Link
                  href="/meetings/fee"
                  className={clsx(
                    "flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--neutral-soft)] px-6 py-4 text-base font-semibold text-[var(--text)]"
                  )}
                >
                  <Calculator />
                  회비 계산기
                </Link>
              </div>
              <Separator className="bg-[var(--border)]" />
              <p className="text-xs text-[var(--text-subtle)]">
                필요한 기능이 보이지 않나요? 상단 메뉴에서 전체 기능을 확인하세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <WireframeModal
        open={searchAddressOpen}
        title="주소 검색"
        onClose={() => {
          setSearchAddressOpen(false);
          setActiveBookmarkIndex(null);
        }}
      >
        {activeBookmarkIndex !== null && (
          <AddressSearch
            onSelect={(address: string) => {
              setBookmarks((prev) =>
                prev.map((b, i) =>
                  i === activeBookmarkIndex ? { ...b, address } : b
                )
              );
              setSearchAddressOpen(false);
              setActiveBookmarkIndex(null);
            }}
          />
        )}
      </WireframeModal>
    </>
  );
}
