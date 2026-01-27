// src/components/layout/Footer.tsx
"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function Footer() {
  // ✅ openLink 정의 추가 (기존 동작 그대로)
  const openLink = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <footer className="w-full border-t border-[var(--wf-border)] pb-[var(--bottom-cta-height)]">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 text-xs">
        {/* 왼쪽: 최소 브랜드 */}
        <span className="text-[var(--wf-text-subtle)]">© Manalgak</span>

        {/* 오른쪽: 패밀리 링크 (shadcn) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded border border-[var(--wf-border)] px-2 py-1">
            패밀리 링크
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-[var(--wf-bg)] border border-[var(--wf-border)]"
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
                openLink("https://www.notion.so/MagicDev-2d907cb40308808a871df339cb7b264c")
              }
            >
              만날각 Notion
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() =>
                openLink(
                  "https://www.figma.com/design/bLBe9NwstkTnikd5h2tAJg/magicDev-%EC%B9%B4%EC%98%A4api"
                )
              }
            >
              만날각 Figma 디자인회의
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() =>
                openLink("https://miro.com/welcomeonboard/...")
              }
            >
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
