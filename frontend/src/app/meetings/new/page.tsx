// src/app/meetings/new/page.tsx
// 모임 리스트 페이지 
"use client";

import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarPlus, ChevronDown, Users } from "lucide-react";

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
  status?: 'PENDING' | 'COMPLETED';
  selectedPlace?: {
    placeId?: string;
    placeName?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  participants: Array<{
    destination?: {
      address?: string;
    };
  }>;
}

interface MeetingItem {
  meeting: Meeting;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-soft)] px-4 py-6 text-center">
      <p className="text-sm text-[var(--text-subtle)]">
        아직 생성된 모임이 없습니다.
      </p>
      <p className="mt-1 text-xs text-[var(--text-subtle)]">
        아래 버튼으로 새 모임을 만들어 보세요.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-40 bg-[var(--neutral-soft)]" />
      <Skeleton className="h-4 w-64 bg-[var(--neutral-soft)]" />
      <Skeleton className="h-16 w-full bg-[var(--neutral-soft)]" />
      <Skeleton className="h-16 w-full bg-[var(--neutral-soft)]" />
    </div>
  );
}

export default function CreateEntryPage() {
  const router = useRouter();
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
  const fetchMeetings = async (page: number, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

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
    } catch (err) {
      console.error("모임 불러오기 실패", err);
      setError("모임을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchMeetings(0);
  }, []);

  const handleLoadMore = () => {
    const next = currentPage + 1;
    setCurrentPage(next);
    fetchMeetings(next, true);
  };

  const handleEdit = (uuid: string, organizerId: number) => {
    const readonly = user?.id !== organizerId ? "&readonly=true" : "";
    router.push(`/meetings/new/step3-meeting?meetingUuid=${uuid}${readonly}`);
  };

  const handleView = (meetingUuid: string) => {
    router.push(`/meetings/${meetingUuid}/complete`);
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
    if (user?.id !== organizerId) return alert("모임장이 아닙니다.");

    if (!confirm("정말 이 모임을 삭제하시겠어요?")) return;

    await axios.delete(`${API_BASE_URL}/v1/meetings/${uuid}`, {
      withCredentials: true,
    });

    setExistingMeetings((prev) =>
      prev.filter((item) => item.meeting.meetingUuid !== uuid)
    );
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
  if (isLoading) {
    listState = <LoadingState />;
  } else if (error) {
    listState = (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--danger-soft)] px-4 py-6 text-center">
        <p className="text-sm text-[var(--danger)]">{error}</p>
      </div>
    );
  } else if (existingMeetings.length === 0) {
    listState = <EmptyState />;
  }

  return (
    <main className="min-h-[calc(100dvh-1px)] bg-[var(--bg)] px-4 py-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        {/* ===== Header ===== */}
        <section className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            모임 리스트
          </h2>
          <p className="text-sm text-[var(--text-subtle)]">
            내 모임을 조회, 수정, 복사할 수 있습니다.
          </p>
        </section>

        {/* ===== Primary CTA ===== */}
            <Button
              onClick={() => router.push("/meetings/new/step1-basic")}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] py-6"
            >
              <CalendarPlus className="h-5 w-5" />
              모임 생성하기
            </Button>

       {/* ===== List Section ===== */}
      <section className="space-y-3">
        {listState}

          {!listState && (
            <div className="divide-y divide-[var(--border)] bg-[var(--bg)]">
              {existingMeetings.map(({ meeting }) => {
                const isOrganizer = user?.id === meeting.organizerId;
                const isCompleted = meeting.status === 'COMPLETED';

                const primaryLabel = isCompleted ? "조회" : "수정";

                const handlePrimaryAction = () => {
                  if (isCompleted) {
                    handleView(meeting.meetingUuid!);
                  } else {
                    handleEdit(meeting.meetingUuid!, meeting.organizerId);
                  }
                };

                return (
                  <div
                    key={meeting.meetingUuid}
                    className="px-0 py-3"
                  >
                    <div className="flex items-start gap-4">
                      {/* ===== 인원수 영역 ===== */}
                      <div className="relative flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-[var(--primary-soft)]">
                        <Users className="h-5 w-5 text-[var(--primary)]" />
                        {meeting.totalParticipants > 0 && (
                          <span className="absolute -right-1 -bottom-1 min-w-4 h-3 px-1 rounded-full bg-[var(--primary-soft)] text-sm leading-4 text-center font-medium text-[var(--text)]">
                            {meeting.totalParticipants}
                          </span>
                        )}
                      </div>

                      {/* ===== 텍스트 정보 ===== */}
                      <div className="flex-1 space-y-1">
                        {/* 1줄: 모임명 + 상태 뱃지 */}
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-[var(--text)] truncate">
                            {meeting.meetingName}
                          </p>
                          {/* ✅ 모임장 뱃지 추가 */}
                          {isOrganizer && (
                            <span className="shrink-0 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
                              모임장
                            </span>
                          )}
                          {isCompleted && (
                            <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                              확정
                            </span>
                          )}
                        </div>

                      {/* 2줄: 장소 · 날짜 */}
                      <p className="text-sm text-[var(--text-subtle)]">
                        {meeting.selectedPlace?.placeName || "장소 미정"}
                        <span className="mx-2">·</span>
                        {formatDateTime(meeting.meetingTime)}
                      </p>
                    </div>

                      {/* ===== 액션 영역 ===== */}
                      <div className="shrink-0">
                        {/* 데스크톱 버튼 */}
                        <div className="hidden sm:flex gap-2">
                          <Button
                            size="sm"
                            onClick={handlePrimaryAction}
                            className={
                              isCompleted
                                ? "bg-[var(--neutral-soft)] text-[var(--text)]"
                                : "bg-[var(--primary)] text-[var(--primary-foreground)]"
                            }
                          >
                            {primaryLabel}
                          </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(meeting.meetingUuid!)}
                        >
                          복사
                        </Button>

                          <Button
                            size="sm"
                            disabled={!isOrganizer}
                            onClick={() =>
                              handleDelete(meeting.meetingUuid!, meeting.organizerId)
                            }
                            className="bg-[var(--danger-soft)] text-[var(--danger)] disabled:opacity-40"
                          >
                            삭제
                          </Button>
                        </div>

                      {/* 모바일 … 메뉴 */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 rounded-md hover:bg-[var(--bg-soft)]"
                              aria-label="더보기"
                            >
                              …
                            </button>
                          </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={handlePrimaryAction}>
                                {primaryLabel}
                              </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleCopy(meeting.meetingUuid!)}
                            >
                              복사
                            </DropdownMenuItem>

                              <DropdownMenuItem
                                disabled={!isOrganizer || isCompleted}
                                onClick={() =>
                                  handleDelete(
                                    meeting.meetingUuid!,
                                    meeting.organizerId
                                  )
                                }
                                className="text-destructive"
                              >
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
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