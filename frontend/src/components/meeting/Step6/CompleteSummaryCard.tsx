// src/components/meeting/CompleteSummaryCard.tsx
'use client'
// import { useUser } from "@/context/UserContext"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'

import {
  Users,
  Calendar,
  MapPinned,
  Phone,
  Send,
  Coffee,
  BadgeCheck,
} from 'lucide-react'

export interface MeetingSummary {
  meetingName: string
  dateTime: string
  memberCount?: number
  placeName: string
  address: string
  parkingInfo: string
  reservationInfo: string
  phoneNumber: string
  organizerId: number
}

interface Props {
  meeting: MeetingSummary
}

interface PlaceResponse {
  placeName: string
  address: string
  phone: string
  latitude : number
  longitude : number
}

export default function CompleteSummaryCard({ meeting }: Props) {
  const {
    meetingName,
    dateTime,
    memberCount,
  } = meeting




  const [place, setPlace] = useState<PlaceResponse | null>(null)

  const params = useParams()
  const meetingUuid = params.meetingId  as string

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

  const placeName = place?.placeName ?? ''
  const address = place?.address ?? ''
  const phoneNumber = place?.phone ?? ''
  // const { user } = useUser()
  // const isOrganizer = Number(user?.id) === Number(meeting.organizerId)

const formatDateTime = (isoString?: string) => {
  if (!isoString) return '-'

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return '-'

  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')

  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const period = hours < 12 ? '오전' : '오후'
  const displayHour = hours % 12 || 12

  return `${yyyy}.${mm}.${dd} ${period} ${displayHour}:${minutes}`
}


const lat = typeof place?.latitude === 'number' ? place.latitude : null
const lng = typeof place?.longitude === 'number' ? place.longitude : null


  useEffect(() => {
    if (!meetingUuid) return
    const fetchPlace = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/v1/meetings/${meetingUuid}/place`,
          { withCredentials: true }
        )

        // 장소 미확정 (success는 true지만 data가 null인 경우)
        if (!res.data?.data) {
          setPlace(null)
          return
        }

        setPlace(res.data.data)
       } catch (error) {
              console.error('장소 정보를 가져오는데 실패했습니다:', error);
       }
    }

    fetchPlace()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingUuid])


  const updateMeetingStatus = async () => {
    await axios.patch(
      `${API_BASE_URL}/v1/meetings/${meetingUuid}`,
      { status: 'COMPLETED' },
      { withCredentials: true }
    )
  }

const handleSendKakao = async () => {
  if (typeof window === "undefined") return

  try {
    // ✅ 1. 모임 상태 확정
    await updateMeetingStatus()

    // Kakao SDK 없음
    if (!window.Kakao) {
      alert('카카오 SDK가 로드되지 않았어요.')
      return
    }

    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY)
    }

    // ✅ 2. 카카오 공유
    window.Kakao.Share.sendCustom({
      templateId: 128597,
      templateArgs: {
        meetingName,
        meetingDate: formatDateTime(dateTime),
        count: memberCount ? String(memberCount) : '-',
        address: placeName,
        lat: lat ? String(lat) : '',
        lng: lng ? String(lng) : '',
        number: phoneNumber || '-',
        place: placeName,
      },
    })
  } catch (error) {
    console.error('확정/공유 실패:', error)
    fallbackShare()
  }
}


const fallbackShare = async () => {
  const url = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({
        title: '확정된 모임 장소',
        text: `${meetingName} 모임 장소가 확정되었습니다.`,
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      alert('링크가 복사되었습니다.\n카카오톡에 붙여넣어 공유해주세요.')
    }
  } catch (error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name: string }).name === 'AbortError'
  ) {
    return
  }

  console.error('공유 중 오류:', error)
}
}
  

const handleDirection = () => {
    if (!placeName || lat === null || lng === null) return
    const url = `https://map.kakao.com/link/to/${encodeURIComponent(placeName)},${lat},${lng}`
    window.open(url, '_blank')
}

  return (
    <section className="space-y-4 px-4">
      <div className="space-y-5 rounded-2xl border-none shadow-none">
        <div className="space-y-4">
          {/* 모임명 */}
          <div className="flex gap-4 items-center ">
             <BadgeCheck className="h-6 w-6" stroke="var(--primary)" />
              {/* <p className="text-xs font-light text-[var(--wf-accent)]">
                모임명 · 참여인원
              </p> */}
              <p className="">
                {meetingName} 
              </p>
          </div>

          {/* 인원수 */}
          <div className="flex gap-4 items-center ">
             <Users className="h-6 w-6" stroke="var(--primary)" />
              {/* <p className="text-xs font-light text-[var(--wf-accent)]">
                모임명 · 참여인원
              </p> */}
              <p className="">
                {memberCount}명
              </p>
          </div>

          {/* 일시 */}
          <div className="flex gap-4 items-center ">
             <Calendar className="h-6 w-6" stroke="var(--primary)" />
              {/* <p className="text-xs font-light text-[var(--wf-accent)]">
                모임 일시
              </p> */}
              <p className="">
               {formatDateTime(dateTime)}
              </p>
          </div>

          {/* 장소 */}
          <div className="flex gap-4 items-center ">
              <Coffee className="h-6 w-6" stroke="var(--primary)" />

              {place ? (
                <p className="">
                  {placeName}
                </p>
              ) : (
                <p className="text-xs text-[var(--danger)]">
                  ( 아직 장소를 선택하지 않았습니다.)
                </p>
              )}
          </div>

          {/* 주소 + 길찾기 */}
        <div className="flex gap-4 items-center ">
          <div className="flex pt-0.5"> 
            <MapPinned
              className="h-6 w-6"
              stroke="var(--primary)"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              {/* 주소 */}
              <p className="text-base font-medium leading-snug">
                {place ? address : '-'}
              </p>

              {/* 길찾기 버튼 (오른쪽 정렬) */}
              <button
                type="button"
                onClick={handleDirection}
                className="shrink-0"
              >
                <Badge
                  variant="secondary"
                  className="
                    cursor-pointer
                    px-2 py-1
                    rounded-full
                    bg-[--kakao-yellow]
                    text-xs
                    whitespace-nowrap
                  "
                >
                  길찾기
                </Badge>
              </button>
            </div>
          </div>
        </div>


          {/* 전화 */}
          <div className="flex gap-4">
              <Phone className="h-6 w-6" stroke="var(--primary)" />
              <p className="text-base font-medium">
                {place ? phoneNumber : '-'}
              </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 px-0 pb-0">
        {/* 링크 보내기 → 카카오 메시지 */}
        <Button
          type="button"
          onClick={fallbackShare}
          variant="outline"
          className="
            flex items-center gap-2 rounded-xl
            border-[var(--wf-border)]
            bg-[var(--wf-surface)]
            px-4 py-6
            text-sm font-medium text-[var(--text)]
          "
        >
          <Send className="h-4 w-4" />
          링크 보내기
        </Button>

          {/* 확정 장소 메시지 전송 → 링크 공유 */}
          <Button
            type="button"
            onClick={handleSendKakao}
            className="
              group flex flex-1 items-center justify-center gap-2
              rounded-xl
              bg-[var(--wf-highlight)]
              hover:bg-[var(--wf-accent)]
              py-6
              text-lg font-bold text-[var(--text)]
              shadow-xl shadow-yellow-500/20
              transition active:scale-[0.99]
            "
          >
            카카오톡
            <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
    </section>
  )
}