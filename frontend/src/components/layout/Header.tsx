// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import HamburgerMenu from "@/components/layout/HamburgerMenu";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ⭐ QueryClient는 반드시 컴포넌트 생명주기 동안 유지
  const [queryClient] = useState(() => new QueryClient());

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <>
        {/* Header Container */}
        <Card className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]">
          <header className="flex h-14 items-center justify-between px-4">
            {/* LEFT : Logo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="flex h-10 items-center"
                >
                  <Image
                    src="/images/logo.svg"
                    alt="만날각 로고"
                    width={96}
                    height={24}
                    priority
                    className="h-6 w-24"
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>메인 화면으로 이동</TooltipContent>
            </Tooltip>

            {/* RIGHT : Hamburger Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-expanded={menuOpen}
                  aria-label="전체 메뉴 열기"
                  onClick={toggleMenu}
                  className="border-[var(--border)] bg-[var(--bg-soft)]"
                >
                  {menuOpen ? (
                    <X className="h-5 w-5 text-[var(--text)]" />
                  ) : (
                    <Menu className="h-5 w-5 text-[var(--text)]" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>전체 메뉴</TooltipContent>
            </Tooltip>
          </header>
        </Card>

        {/* Global Navigation */}
        <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} />
      </>
    </QueryClientProvider>
  );
}
