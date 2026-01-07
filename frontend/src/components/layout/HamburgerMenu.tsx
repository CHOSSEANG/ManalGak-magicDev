// src/components/layout/HamburgerMenu.tsx

'use client'

import { useRouter } from 'next/navigation'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter()

  const handleNavigate = (href: string) => {
    router.push(href)
    onClose()
  }

  if (!isOpen) return null

  // 와이어프레임 단계: 햄버거 메뉴
  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-72 border-r border-[var(--wf-border)] bg-[var(--wf-surface)] p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--wf-border)]">
          ≡
        </div>
        <button
          type="button"
          onClick={() => handleNavigate('/my')}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--wf-border)] text-xs"
        >
          프로필
        </button>
      </div>

      <div className="mt-6 space-y-6 text-sm">
        <div className="space-y-3">
          <p className="text-base font-semibold">모일각 소개</p>
          <div className="h-px w-full bg-[var(--wf-border)]" />
        </div>

        <div className="space-y-3">
          <p className="text-base font-semibold">모임 생성</p>
          <div className="space-y-2">
            <button type="button" onClick={() => handleNavigate('/meetings/new/step1-date')}>
              step 1. 날짜/시간 선택
            </button>
            <button type="button" onClick={() => handleNavigate('/meetings/new/step2-purpose')}>
              step 2. 모임 목적
            </button>
            <button type="button" onClick={() => handleNavigate('/meetings/new/step3-members')}>
              step 3. 참여 멤버 및 상태변경
            </button>
            <button type="button" onClick={() => handleNavigate('/meetings/new/step4-origin')}>
              step 4. 출발지 & 교통수단
            </button>
            <button type="button" onClick={() => handleNavigate('/meetings/new/step5-place')}>
              step 5. 중간지점 & 추천장소
            </button>
          </div>
          <div className="h-px w-full bg-[var(--wf-border)]" />
        </div>

        <div className="space-y-3">
          <p className="text-base font-semibold">모임 확정</p>
          <div className="space-y-2">
            <button type="button" onClick={() => handleNavigate('/meetings/meeting-001/option-location')}>
              옵션 1. 실시간
            </button>
            <button type="button" onClick={() => handleNavigate('/meetings/meeting-001/option-fee')}>
              옵션 2. 회비정산
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <button type="button" onClick={() => handleNavigate('/my')}>
          내 페이지
        </button>
        <button type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    </aside>
  )
}
