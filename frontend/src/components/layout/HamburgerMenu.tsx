// src/components/layout/HamburgerMenu.tsx
'use client'

import Link from 'next/link'
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

<<<<<<< HEAD
/** 메인 플로우 메뉴 */
const MENUS = [
  { label: '모임 만들기', href: '/meetings/new/step1-basic', icon: Users },
  { label: '추천 장소 선택', href: '/meetings/new/step5-place', icon: MapPin },
  { label: '모임 확정', href: '/meetings/meeting-001/complete', icon: CheckCircle },
]
=======
const CREATE_STEPS = [
  { label: "모임 리스트 보기", href: "/meetings/new" },
  { step: "Step 1.", label: "기본 정보", href: "/meetings/new/step1-basic" },
  {
    step: "Step 2.",
    label: "참여 멤버",
    href: "/meetings/new/step2-meetingmembers",
  },
  {
    step: "Step 3.",
    label: "중간지점 & 추천장소",
    href: "/meetings/new/step3-result",
  },
];
>>>>>>> origin/frontend/9rii/step3_4

/** 하단 옵션 메뉴 */
const EXTRA_MENUS = [
  { label: '실시간 위치 공유', href: '/meetings/meeting-001/option-location', icon: LocateFixed },
  { label: '회비 계산기', href: '/meetings/meeting-001/option-fee', icon: Calculator },
]

export default function HamburgerMenu({
  isOpen,
  onClose,
}: HamburgerMenuProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleNavigate = (href: string) => {
    router.push(href)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
      {/* Drawer */}
      <aside
        className="fixed left-0 top-0 h-full w-[85%] max-w-sm bg-[var(--wf-surface)] p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile */}
        <nav className="space-y-1">
          <Link
            href="/my"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-[var(--wf-accent)] active:bg-[var(--wf-accent)]"
          >
            <div className="h-12 w-12 rounded-full bg-[var(--wf-accent)] flex items-center justify-center overflow-hidden border border-[var(--wf-border)]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3QGgGtn4zUi2Q5Ee1vmAFie8A-B9HrkyA3SLakKMzouzeQgmqLVy2eqlUGFW21W7Uhfwe_6B3LJhu7B6gqIH8PtxvZ5VuwmFjwMIfCdf8t0FFiEtzVno2GI9GmYpZPaHki3CvleZbugNP1J2-qcDO75kqexuHAqntXxRuRVEb_dZZpUrFPSidKPXL-PDzIxfzsi_hUKCgTSRcxv_A6HJoZtHV4zRKBRTrGJQEp9Nap8aCIHZAaCgD8zQd3fPgtB5hpxVGyEvBD9tr"
                alt="사용자 프로필 이미지"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-base font-semibold text-[var(--wf-text)] leading-tight">
                김만날
              </p>
              <p className="text-xs text-[var(--wf-subtle)] mt-0.5">
                mannal_kim@email.com
              </p>
            </div>
          </Link>

          {MY_MENUS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavigate(href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition hover:bg-[var(--wf-highlight-soft)] active:bg-[var(--wf-accent)]"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-[var(--wf-subtle)]" />
                <span className="text-base font-medium">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>
          ))}
        </nav>

        <div className="my-4 border-t border-[var(--wf-border)]" />

        {/* Meeting */}
        <nav className="space-y-1">
          <p className="text-xs font-semibold text-[var(--wf-text)]">MEETING</p>
          {MENUS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavigate(href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition hover:bg-[var(--wf-highlight-soft)] active:bg-[var(--wf-accent)]"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-[var(--wf-subtle)]" />
                <span className="text-base font-medium">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>
          ))}
        </nav>

        <div className="my-4 border-t border-[var(--wf-border)]" />

        {/* Personal */}
        <nav className="space-y-1">
          <p className="text-xs font-semibold text-[var(--wf-text)]">PERSONAL</p>
          {EXTRA_MENUS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavigate(href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition hover:bg-[var(--wf-highlight-soft)] active:bg-[var(--wf-accent)]"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-[var(--wf-subtle)]" />
                <span className="text-base font-medium">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6">
          <button
            onClick={() => {
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--wf-text)] 
            bg-[var(--wf-highlight)] hover:bg-[var(--wf-accent)]"
          >
            <LogOut className="h-5 w-5" />
            로그아웃
          </button>
        </div>
      </aside>
    </div>
  )
}
