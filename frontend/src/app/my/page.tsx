// src/pages/my/page.tsx
"use client";

import StepCard from "@/components/meeting/StepCard";
import WireframeModal from "@/components/ui/WireframeModal";
import AddressSearch from "@/components/map/AddressSearch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from '@/context/UserContext'
import ProfileIdentity from '@/components/layout/ProfileIdentity'

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

export default function MyPage() {
  const router = useRouter();

  /** ===== 로그인 사용자 ===== */
  const { user , setUser} = useUser(); // 🔥 Context에서 가져오기

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

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user !== undefined) setIsLoading(false)
  }, [user])

  /** ===== 로그아웃 ===== */
  const handleAuthButton = async () => {
    if (user) {
      await axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true });
      setUser(null); // Context 상태 업데이트
    }
    router.replace("/");
  };

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
          <div className="flex items-center justify-between gap-4">
            {/* 좌측: 프로필 */}
            <div className="flex cursor-pointer items-center rounded-xl transition hover:bg-[var(--wf-accent)]">
              <ProfileIdentity
                src={user?.profileImage}
                name={user?.name ?? '로그인이 필요합니다'}
                isLoading={isLoading}
                size={52}
                layout="row"
                shape="square"
              />
            </div>

            {/* 우측: 버튼 */}
            <button
              type="button"
              onClick={handleAuthButton}
              className="shrink-0 rounded-xl bg-[var(--wf-highlight)] px-10 py-3 text-sm font-bold"
            >
              {user ? "로그아웃" : "로그인"}
            </button>
          </div>
        </StepCard>

        {/* ===== Bookmark ===== */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">출발지 북마크</h2>

          <StepCard className="space-y-3">
            {bookmarks.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
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
                  className="w-24 rounded-md border px-2 py-2 text-sm disabled:bg-[var(--wf-muted)]"
                />

                <button
                  type="button"
                  disabled={!item.isEditing}
                  onClick={() => {
                    setActiveBookmarkIndex(index);
                    setSearchAddressOpen(true);
                  }}
                  className={`flex-1 rounded-md border px-3 py-2 text-left text-sm disabled:bg-[var(--wf-muted)]`}
                >
                  {item.address || "주소 검색"}
                </button>

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
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setBookmarks((prev) =>
                          prev.map((b, i) =>
                            i === index ? { ...b, isEditing: true } : b
                          )
                        )
                      }
                      className="rounded-md border px-3 py-2 text-sm"
                    >
                      수정
                    </button>
                    {item.id !== 0 && (
                      <button
                        type="button"
                        onClick={() => deleteBookmark(item.id)}
                        className="rounded-md border px-3 py-2 text-sm text-red-500"
                      >
                        삭제
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </StepCard>
        </section>

        
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
