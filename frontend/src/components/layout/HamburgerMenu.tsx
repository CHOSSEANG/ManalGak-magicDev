// src/components/layout/HamburgerMenu.tsx
'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

const CREATE_STEPS = [
  { label: 'step 1. 날짜/시간 선택', href: '/meetings/new/step1-date' },
  { label: 'step 2. 모임 목적', href: '/meetings/new/step2-purpose' },
  { label: 'step 3. 참여 멤버 및 상태변경', href: '/meetings/new/step3-members' },
  { label: 'step 4. 출발지 & 교통수단', href: '/meetings/new/step4-origin' },
  { label: 'step 5. 중간지점 & 추천장소', href: '/meetings/new/step5-place' },
]

const OPTIONS = [
  { label: '옵션 1. 실시간 위치 공유', href: '/meetings/meeting-001/option-location' },
  { label: '옵션 2. 회비 정산', href: '/meetings/meeting-001/option-fee' },
]

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter()

  const handleNavigate = (href: string) => {
    router.push(href)
    onClose()
  }

  if (!isOpen) return null

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-72 border-r border-[var(--wf-border)] bg-[var(--wf-surface)] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
          <span className="text-base font-semibold">전체 메뉴</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--wf-border)] hover:bg-[var(--wf-hover)]"
            aria-label="메뉴 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      {/* Menu */}
      <nav className="mt-6 space-y-8 text-sm">
        {/* 모일각 소개 */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => handleNavigate('/about')}
            className="text-base font-semibold text-left"
          >
            모일각 소개
          </button>
          <div className="h-px w-full bg-[var(--wf-border)]" />
        </section>

        {/* 모임 생성 */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => handleNavigate('/meetings/new')}
            className="text-base font-semibold text-left"
          >
            모임 생성
          </button>

          <ul className="space-y-2 pl-2">
            {CREATE_STEPS.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className="text-left"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="h-px w-full bg-[var(--wf-border)]" />
        </section>

        {/* 모임 확정 */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => handleNavigate('/meetings/meeting-001/complete')}
            className="text-base font-semibold text-left"
          >
            모임 확정 내용
          </button>

          <ul className="space-y-2 pl-2">
            {OPTIONS.map((item) => (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => handleNavigate(item.href)}
                  className="text-left"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="h-px w-full bg-[var(--wf-border)]" />
        </section>

        {/* 내 페이지 */}
          <section>
            <button
              type="button"
              onClick={() => handleNavigate('/my')}
              className="text-left text-base font-medium"
            >
              내 페이지
            </button>
          </section>
      </nav>

    </aside>
  )
}
