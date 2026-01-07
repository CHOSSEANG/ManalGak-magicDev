// src/components/layout/Header.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import HamburgerMenu from '@/components/layout/HamburgerMenu'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // 와이어프레임 단계: 공통 헤더
  return (
    <>
      <header className="sticky top-0 z-30 mb-4 flex items-center justify-between bg-[var(--wf-bg)] py-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--wf-border)] bg-[var(--wf-surface)]"
          >
            ≡
          </button>
          <div className="flex h-10 items-center justify-center text-xs">
            <img src="/images/logo.svg" alt="로고" className="h-6 w-auto" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--wf-border)] bg-[var(--wf-surface)] text-xs">
            알림
          </div>
          <Link
            href="/my"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--wf-border)] bg-[var(--wf-surface)] text-xs"
          >
            프로필
          </Link>
        </div>
      </header>
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
