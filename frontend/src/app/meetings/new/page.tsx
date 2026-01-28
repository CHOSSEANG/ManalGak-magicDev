"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  return (
    <main className="space-y-6">
      {/* ===== Header ===== */}
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--text)]">
          모임 리스트
        </h1>
        <p className="text-sm text-[var(--text-subtle)]">
          내 모임을 조회, 수정, 복사할 수 있습니다.
        </p>
      </section>

      {/* ===== Primary CTA ===== */}
      <Button
        onClick={() => router.push("/meetings/new/step1-basic")}
        className="w-full gap-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]"
      >
        <CalendarPlus className="h-5 w-5" />
        모임 생성하기
      </Button>

      {/* ===== List Card ===== */}
      <Card className="divide-y border-[var(--border)] bg-[var(--bg)]">
        {isLoading && (
          <div className="py-12 text-center text-sm text-[var(--text-subtle)]">
            불러오는 중…
          </div>
        )}

        {error && (
          <div className="py-12 text-center text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        {!isLoading && existingMeetings.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--text-subtle)]">
            아직 생성된 모임이 없습니다.
          </div>
        )}

        {existingMeetings.map(({ meeting }) => {
          const isOrganizer = user?.id === meeting.organizerId;

          return (
            <div
              key={meeting.meetingUuid}
              className="space-y-2 px-4 py-3"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {meeting.meetingName}
                  </p>
                  <p className="text-xs text-[var(--text-subtle)]">
                    {formatDateTime(meeting.meetingTime)} ·{" "}
                    {meeting.totalParticipants}명
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleEdit(
                        meeting.meetingUuid!,
                        meeting.organizerId
                      )
                    }
                    className={
                      isOrganizer
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--neutral-soft)] text-[var(--text)]"
                    }
                  >
                    {isOrganizer ? "수정" : "조회"}
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
                    onClick={() =>
                      handleDelete(
                        meeting.meetingUuid!,
                        meeting.organizerId
                      )
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
      </Card>

      {/* ===== Pagination ===== */}
      {pageInfo && !pageInfo.last && (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="w-full max-w-sm"
          >
            {isLoadingMore ? "불러오는 중…" : "더보기"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-[var(--text-subtle)]">
            {existingMeetings.length} / {pageInfo.totalElements}
          </p>
        </div>
      )}
    </main>
  );
}
