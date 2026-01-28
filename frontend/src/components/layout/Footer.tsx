// src/components/layout/Footer.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  // ✅ openLink 정의 추가 (기존 동작 그대로)
  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <footer
      className="w-full border-t border-[var(--border)] bg-[var(--bg)] pb-[var(--bottom-cta-height)]"
      aria-label="사이트 푸터"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 text-xs">
        {/* LEFT : Brand */}
        <span className="text-[var(--text-subtle)]">© 2026 ManalGak</span>

        {/* RIGHT : Family Links */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-1 text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]"
            aria-label="패밀리 링크 열기"
          >
            패밀리 링크
            <ChevronDown className="h-3 w-3 text-[var(--text-subtle)]" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-56 border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]"
          >
            <DropdownMenuItem onSelect={() => openLink("/about")}>
              만날각 소개 & 만든사람들
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() =>
                openLink("https://github.com/CHOSSEANG/ManalGak-magicDev.git")
              }
            >
              만날각 GitHub
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() =>
                openLink(
                  "https://www.notion.so/MagicDev-2d907cb40308808a871df339cb7b264c",
                )
              }
            >
              만날각 Notion
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() =>
                openLink(
                  "https://www.figma.com/design/bLBe9NwstkTnikd5h2tAJg/magicDev-%EC%B9%B4%EC%98%A4api",
                )
              }
            >
              만날각 Figma 디자인회의
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => openLink("https://miro.com/welcomeonboard/...")}>
              만날각 miro 기획회의
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => openLink("https://webicapp.com/")}>
              이전 프로젝트 보기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </footer>
  );
}
