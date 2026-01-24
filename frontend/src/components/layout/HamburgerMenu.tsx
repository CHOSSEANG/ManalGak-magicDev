// src/components/layout/HamburgerMenu.tsx
'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Suspense } from 'react'
import Image from "next/image";
import { useUser } from "@/context/UserContext"

import {
  Calendar,
  SquareMousePointer,
  Users,
  MapPin,
  CheckCircle,
  LocateFixed,
  Calculator,
  LogOut,
  ChevronRight,
  BookA,
} from 'lucide-react'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MY_MENUS = [{ label: '내 모임', href: '/meetings/new', icon: Calendar }]
const MENUS = [
  { label: '모임 만들기', href: '/meetings/new/step1-basic', icon: SquareMousePointer },
  { label: '참여자 설정', href: '/meetings/new/step2-meetingmembers', icon: Users },
  { label: '추천 장소 선택', href: '/meetings/new/step3-result', icon: MapPin },
  { label: '모임 확정', href: '/meetings/complete', icon: CheckCircle },
]
const EXTRA_MENUS = [
  { label: '지도 서비스', href: '/meetings/option-location', icon: LocateFixed },
  { label: '회비 계산기', href: '/meetings/option-fee', icon: Calculator },
]
const ABOUT_MENUS = [{ label: '만날각 소개', href: '/about', icon: BookA }]

const isValidUuid = (value: string | null): value is string => {
  if (!value) return false
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

// ✅ 실제 메뉴 내용 (useSearchParams 사용)
function HamburgerMenuContent({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter()
  const { user, setUser } = useUser()
  const isLoggedIn = !!user
  const isLoading = user === null
  const searchParams = useSearchParams()
  const readonlyParam = searchParams.get('readonly') === 'true';
  const pathname = usePathname()

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
  if (!meetingUuid) return href;

  const params = new URLSearchParams();
  params.set('meetingUuid', meetingUuid);
  if (readonlyParam) params.set('readonly', 'true');

  return href.includes('?') ? `${href}&${params.toString()}` : `${href}?${params.toString()}`;
}
 const handleNavigate = (href: string) => {
     let finalHref = href;

     if (href === '/meetings/complete') {
       finalHref = meetingUuid
         ? `/meetings/${meetingUuid}/complete${readonlyParam ? '?readonly=true' : ''}`
         : '/meetings/none';
     } else if (href === '/meetings/option-location') {
       finalHref = meetingUuid
         ? `/meetings/${meetingUuid}/option-location${readonlyParam ? '?readonly=true' : ''}`
         : '/meetings/none';
     } else if (href === '/meetings/option-fee') {
       finalHref = meetingUuid
         ? `/meetings/${meetingUuid}/option-fee${readonlyParam ? '?readonly=true' : ''}`
         : '/meetings/none';
     } else {
       finalHref = withMeetingUuid(href);
     }
    router.push(finalHref)
    onClose()
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      })
    } catch (err: unknown) {
      console.error('로그아웃 API 실패', err)
    } finally {
      setUser(null)
      onClose()
      router.replace('/')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
      <aside
        className="fixed left-0 top-0 h-full w-[50%] max-w-sm bg-[var(--wf-surface)] p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile */}
        <nav className="space-y-1">
          <div
            onClick={() => handleNavigate(isLoggedIn ? '/my' : '/')}
            className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-[var(--wf-accent)]"
          >
            <div className="h-12 w-12 rounded-full bg-[var(--wf-accent)] flex items-center justify-center overflow-hidden border">
              {isLoading ? (
                <div className="h-full w-full bg-gray-300 animate-pulse rounded-full" />
              ) : user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt="프로필 이미지"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {user?.name?.[0] ?? '?'}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-base font-semibold">
                {user?.name ?? '로그인 필요'}
              </p>
            </div>
          </div>

          {isLoggedIn && MY_MENUS.map(({ label, href, icon: Icon }) => (
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

        {/* MEETING */}
        <nav className="space-y-1">
          <p className="text-xs font-semibold">MEETING</p>
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

        {/* PERSONAL */}
        <nav className="space-y-1">
          <p className="text-xs font-semibold">PERSONAL</p>
          {EXTRA_MENUS.map(({ label, href, icon: Icon }) => (
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

        {/* About */}
        <nav className="space-y-1">
          <p className="text-xs font-semibold">ABOUT</p>
          {ABOUT_MENUS.map(({ label, href, icon: Icon }) => (
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
                router.push('/')
              }}
              className="flex w-full items-center justify-center rounded-xl px-4 py-3 bg-[var(--wf-accent)] text-white"
            >
              로그인
            </button>
          )}
        </div>
      </aside>
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