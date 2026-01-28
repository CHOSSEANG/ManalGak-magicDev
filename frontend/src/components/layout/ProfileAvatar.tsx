// src/components/layout/ProfileAvatar.tsx
"use client";

import Image from "next/image";
import clsx from "clsx";
import { useMemo, useState } from "react";

interface ProfileAvatarProps {
  src?: string;
  isLoading?: boolean;
  size?: number;
  shape?: "square" | "circle";
  className?: string;
  fallbackText?: string;
}

export default function ProfileAvatar({
  src,
  isLoading = false,
  size = 48,
  shape = "square",
  className,
  fallbackText = "?",
}: ProfileAvatarProps) {
  const radiusClass =
    shape === "circle" ? "rounded-full" : "rounded-xl";

  const [imgError, setImgError] = useState(false);

  // ✅ src 정제 (기존 로직 유지)
  const safeSrc = useMemo(() => {
    const value = typeof src === "string" ? src.trim() : "";
    if (value.length > 0) {
      return value;
    }
    return undefined;
  }, [src]);

  const shouldShowImage =
    isLoading === false && safeSrc !== undefined && imgError === false;

  return (
    <div
      className={clsx(
        "flex items-center justify-center overflow-hidden border",
        "bg-[var(--neutral-soft)] border-[var(--border)]",
        radiusClass,
        className
      )}
      style={{ width: size, height: size }}
      aria-busy={isLoading}
    >
      {/* Loading state */}
      {isLoading && (
        <div
          className={clsx(
            "h-full w-full animate-pulse",
            "bg-[var(--neutral-soft)]",
            radiusClass
          )}
        />
      )}

      {/* Image state */}
      {!isLoading && shouldShowImage && (
        <Image
          src={safeSrc}
          alt="프로필 이미지"
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => {
            setImgError(true);
          }}
        />
      )}

      {/* Fallback state */}
      {!isLoading && !shouldShowImage && (
        <span className="select-none text-sm font-semibold text-[var(--text)]">
          {fallbackText[0] ?? "?"}
        </span>
      )}
    </div>
  );
}
