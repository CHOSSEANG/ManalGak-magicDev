// src/app/meetings/new/page.tsx
// 모임 리스트 페이지 
"use client";

import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import { CalendarPlus, ChevronDown } from "lucide-react";

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
    router.push(`/meetings/new/step1-basic?meetingUuid=${uuid}${readonly}`);
  };

  const handleCopy = async (uuid: string) => {
    const res = await fetch(`${API_BASE_URL}/v1/meetings/${uuid}/copy`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    router.push(
      `/meetings/new/step1-basic?meetingUuid=${data?.data?.meeting?.meetingUuid}`
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
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-[var(--text)]">모임 리스트</CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              내 모임을 조회, 수정, 복사할 수 있습니다.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* ===== Primary CTA ===== */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardContent className="flex items-center justify-between gap-3 py-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--text)]">
                새 모임 만들기
              </p>
              <p className="text-xs text-[var(--text-subtle)]">
                기본 정보를 입력하고 다음 단계로 진행합니다.
              </p>
            </div>
            <Button
              onClick={() => router.push("/meetings/new/step1-basic")}
              className="gap-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              <CalendarPlus className="h-5 w-5" />
              모임 생성하기
            </Button>
          </CardContent>
        </Card>

        {/* ===== List Card ===== */}
        <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[var(--text)]">내 모임</CardTitle>
            <CardDescription className="text-[var(--text-subtle)]">
              최근 생성된 모임부터 확인합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {listState}

            {!listState && (
              <ScrollArea className="max-h-[60vh] pr-1">
                <div className="divide-y border border-[var(--border)] rounded-xl bg-[var(--bg)]">
                  {existingMeetings.map(({ meeting }) => {
                    const isOrganizer = user?.id === meeting.organizerId;

                    let primaryBtnClass = "bg-[var(--neutral-soft)] text-[var(--text)]";
                    let primaryLabel = "조회";
                    if (isOrganizer) {
                      primaryBtnClass =
                        "bg-[var(--primary)] text-[var(--primary-foreground)]";
                      primaryLabel = "수정";
                    }

                    return (
                      <div key={meeting.meetingUuid} className="space-y-2 px-4 py-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium text-[var(--text)]">
                              {meeting.meetingName}
                            </p>
                            <p className="text-xs text-[var(--text-subtle)]">
                              {formatDateTime(meeting.meetingTime)} ·{" "}
                              {meeting.totalParticipants}명
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleEdit(meeting.meetingUuid!, meeting.organizerId)
                              }
                              className={primaryBtnClass}
                            >
                              {primaryLabel}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopy(meeting.meetingUuid!)}
                              className="border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
                            >
                              복사
                            </Button>

                            <Button
                              size="sm"
                              onClick={() =>
                                handleDelete(meeting.meetingUuid!, meeting.organizerId)
                              }
                              disabled={!isOrganizer}
                              className="bg-[var(--danger-soft)] text-[var(--danger)]"
                            >
                              삭제
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-[var(--text-subtle)]">
                          {meeting.selectedPlace?.placeName || "장소 미정"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* ===== Pagination ===== */}
        {pageInfo && !pageInfo.last && (
          <Card className="border-[var(--border)] bg-[var(--bg-soft)]">
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <Button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                variant="outline"
                className="w-full max-w-sm border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
              >
                {isLoadingMore ? "불러오는 중…" : "더보기"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>

              <Separator className="w-full bg-[var(--border)]" />

              <p className="text-xs text-[var(--text-subtle)]">
                {existingMeetings.length} / {pageInfo.totalElements}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
