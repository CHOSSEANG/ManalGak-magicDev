'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import BottomCTA from '@/components/layout/BottomCTA'
import {
  Home,
  PlusCircle,
  MapPin,
  CheckCircle,
  Users,
} from 'lucide-react'
import clsx from 'clsx'

export default function BottomTabNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ✅ meetingUuid 추출 (query → path fallback)
  let meetingUuid = searchParams.get('meetingUuid')

  if (!meetingUuid) {
    const match = pathname.match(/\/meetings\/([^/]+)\/complete/)
    meetingUuid = match?.[1] ?? null
  }

  const TABS = [
    { label: '메인', href: '/', icon: Home },

    {
      label: '모임생성',
      href: meetingUuid
        ? `/meetings/new/step1-basic?meetingUuid=${meetingUuid}`
        : `/meetings/new/step1-basic`,
      icon: PlusCircle,
    },

    {
      label: '참여자설정',
      href: meetingUuid
        ? `/meetings/new/step2-meetingmembers?meetingUuid=${meetingUuid}`
        : `/meetings/new/step2-meetingmembers`,
      icon: Users,
    },

    {
      label: '추천장소',
      href: meetingUuid
        ? `/meetings/new/step3-result?meetingUuid=${meetingUuid}`
        : `/meetings/new/step3-result`,
      icon: MapPin,
    },

    {
      label: '확정내용',
      href: meetingUuid
        ? `/meetings/${meetingUuid}/complete`
        : `/meetings/complete`,
      icon: CheckCircle,
    },
  ]

  return (
    <BottomCTA>
      <nav className="flex w-full items-center justify-between bg-[var(--wf-bg-soft)] border-t border-[var(--wf-border)]">
        {TABS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href.split('?')[0])

          return (
            <button
              key={label}
              type="button"
              onClick={() => router.push(href)}
              className="group flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <div
                className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-full',
                  isActive && 'bg-[var(--wf-highlight)]'
                )}
              >
                <Icon
                  className={clsx(
                    'h-5 w-5',
                    isActive
                      ? 'text-[var(--wf-accent)]'
                      : 'text-[var(--wf-subtle)]'
                  )}
                />
              </div>

              <span
                className={clsx(
                  'text-xs',
                  isActive
                    ? 'font-semibold text-[var(--wf-text)]'
                    : 'text-[var(--wf-subtle)]'
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
