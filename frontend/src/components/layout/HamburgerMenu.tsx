// src/components/layout/HamburgerMenu.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Users,
  MapPin,
  CheckCircle,
  LocateFixed,
  Calculator,
  LogOut,
  ChevronRight,
} from 'lucide-react'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MY_MENUS = [
  { label: '내 모임', href: '/meetings/new', icon: Calendar },
]

const MENUS = [
  { label: '모임 만들기', href: '/meetings/new/step1-basic', icon: Users },
  { label: '추천 장소 선택', href: '/meetings/new/step3-result', icon: MapPin },
  { label: '모임 확정', href: '/meetings/meeting-001/complete', icon: CheckCircle },
]

const EXTRA_MENUS = [
  { label: '실시간 위치 공유', href: '/meetings/meeting-001/option-location', icon: LocateFixed },
  { label: '회비 계산기', href: '/meetings/meeting-001/option-fee', icon: Calculator },
]

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter()

  const [user, setUser] = useState<{
    name: string
    email?: string
    profileImage?: string
  } | null>(null)

  /** 메뉴 열릴 때마다 로그인 상태 확인 */
  useEffect(() => {
    if (!isOpen) return

    const fetchMe = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
          {
            method: 'GET',
            credentials: 'include', // ⭐ 쿠키 JWT 필수
          }
        )

        if (!res.ok) throw new Error('not logged in')

        const json = await res.json()

        const userData = {
          name: json.data.nickname,
          profileImage: json.data.profileImageUrl,
        }

        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      } catch (e) {
        setUser(null)
        localStorage.removeItem('user')
      }
    }

    fetchMe()
  }, [isOpen])

  const isLoggedIn = !!user

  const handleNavigate = (href: string) => {
    router.push(href)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
      <aside
        className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-[var(--wf-surface)] p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile */}
        <nav className="space-y-1">
          <div
            onClick={() => {
              if (isLoggedIn) handleNavigate('/my')
              else handleNavigate('/')
            }}
            className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-[var(--wf-accent)]"
          >
            <div className="h-12 w-12 rounded-full bg-[var(--wf-accent)] flex items-center justify-center overflow-hidden border">
              {user?.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- profile image uses user-provided URL
                <img
                  src={user.profileImage}
                  alt="프로필 이미지"
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

          {/* 로그인 후에만 MY_MENUS */}
          {isLoggedIn &&
            MY_MENUS.map(({ label, href, icon: Icon }) => (
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

        {/* Bottom Button */}
        <div className="mt-auto pt-6">
          {isLoggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem('user')
                onClose()
                router.replace('/')
              }}
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
