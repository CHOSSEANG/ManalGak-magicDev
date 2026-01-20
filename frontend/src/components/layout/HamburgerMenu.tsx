// src/components/layout/HamburgerMenu.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";

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
} from 'lucide-react'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

interface User {
  name: string
  profileImage?: string
}

const MY_MENUS = [{ label: '내 모임', href: '/meetings/new', icon: Calendar }]
const MENUS = [
  { label: '모임 만들기', href: '/meetings/new/step1-basic', icon: SquareMousePointer },
  { label: '참여자 설정', href: '/meetings/new/step2-meetingmembers', icon: Users },
  { label: '추천 장소 선택', href: '/meetings/new/step3-result', icon: MapPin },
  { label: '모임 확정', href: '/meetings/meeting-001/complete', icon: CheckCircle },
]
const EXTRA_MENUS = [
  { label: '지도 서비스', href: '/meetings/meeting-001/option-location', icon: LocateFixed },
  { label: '회비 계산기', href: '/meetings/meeting-001/option-fee', icon: Calculator },
]

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 메뉴 열릴 때 캐시 확인 후 즉시 UI 반영, 없으면 fetch
  useEffect(() => {
    if (!isOpen) return

    const cachedUser = localStorage.getItem('user')
    if (cachedUser) {
      setUser(JSON.parse(cachedUser)) // 즉시 UI 반영
      return
    }

    setIsLoading(true)
    const fetchMe = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include',
        })
        if (!res.ok) throw new Error('not logged in')

        const json = await res.json()
        const userData = {
          name: json.data.nickname,
          profileImage: json.data.profileImageUrl,
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
      } catch{
        setUser(null)
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMe()
  }, [isOpen])

  const isLoggedIn = !!user

  const handleNavigate = (href: string) => {
    router.push(href)
    onClose()
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      })
    } catch {
      console.error('로그아웃 API 실패')
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      onClose()
      router.replace('/')
    }
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
                {isLoading ? '...' : user?.name ?? '로그인 필요'}
              </p>
            </div>
          </div>

          {/* 로그인 후 MY_MENUS */}
          {!isLoading &&
            isLoggedIn &&
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
          {!isLoading && isLoggedIn ? (
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
