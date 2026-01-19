// src/app/my/page.tsx
"use client";

import StepCard from "@/components/meeting/StepCard";
import WireframeModal from "@/components/ui/WireframeModal";
import AddressSearch from "@/components/map/AddressSearch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** ===== 타입 ===== */
interface User {
  name: string;
  profileImage?: string;
}

interface Bookmark {
  id: number;
  label: string;
  address: string;
  isEditing: boolean;
}

export default function MyPage() {
  const router = useRouter();

  /** ===== 로그인 사용자 ===== */
  const [user, setUser] = useState<User | null>(null);

  /** ===== 북마크 ===== */
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  /** ✅ 주소 검색 대상 북마크 index */
  const [activeBookmarkIndex, setActiveBookmarkIndex] =
    useState<number | null>(null);

  /** ===== 초기 로드 ===== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedBookmarks = localStorage.getItem("bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    } else {
      setBookmarks(
        Array.from({ length: 3 }).map((_, i) => ({
          id: i,
          label: "",
          address: "",
          isEditing: true,
        }))
      );
    }
  }, []);

  /** ===== 북마크 헬퍼 ===== */
  const updateBookmark = (index: number, data: Partial<Bookmark>) => {
    setBookmarks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, ...data } : b))
    );
  };

  const saveBookmark = (index: number) => {
    setBookmarks((prev) => {
      const next = prev.map((b, i) =>
        i === index ? { ...b, isEditing: false } : b
      );
      localStorage.setItem("bookmarks", JSON.stringify(next));
      return next;
    });
  };

  /** ===== 로그아웃 ===== */
  const handleAuthButton = () => {
    if (user) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
    router.replace("/");
  };

  const [searchAddressOpen, setSearchAddressOpen] = useState(false);

  return (
    <>
      <main className="space-y-8 pb-24">
        {/* ===== Header ===== */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">내 페이지</h1>
          <p className="text-sm text-[var(--wf-subtle)]">
            북마크 출발지와 최근 모임을 확인할 수 있어요.
          </p>
        </div>

        {/* ===== Profile ===== */}
        <StepCard>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden border bg-[var(--wf-muted)] flex items-center justify-center">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="프로필 이미지"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold">
                  {user?.name?.[0] ?? "?"}
                </span>
              )}
            </div>
            <p className="text-base font-semibold">
              {user?.name ?? "로그인이 필요합니다"}
            </p>
          </div>
        </StepCard>

        {/* ===== Bookmark Origins ===== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">출발지 북마크</h2>

          <StepCard className="space-y-3">
            {bookmarks.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                {/* 라벨 */}
                <input
                  type="text"
                  placeholder="라벨"
                  value={item.label}
                  disabled={!item.isEditing}
                  onChange={(e) =>
                    updateBookmark(index, { label: e.target.value })
                  }
                  className="w-24 rounded-md border px-2 py-2 text-sm disabled:bg-[var(--wf-muted)]"
                />

                {/* 주소 검색 */}
               <button
  type="button"
  disabled={!item.isEditing}
  onClick={() => {
    setActiveBookmarkIndex(index);
    setSearchAddressOpen(true);
  }}
  className="flex-1 rounded-md border px-3 py-2 text-left text-sm disabled:bg-[var(--wf-muted)]"
>
  {item.address || "주소 검색"}
</button>

                {/* 저장 / 수정 */}
                {item.isEditing ? (
                  <button
                    type="button"
                    disabled={!item.address}
                    onClick={() => saveBookmark(index)}
                    className="rounded-md bg-[var(--wf-highlight)] px-3 py-2 text-sm font-semibold disabled:opacity-40"
                  >
                    저장
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      updateBookmark(index, { isEditing: true })
                    }
                    className="rounded-md border px-3 py-2 text-sm"
                  >
                    수정
                  </button>
                )}
              </div>
            ))}
          </StepCard>
        </section>

        {/* ===== Recent Meetings ===== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">최근 내 모임 리스트</h2>

          <StepCard className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-3 last:border-b-0">
                <p className="text-sm font-semibold">친구들끼리 친목모임</p>
                <p className="text-xs text-[var(--wf-subtle)]">
                  2026.01.23 12:00 · 서울 어딘가
                </p>
              </div>
            ))}
          </StepCard>
        </section>

        {/* ===== Login / Logout ===== */}
        <button
          type="button"
          onClick={handleAuthButton}
          className="w-full rounded-2xl bg-[var(--wf-highlight)] px-6 py-4 text-sm font-semibold"
        >
          {user ? "로그아웃" : "로그인"}
        </button>
      </main>

      {/* ===== 주소 검색 모달 ===== */}
      {/* 주소 검색 모달 (단일 인스턴스) */}
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
              updateBookmark(activeBookmarkIndex, { address });
              setSearchAddressOpen(false);
              setActiveBookmarkIndex(null);
            }}
          />
        )}
      </WireframeModal>
    </>
  );
}
