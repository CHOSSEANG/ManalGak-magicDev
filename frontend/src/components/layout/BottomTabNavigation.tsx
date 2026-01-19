'use client'

import { usePathname, useRouter } from 'next/navigation'
import BottomCTA from '@/components/layout/BottomCTA'
import {
  Home,
  PlusCircle,
  MapPin,
  CheckCircle,
  User,
} from 'lucide-react'
import clsx from 'clsx'

const TABS = [
  { label: '메인', href: '/', icon: Home },
  { label: '모임생성', href: '/meetings/new', icon: PlusCircle },
  { label: '추천장소', href: '/meetings/new/step5-place', icon: MapPin },
  {
    label: '확정내용',
    href: '/meetings/meeting-001/complete',
    icon: CheckCircle,
  },
  { label: '내정보', href: '/my', icon: User },
]

export default function BottomTabNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <BottomCTA>
      <nav className="flex w-full items-center justify-between bg-[var(--wf-bg-soft)] border-t border-[var(--wf-border)]">
        {TABS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href)

          return (
            <button
              key={href}
              type="button"
              onClick={() => router.push(href)}
              className="group flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              {/* 아이콘 영역 */}
              <div
                className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-full transition-colors  hover:bg-[var(--wf-highlight)]',
                  isActive
                    ? 'bg-[var(--wf-highlight)]'
                    : 'bg-transparent'
                )}
              >
                <Icon
                  className={clsx(
                    'h-5 w-5 transition-colors',
                    isActive
                      ? 'text-[var(--wf-accent)]'
                      : 'text-[var(--wf-subtle)] group-hover:text-[var(--wf-accent)]'
                  )}
                />
              </div>

              {/* 라벨 */}
              <span
                className={clsx(
                  'text-xs transition-colors',
                  isActive
                    ? 'font-semibold text-[var(--wf-text)]'
                    : 'font-normal text-[var(--wf-subtle)] group-hover:text-[var(--wf-text)]'
                )}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </BottomCTA>
  )
}
