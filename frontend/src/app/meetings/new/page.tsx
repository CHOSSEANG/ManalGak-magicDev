// src/app/meetings/new/page.tsx
"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import StepNavigation from "@/components/layout/StepNavigation"
import StepCard from "@/components/meeting/StepCard"
import { useMeetingStore } from "@/stores/meetingDraft.store"   // 추가
import { Meeting } from "@/stores/meetingDraft.store"
interface PageInfo {
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}
interface MeetingItem {
  meeting: Meeting
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

export default function CreateEntryPage() {
  const router = useRouter()
  const [existingMeetings, setExistingMeetings] = useState<MeetingItem[]>([])
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const setMeetingData = useMeetingStore((state) => state.setMeetingData) // 추가

  // 현재 사용자 정보 가져오기
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentUserId(data.userId || data.data?.userId || data.id)
      }
    } catch (err) {
      console.error("사용자 정보 불러오기 실패", err)
    }
  }

  const fetchMeetings = async (page: number, append: boolean = false) => {
    try {
      if (append) setIsLoadingMore(true)
      else setIsLoading(true)

      const res = await axios.get(`${API_BASE_URL}/v1/meetings/user?page=${page}`, {
        withCredentials: true
      })

      if (res.data?.data?.content) {
        if (append) setExistingMeetings(prev => [...prev, ...res.data.data.content])
        else setExistingMeetings(res.data.data.content)

        setPageInfo({
          totalElements: res.data.data.totalElements,
          totalPages: res.data.data.totalPages,
          size: res.data.data.size,
          number: res.data.data.number,
          first: res.data.data.first,
          last: res.data.data.last,
          empty: res.data.data.empty
        })
      } else {
        setExistingMeetings([])
      }
    } catch (err) {
      console.error("모임 불러오기 실패", err)
      setError("모임을 불러오는데 실패했습니다.")
      setExistingMeetings([])
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
    fetchMeetings(0)
  }, [])

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchMeetings(nextPage, true)
  }

  const handleEdit = async (meetingUuid: string, organizerId: number) => {
    if (currentUserId !== organizerId) {
      alert("모임장이 아닙니다.")
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/v1/meetings/${meetingUuid}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setMeetingData(data.data) // ✅ 글로벌 상태에 저장
        router.push(`/meetings/new/step1-basic`) // 데이터 스토어로 스텝1 이동
      } else {
        alert("모임 정보를 불러오는데 실패했습니다.")
      }
    } catch (err) {
      console.error("모임 정보 불러오기 실패", err)
      alert("모임 정보를 불러오는데 실패했습니다.")
    }
  }

  const handleCopy = async (meetingUuid: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/meetings/${meetingUuid}/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (response.ok) {
        router.push('/meetings/new/step1-basic')
      } else {
        alert("모임 복사에 실패했습니다.")
      }
    } catch (err) {
      console.error("모임 복사 실패", err)
      alert("모임 복사에 실패했습니다.")
    }
  }

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${d} ${hh}:${mm}`
}


  return (
    <>
      <main className="space-y-6 pb-28">
        <section className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">모임 리스트 보기</h1>
            <p className="text-sm text-[var(--wf-subtle)]">
              모임의 이름을 정하고, 설정을 시작해 주세요
            </p>
          </div>

          <StepCard className="space-y-3">
            <h2 className="text-base font-semibold">기존 모임에서 시작하기</h2>
            <p className="text-xs text-[var(--wf-subtle)]">
              이전 모임을 불러와 빠르게 생성할 수 있어요
            </p>

            {isLoading ? (
              <div className="text-center py-8 text-sm text-[var(--wf-subtle)]">불러오는 중...</div>
            ) : error ? (
              <div className="text-center py-8 text-sm text-red-500">{error}</div>
            ) : existingMeetings.length === 0 ? (
              <div className="text-center py-8 text-sm text-[var(--wf-subtle)]">아직 생성된 모임이 없습니다.</div>
            ) : (
              <>
                <div className="space-y-3">
                  {existingMeetings.map((item, index) => {
                    const { meeting } = item
                    const place = meeting.participants[0]?.destination?.address || "장소 미정"
                    const isOrganizer = currentUserId === meeting.organizerId

                    return (
                      <div
                        key={meeting.meetingUuid || `meeting-${meeting.organizerId}-${index}`}
                        className="rounded-xl border border-[var(--wf-border)] bg-[var(--wf-muted)] p-4 space-y-2"
                      >
                        <div className="flex justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold">{meeting.meetingName}</p>
                            <p className="text-xs text-[var(--wf-subtle)]">{formatDateTime(meeting.meetingTime)} · {meeting.totalParticipants}명</p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(meeting.meetingUuid!, meeting.organizerId)}
                              className={`rounded-lg px-3 py-1 text-xs font-medium text-white transition-opacity ${
                                isOrganizer ? 'bg-[var(--wf-accent)] hover:opacity-90' : 'bg-gray-400 cursor-not-allowed'
                              }`}
                            >수정</button>
                            <button
                              onClick={() => handleCopy(meeting.meetingUuid!)}
                              className="rounded-lg bg-[var(--wf-accent)] px-3 py-1 text-xs font-medium text-white hover:opacity-90 transition-opacity"
                            >복사</button>
                          </div>
                        </div>
                        <p className="text-xs text-[var(--wf-subtle)]">{place}</p>
                      </div>
                    )
                  })}
                </div>

                {pageInfo && !pageInfo.last && (
                  <div className="pt-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="w-full rounded-xl border border-[var(--wf-border)] bg-white py-3 text-sm font-medium text-[var(--wf-foreground)] hover:bg-[var(--wf-muted)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoadingMore ? "불러오는 중..." : "더보기"}
                    </button>
                    <p className="text-center text-xs text-[var(--wf-subtle)] mt-2">{existingMeetings.length} / {pageInfo.totalElements}개</p>
                  </div>
                )}
              </>
            )}
          </StepCard>
        </section>
      </main>

      <StepNavigation prevHref="/auth/kakao/callback" nextHref="/meetings/new/step1-basic" />
    </>
  )
}
