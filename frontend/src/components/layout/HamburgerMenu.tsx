// src/components/layout/HamburgerMenu.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight } from "lucide-react";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MANALGAK_STEPS = [
  { step: "", label: "만날각 소개", href: "/about#intro" },
  { step: "", label: "미리 보기", href: "/about#preview" },
  { step: "", label: "만든 사람들", href: "/about#team" },
];

const CREATE_STEPS = [
  { step: "Step 0.", label: "모임 생성", href: "/meetings/new" },
  { step: "Step 1.", label: "날짜 & 시간", href: "/meetings/new/step1-date" },
  { step: "Step 2.", label: "모임 목적", href: "/meetings/new/step2-purpose" },
  { step: "Step 3.", label: "참여 멤버", href: "/meetings/new/step3-members" },
  {
    step: "Step 4.",
    label: "출발지 & 이동수단",
    href: "/meetings/new/step4-origin",
  },
  {
    step: "Step 5.",
    label: "중간지점 & 추천장소",
    href: "/meetings/new/step5-place",
  },
];

const OPTIONS = [
  {
    step: "옵션 1.",
    label: "실시간 위치 공유",
    href: "/meetings/meeting-001/option-location",
  },
  {
    step: "옵션 2.",
    label: "회비 정산",
    href: "/meetings/meeting-001/option-fee",
  },
];

export default function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose}>
      <aside
        className="h-full w-72 bg-[var(--wf-surface)] border-r border-[var(--wf-border)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-base font-semibold">전체 메뉴</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--wf-border)] hover:bg-[var(--wf-muted)]"
            aria-label="메뉴 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="space-y-1 text-sm">
          {/* 만날각 소개 */}
          <section>
            <div className="rounded-xl border border-[var(--wf-border)]">
              <button
                onClick={() => handleNavigate("/about")}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-medium hover:bg-[#FEE500] hover:text-[#191919]"
              >
                만날각 소개
                <ChevronRight className="h-4 w-4 opacity-60" />
              </button>

              <ul className="pt-1 text-[13px] text-[var(--wf-subtle)]">
                {MANALGAK_STEPS.map((item) => (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavigate(item.href)}
                      className="flex w-full rounded-md pl-7 py-2 text-left hover:bg-[#FEE500] hover:text-[#191919]"
                    >
                      <span className="mr-2 font-medium">{item.step}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 모임 생성 */}
          <section>
            <div className="rounded-xl border border-[var(--wf-border)]">
              <button
                onClick={() => handleNavigate("/meetings/new")}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-medium hover:bg-[#FEE500] hover:text-[#191919]"
              >
                모임 생성 (상세설정 스탭확인)
                <ChevronRight className="h-4 w-4 opacity-60" />
              </button>

              <ul className="pt-1 text-[13px] text-[var(--wf-subtle)]">
                {CREATE_STEPS.map((item) => (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavigate(item.href)}
                      className="flex w-full rounded-md pl-7 py-2 text-left hover:bg-[#FEE500] hover:text-[#191919]"
                    >
                      <span className="mr-2 font-medium">{item.step}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 모임 확정 */}
          <section>
            <div className="rounded-xl border border-[var(--wf-border)]">
              <button
                onClick={() => handleNavigate("/meetings/meeting-001/complete")}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-medium hover:bg-[#FEE500] hover:text-[#191919]"
              >
                모임 확정 내용
                <ChevronRight className="h-4 w-4 opacity-60" />
              </button>

              <ul className="pt-1 text-[13px] text-[var(--wf-subtle)]">
                {OPTIONS.map((item) => (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavigate(item.href)}
                      className="flex w-full rounded-md pl-7 py-2 text-left hover:bg-[#FEE500] hover:text-[#191919]"
                    >
                      <span className="mr-2 font-medium">{item.step}</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 내 페이지 */}
          <section>
            <div className="rounded-xl border border-[var(--wf-border)]">
              <button
                onClick={() => handleNavigate("/my")}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-medium hover:bg-[#FEE500] hover:text-[#191919]"
              >
                내 페이지
                <ChevronRight className="h-4 w-4 opacity-60" />
              </button>
            </div>
          </section>
        </nav>
      </aside>
    </div>
  );
}
