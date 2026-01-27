// src/components/layout/HamburgerMenu.tsx
// src/components/layout/HamburgerMenu.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Suspense } from 'react'
import { useUser } from "@/context/UserContext"
import ProfileIdentity from '@/components/layout/ProfileIdentity'
import { motion } from "framer-motion";

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
} from 'lucide-react'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MY_MENUS = [
  { label: '내 페이지', href: '/my', icon: User },
  { label: '모임 리스트', href: '/meetings/new', icon: Calendar },
]
const MENUS = [
  { label: '모임 만들기', href: '/meetings/new/step1-basic', icon: SquareMousePointer },
  { label: '참여자 설정', href: '/meetings/new/step2-meetingmembers', icon: Users },
  { label: '추천 장소 선택', href: '/meetings/new/step3-result', icon: MapPin },
  { label: '모임 확정', href: '/meetings/complete', icon: CheckCircle },
]

const isValidUuid = (value: string | null): value is string => {
  if (!value) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

// ✅ 실제 메뉴 내용
function HamburgerMenuContent({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { user, setUser } = useUser()
  const isLoggedIn = !!user
  const isLoading = user === null

  const readonlyParam = searchParams.get('readonly') === 'true'

  const queryMeetingUuidRaw = searchParams.get('meetingUuid')
  const queryMeetingUuid = isValidUuid(queryMeetingUuidRaw)
    ? queryMeetingUuidRaw
    : null

  const pathMeetingUuid = (() => {
    const match = pathname.match(/\/meetings\/([^/]+)/)
    const candidate = match ? match[1] : null
    return isValidUuid(candidate) ? candidate : null
  })()

  const meetingUuid = queryMeetingUuid ?? pathMeetingUuid

  const withMeetingUuid = (href: string) => {
    if (!meetingUuid) return href

    const params = new URLSearchParams()
    params.set('meetingUuid', meetingUuid)
    if (readonlyParam) params.set('readonly', 'true')

    return href.includes('?')
      ? `${href}&${params.toString()}`
      : `${href}?${params.toString()}`
  }

  const handleNavigate = (href: string) => {
    let finalHref = href

    if (href === '/meetings/complete') {
      finalHref = meetingUuid
        ? `/meetings/${meetingUuid}/complete${readonlyParam ? '?readonly=true' : ''}`
        : '/meetings/none'
    } else {
      finalHref = withMeetingUuid(href)
    }

    router.push(finalHref)
    onClose()
  }

  // ✅ 카카오 로그인 (단 1회 선언)
  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY
    const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI

    if (!REST_API_KEY || !REDIRECT_URI) {
      alert("카카오 로그인 설정이 완료되지 않았습니다.")
      return
    }

    const redirectPath = pathname + location.search

    const kakaoAuthUrl =
      "https://kauth.kakao.com/oauth/authorize" +
      `?client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      "&response_type=code" +
      `&state=${encodeURIComponent(redirectPath)}`

    window.location.href = kakaoAuthUrl
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      })
    } catch (err) {
      console.error('로그아웃 API 실패', err)
    } finally {
      setUser(null)
      onClose()
      router.replace('/')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-100 bg-black/30" onClick={onClose}>
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="fixed right-0 top-0 h-full w-[60%] max-w-sm bg-[var(--wf-surface)] p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold"> </span>
          <button
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="rounded-full p-2 hover:bg-[var(--wf-highlight-soft)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Profile */}
        <nav className="space-y-1">
          <div
            // onClick={() => handleNavigate(isLoggedIn ? '/my' : '/')}
            className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition "
          >
            <ProfileIdentity
              src={user?.profileImage}
              name={user?.name ?? '로그인 필요'}
              isLoading={isLoading}
              size={48}
              layout="row"
              shape="square"
            />
          </div>

          {isLoggedIn && MY_MENUS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavigate(href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-[var(--wf-highlight-soft)]"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-[var(--wf-subtle)] " />
                <span>{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>
          ))}
        </nav>

        <div className="my-4 border-t" />

        {/* MEETING */}
        <nav className="space-y-1">
          {MENUS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavigate(href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-[var(--wf-highlight-soft)]"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-[var(--wf-subtle)]" />
                <span>{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>
          ))}
        </nav>
        <div className="my-4 border-t" />

        {/* Bottom Button */}
        <div className="mt-auto pt-6">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 bg-[var(--wf-highlight)] hover:bg-[var(--wf-accent)]"
            >
              <LogOut className="h-5 w-5" />
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => {
                onClose()
                handleKakaoLogin()
              }}
              className="flex w-full items-center justify-center rounded-xl px-4 py-3 bg-[var(--wf-highlight)] hover:bg-[var(--wf-accenttext-white"
            >
              카카오 로그인
            </button>
          )}
        </div>
      </motion.aside>
    </div>
  )
}

// ✅ Suspense로 감싸서 export
export default function HamburgerMenu(props: HamburgerMenuProps) {
  return (
    <Suspense fallback={null}>
      <HamburgerMenuContent {...props} />
    </Suspense>
  )
}
