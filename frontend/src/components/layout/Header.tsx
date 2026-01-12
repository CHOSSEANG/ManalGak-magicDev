// src/components/layout/Header.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Bell, User } from 'lucide-react'
import HamburgerMenu from '@/components/layout/HamburgerMenu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)

  const notificationCount = 3

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-30 mb-4 h-14 px-4 flex items-center bg-[var(--wf-bg)] border-b border-[var(--wf-border)]">
        {/* LEFT : Hamburger */}
        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-label="전체 메뉴 열기"
                onClick={toggleMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] hover:bg-[var(--wf-hover)]"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>전체 메뉴</TooltipContent>
          </Tooltip>
        </div>

        {/* CENTER : Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/meetings/new"
                onClick={closeMenu}
                className="flex h-10 items-center justify-center"
              >
                <img
                  src="/images/logo.svg"
                  alt="로고"
                  className="h-6 w-auto"
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent>모임 생성 화면으로 이동</TooltipContent>
          </Tooltip>
        </div>

        {/* RIGHT : Notification + Profile */}
        <div className="ml-auto flex items-center gap-3">
          {/* Notification */}
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    setNotificationOpen((prev) => !prev)
                  }
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--wf-border)] bg-[var(--wf-surface)] hover:bg-[var(--wf-hover)]"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] flex items-center justify-center rounded-full bg-red-500 text-white">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>알림</TooltipContent>
            </Tooltip>

            {notificationOpen && (
              <div className="absolute right-0 mt-1 w-64 rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)] p-3 shadow-lg">
                <p className="mb-2 text-sm font-medium">
                  알림을 누르면 확인 할 수 있습니다.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="border-b border-[var(--wf-border)] pb-2">
                    새로운 모임 요청이 있습니다
                  </li>
                  <li className="border-b border-[var(--wf-border)] pb-2">
                    모임 일정이 변경되었습니다
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Profile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/my"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--wf-border)] bg-[var(--wf-surface)] hover:bg-[var(--wf-hover)]"
              >
                <User className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>내 프로필 상세 보기</TooltipContent>
          </Tooltip>
        </div>
      </header>

      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  )
}
