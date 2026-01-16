// src/components/layout/Header.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import HamburgerMenu from '@/components/layout/HamburgerMenu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-30 mb-4 h-14 px-4 flex items-center justify-between bg-[var(--wf-bg)] border-b border-[var(--wf-border)]">
        {/* LEFT : Logo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/meetings/new"
              onClick={closeMenu}
              className="flex h-10 items-center"
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

        {/* RIGHT : Hamburger */}
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
      </header>

      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  )
}
