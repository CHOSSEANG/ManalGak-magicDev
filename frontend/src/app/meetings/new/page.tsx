// src/app/meetings/new/page.tsx
// 모임 리스트 페이지
"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";

import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarPlus, ChevronDown, Users } from "lucide-react";
import { MoreHorizontal } from "lucide-react";


/* ======================
 * Types (변경 없음)
 * ====================== */
interface PageInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface Meeting {
  meetingUuid?: string;
  meetingName: string;
  meetingTime: string;
  organizerId: number;
  totalParticipants: number;
  status?: "PENDING" | "COMPLETED";
  selectedPlace?: {
    placeName?: string;
  };
}

interface MeetingItem {
  meeting: Meeting;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

/* ======================
 * UI States
 * ====================== */
function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] px-4 py-6 text-center">
      <p className="text-sm text-[var(--text-subtle)]">
        아직 생성된 모임이 없습니다.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40 bg-[var(--neutral-soft)]" />
      <Skeleton className="h-16 w-full bg-[var(--neutral-soft)]" />
      <Skeleton className="h-16 w-full bg-[var(--neutral-soft)]" />
    </div>
  );
}

/* ======================
 * Page
 * ====================== */
export default function CreateEntryPage() {
  const router = useRouter();
  const pathname = usePathname(); 
  const { user } = useUser();

  const [existingMeetings, setExistingMeetings] = useState<MeetingItem[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ======================
   * Data Fetch (변경 없음)
   * ====================== */
  const fetchMeetings = useCallback(
  async (page: number, append = false) => {
    try {
      if (append) setIsLoadingMore(true);
      else setIsLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/v1/meetings/user?page=${page}`,
        { withCredentials: true }
      );

      if (res.data?.data?.content) {
        if (append) {
          setExistingMeetings((prev) => [...prev, ...res.data.data.content]);
        } else {
          setExistingMeetings(res.data.data.content);
        }
        setPageInfo(res.data.data);
      } else {
        setExistingMeetings([]);
      }

      setError(null);
    } catch {
      // 1/30[유리] - 로그인 여부에 따른 에러 문구 분기
      if (!user) {
        setError("로그인이 필요합니다");
      } else {
        setError("모임을 불러오는 데 실패했습니다");
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  },
  [user]
);

  
  useEffect(() => {
    fetchMeetings(0);
  }, [fetchMeetings]);

  const handleLoadMore = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    fetchMeetings(next, true);
  };

  /* ======================
   * Navigation
   * ====================== */
  const goToConfirmPage = (uuid: string) => {
    router.push(`/meetings/${uuid}/complete`);
  };

  // 1/30[유리] - 카카오 로그인 직접 호출 (DOM 의존 제거)
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
  

  const goToEditPage = (uuid: string) => {
    // 1/30[유리] - 수정 버튼: Step1부터 기존 데이터 로드
    router.push(`/meetings/new/step1-basic?meetingUuid=${uuid}`);
  };

  const handleCopy = async (uuid: string) => {
    const res = await fetch(`${API_BASE_URL}/v1/meetings/${uuid}/copy`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    router.push(
      `/meetings/new/step1-basic?meetingUuid=${data?.data?.meeting?.meetingUuid}&copied=true`
    );
  };

  const handleDelete = async (uuid: string, organizerId: number) => {
    if (user?.id !== organizerId) return;

    if (!confirm("정말 이 모임을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/v1/meetings/${uuid}`, {
        withCredentials: true,
      });

      // 1/30[유리] - 삭제 후 페이지 이동 없이 리스트 갱신
      setExistingMeetings((prev) =>
        prev.filter((item) => item.meeting.meetingUuid !== uuid)
      );

      // /2[유리] - 삭제 후 총 개수(pageInfo.totalElements) 동기화
      setPageInfo((prev) => {
        if (!prev) return prev;

        const newTotalElements = Math.max(0, prev.totalElements - 1);

        return {
          ...prev,
          totalElements: newTotalElements,
          empty: newTotalElements === 0,
        };
      });
    } catch {
      alert("모임 삭제에 실패했습니다.");
    }
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  
  let listState: ReactNode = null;
  if (isLoading) listState = <LoadingState />;
    else if (error) {
      listState = (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--danger-soft)] px-4 py-6 text-center space-y-4">
          <p className="text-sm text-[var(--danger)]">{error}</p>

          {error === "로그인이 필요합니다" && (
          <Button
            onClick={handleKakaoLogin}
            className="bg-[var(--kakao-yellow)] text-black"
          >
            카카오 로그인
          </Button>
        )}
        </div>
      );
    } else if (existingMeetings.length === 0) {
      listState = <EmptyState />;
  }
  

  return (
    <main className="min-h-[calc(100dvh-1px)] bg-[var(--bg)] pt-4 pb-28">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        {/* ===== Header ===== */}
        <section className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            모임 리스트
          </h2>
          <p className="text-sm text-[var(--text-subtle)]">
            최근 생성순이 아닌, 최근 조회/활동 기준으로 정렬됩니다
          </p>
        </section>

        {/* ===== Primary CTA (변경 금지) ===== */}
        <Button
          onClick={() => router.push("/meetings/new/step1-basic")}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] py-6"
        >
          <CalendarPlus className="h-5 w-5" />
          모임 생성하기
        </Button>

        {/* ===== List ===== */}
        <section className="space-y-3">
          {listState}

          {!listState && (
            <div className="divide-y divide-[var(--border)]">
              {existingMeetings.map(({ meeting }) => {
                const isOrganizer = user?.id === meeting.organizerId;
                const isCompleted = meeting.status === "COMPLETED";
                
                return (
                  <div key={meeting.meetingUuid} className="py-3 overflow-x-hidden">
                    <div className="flex gap-4 items-start">
                      <div className="relative w-9 h-9 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                        <Users className="h-5 w-5 text-[var(--primary)]" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold truncate">
                            {meeting.meetingName}
                          </p>

                          {isOrganizer && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800">
                              모임장
                            </span>
                          )}

                          {meeting.status === "COMPLETED" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-200 text-green-800">
                              확정
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-[var(--text-subtle)]">
                          {meeting.selectedPlace?.placeName || "장소 미정"} ·{" "}
                          {formatDateTime(meeting.meetingTime)}
                        </p>
                      </div>

                      {/* ===== Actions ===== */}
                      <div className="shrink-0">
                      <div className="hidden sm:flex gap-2">
                        {isOrganizer && !isCompleted && (
                          <Button
                            size="sm"
                            className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded"
                            onClick={() =>
                              goToEditPage(meeting.meetingUuid!)
                            }
                          >
                            수정
                          </Button>
                        )}

                        <Button
                          size="sm"
                          className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded"
                          onClick={() =>
                            goToConfirmPage(meeting.meetingUuid!)
                          }
                        >
                          조회
                        </Button>

                        <Button
                          size="sm"
                          className="bg-[var(--primary-base)] text-[var(--primary)] rounded"
                          onClick={() => handleCopy(meeting.meetingUuid!)}
                        >
                          복사
                        </Button>

                        {isOrganizer && (
                          <Button
                            size="sm"
                            className="bg-[var(--danger-soft)] text-[var(--danger)] rounded"
                            onClick={() =>
                              handleDelete(
                                meeting.meetingUuid!,
                                meeting.organizerId
                              )
                            }
                          >
                            삭제
                          </Button>
                        )}
                      </div>
                      
                      {/* ===== Mobile Dropdown ===== */}
                      <div className="sm:hidden">
                        <DropdownMenu  modal={false}>
                          <DropdownMenuTrigger asChild>
                            <button
                                className="p-2 rounded-md hover:bg-[var(--bg-soft)]
                              "
                              aria-label="더보기"
                            >
                              <MoreHorizontal className="h-5 w-5 text-[var(--text)]" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuPortal>
                            <DropdownMenuContent
                              align="end"
                              className="bg-[var(--bg)] border border-[var(--border)] shadow-md overflow-hidden"
                            >
                              {isOrganizer && (
                                  <DropdownMenuItem
                                    className="hover:bg-[var(--primary-soft)] focus:bg-[var(--primary-soft)]"
                                    onClick={() => goToEditPage(meeting.meetingUuid!)}
                                  >
                                  수정
                                </DropdownMenuItem>
                              )}

                                <DropdownMenuItem
                                  className="hover:bg-[var(--primary-soft)] focus:bg-[var(--primary-soft)]"
                                  onClick={() => goToConfirmPage(meeting.meetingUuid!)}>
                                조회
                              </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="hover:bg-[var(--primary-soft)] focus:bg-[var(--primary-soft)]"
                                  onClick={() => handleCopy(meeting.meetingUuid!)}>
                                복사
                              </DropdownMenuItem>

                              {isOrganizer && (
                                  <DropdownMenuItem
                                    className="hover:bg-[var(--primary-soft)] focus:bg-[var(--primary-soft)]"
                                  onClick={() => handleDelete(meeting.meetingUuid!, meeting.organizerId)}
                                >
                                  삭제
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenuPortal>
                        </DropdownMenu>
                      </div>
                    </div>
                      </div>
                    </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ===== Pagination ===== */}
        {pageInfo && !pageInfo.last && (
          <div className="flex flex-col items-center gap-2 py-4">
            <Button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              variant="outline"
              className="w-full max-w-sm border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
            >
              {isLoadingMore ? "불러오는 중…" : "더보기"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-[var(--text-subtle)]">
              {existingMeetings.length} 개 / 총 {pageInfo.totalElements} 개
            </p>
            </div>
          )}
      </div>
    </main>
  );
}
