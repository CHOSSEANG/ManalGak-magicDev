// src/components/layout/HamburgerMenu.tsx
'use client'

import { useRouter } from 'next/navigation'
import {
  Calendar,
  PlusCircle,
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
/** 메인 플로우 메뉴 */
const MENUS = [

  { label: '모임 만들기', href: '/meetings/new/step1-basic', icon: Users },
  { label: '추천 장소 선택', href: '/meetings/new/step5-place', icon: MapPin },
  { label: '모임 확정', href: '/meetings/meeting-001/complete', icon: CheckCircle },
]

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
        {/* Menu List */}
        <nav className="space-y-1">
          {MY_MENUS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavigate(href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-[var(--wf-hover)]"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-[var(--wf-subtle)]" />
                <span className="text-base font-medium">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>
          ))}
        </nav>


        {/* Divider */}
        <div className="my-4 border-t border-[var(--wf-border)]" />

        
        {/* Menu List */}
        <nav className="space-y-1">
          <p className="flex w-full text-xs font-semibold text-[var(--wf-text)] ">MEETING</p>
          {MENUS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavigate(href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-[var(--wf-hover)]"
            >
              <div className="flex items-center gap-4">
                <Icon className="h-5 w-5 text-[var(--wf-subtle)]" />
                <span className="text-base font-medium">{label}</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-[var(--wf-border)]" />

        {/* Extra Menus */}
        <nav className="space-y-1">
          <p className="flex w-full text-xs font-semibold text-[var(--wf-text)] ">PERSONAL</p>
          {EXTRA_MENUS.map(({ label, href, icon: Icon }) => (
            <button
              key={href}
              onClick={() => handleNavigate(href)}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-[var(--wf-hover)]"
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
              // TODO: logout logic
              onClose()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--wf-text)] bg-[var(--wf-muted)] hover:bg-[var(--wf-hover)]"
          >
            <LogOut className="h-5 w-5" />
            로그아웃
          </button>
        </div>
      </aside>
    </div>
  )
}
