// src/components/layout/BottomTabNav.tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Home, PlusCircle, MapPin, CheckCircle, Users } from 'lucide-react'
import clsx from 'clsx'

export default function BottomTabNav() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const readonlyParam = searchParams.get('readonly') === 'true'

  let meetingUuid = searchParams.get('meetingUuid')

  if (!meetingUuid) {
    const match = pathname.match(/\/meetings\/([^/]+)\/complete/)
    meetingUuid = match?.[1] ?? null
  }

  const buildHref = (basePath: string) => {
    if (!meetingUuid) return basePath

    const params = new URLSearchParams()
    params.set('meetingUuid', meetingUuid)
    if (readonlyParam) params.set('readonly', 'true')

    return `${basePath}?${params.toString()}`
  }

  const TABS = [
    { label: '모임리스트', href: '/meetings/new', icon: Home },
    {
      label: '모임생성',
      href: buildHref('/meetings/new/step1-basic'),
      icon: PlusCircle,
    },
    {
      label: '참여자설정',
      href: buildHref('/meetings/new/step2-meetingmembers'),
      icon: Users,
    },
    {
      label: '추천장소',
      href: buildHref('/meetings/new/step3-result'),
      icon: MapPin,
    },
    {
      label: '확정내용',
      href: meetingUuid
        ? `/meetings/${meetingUuid}/complete${readonlyParam ? '?readonly=true' : ''}`
        : `/meetings/none`,
      icon: CheckCircle,
    },
  ]

  return (
      <nav className="flex w-full items-center justify-between bg-[var(--wf-bg-soft)]">
        {TABS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href.split('?')[0])

          return (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="group flex flex-1 flex-col items-center gap-1 py-2"
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
                    ? 'font-semibold'
                    : 'text-[var(--wf-subtle)]'
                )}
              >
                {label}
              </span>
            </button>
          )
        })}
      </nav>
  )
}