// src/components/ui/Button.tsx
"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant =
  | "primary"
  | "neutral"
  | "outline"
  | "ghost"
  | "destructive"
  | "kakao";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  children,
  className,
  variant = "neutral",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        // ✅ 공통 스타일 (절대 건들지 말 것)
        "flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",

        // ✅ size
        {
          "px-3 py-1 text-sm": size === "sm",
          "px-4 py-3 text-base": size === "md",
          "px-6 py-4 text-lg": size === "lg",
        },

        // ✅ variant styles
        {
          // 기본 Primary
          "bg-[var(--primary)] text-[var(--text-inverse)] hover:bg-[var(--primary-strong)]":
            variant === "primary",
          
          // 기본 nentral
          "bg-[var(--neutral-soft)] border border-[var(--neutral-border)] text-[var(--text-primary)] hover:bg-[var(--neutral)]":
            variant === "neutral",

          // Outline (더보기 등)
          "border border-[var(--border)] bg-transparent text-[var(--neutral)] hover:bg-[var(--neutral-soft)]":
            variant === "outline",

          // Ghost (리스트 내부 약한 버튼)
          "bg-transparent text-[var(--neutral)] hover:bg-[var(--neutral-soft)]":
            variant === "ghost",

          // Destructive
          "border border-[var(--danger)] bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white":
            variant === "destructive",

          // Kakao Brand
          "bg-[var(--kakao-yellow)] text-black hover:bg-[#f6dc00]":
            variant === "kakao",
        },

        className
      )}
    >
      {children}
    </button>
  );
}
