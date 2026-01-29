// src/components/layout/BottomTabNav.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Home, PlusCircle, CheckCircle, UserPen, SquareMousePointer } from "lucide-react";
import clsx from "clsx";

export default function BottomTabNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const readonlyParam = searchParams.get('readonly') === 'true'

  let meetingUuid = searchParams.get('meetingUuid')

  if (!meetingUuid) {
    const match = pathname.match(/\/meetings\/([^/]+)\/complete/);
    meetingUuid = match?.[1] ?? null;
  }

  const buildHref = (basePath: string) => {
    if (!meetingUuid) return basePath

    const params = new URLSearchParams()
    params.set('meetingUuid', meetingUuid)
    if (readonlyParam) params.set('readonly', 'true')

    return `${basePath}?${params.toString()}`
  }

  const TABS = [
    { label: "홈", href: "/", icon: Home },
    { label: "모임리스트", href: "/meetings/new", icon: SquareMousePointer },
    {
      label: '모임생성',
      href: buildHref('/meetings/new/step1-basic'),
      icon: PlusCircle,
    },
    // {
    //   label: "확정",
    //   href: meetingUuid ? `/meetings/${meetingUuid}/complete` : `/meetings/none`,
    //   label: '참여자설정',
    //   href: buildHref('/meetings/new/step2-meetingmembers'),
    //   icon: Users,
    // },
    // {
    //   label: '추천장소',
    //   href: buildHref('/meetings/new/step3-result'),
    //   icon: MapPin,
    // },
    {
      label: '확정내용',
      href: meetingUuid
        ? `/meetings/${meetingUuid}/complete${readonlyParam ? '?readonly=true' : ''}`
        : `/meetings/none`,
      icon: CheckCircle,
    },
    { label: "마이페이지", href: "/my", icon: UserPen },
  ];

  return (
    <nav
      aria-label="하단 탭 네비게이션"
      className="flex h-12 w-full items-center justify-between bg-[var(--bg)]"
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const hrefPath = href.split("?")[0];

        let isActive = false;

        // ✅ 모임리스트는 정확히 /meetings/new 일 때만 활성
        if (hrefPath === "/meetings/new") {
          isActive = pathname === "/meetings/new";
        } else {
          isActive = pathname.startsWith(hrefPath);
        }

        return (
          <button
            key={label}
            type="button"
            onClick={() => router.push(href)}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 flex-col items-center justify-center"
          >
            <Icon
              className={clsx(
                "h-5 w-5",
                isActive
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-subtle)]"
              )}
            />

            <span
              className={clsx(
                "mt-0.5 text-xs leading-none",
                isActive
                 ? "font-bold text-[var(--primary)]"
                 : "text-[var(--text-subtle)]"
              )}
            >
              {label}
            </span>

            {/* 
            하단 active indicator 제거
            {isActive && (
              <span className="absolute bottom-0 h-[2px] w-6 rounded-full bg-[var(--primary)]" />
            )} 
            */}
          </button>
        );
      })}
    </nav>
  );
}
//               <div
//                 className={clsx(
//                   'flex h-10 w-10 items-center justify-center rounded-full',
//                   isActive && 'bg-[var(--wf-highlight)]'
//                 )}
//               >
//                 <Icon
//                   className={clsx(
//                     'h-5 w-5',
//                     isActive
//                       ? 'text-[var(--wf-accent)]'
//                       : 'text-[var(--wf-subtle)]'
//                   )}
//                 />
//               </div>
//               <span
//                 className={clsx(
//                   'text-xs',
//                   isActive
//                     ? 'font-semibold'
//                     : 'text-[var(--wf-subtle)]'
//                 )}
//               >
//                 {label}
//               </span>
//             </button>
//           )
//         })}
//       </nav>
//   )
// }
