// src/components/layout/ProfileIdentity.tsx
"use client";

import clsx from "clsx";
import ProfileAvatar from "./ProfileAvatar";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileIdentityProps {
  src?: string;
  name?: string;
  isLoading?: boolean;
  size?: number;
  layout?: "row" | "column";
  shape?: "square" | "circle";
  className?: string;
}

export default function ProfileIdentity({
  src,
  name,
  isLoading = false,
  size = 48,
  layout = "row",
  shape = "square",
  className,
}: ProfileIdentityProps) {
  const isRowLayout = layout === "row";

  const safeName = typeof name === "string" ? name.trim() : "";
  const fallbackText = safeName.length > 0 ? safeName[0] : "?";

  return (
    <div
      className={clsx(
        "flex",
        isRowLayout ? "items-center gap-3" : "flex-col items-center gap-2",
        className
      )}
    >
      {/* Avatar */}
      <ProfileAvatar
        src={src}
        isLoading={isLoading}
        size={size}
        shape={shape}
        fallbackText={fallbackText}
      />

      {/* Name / Loading (명확한 상태 분리) */}
      {safeName.length > 0 && (
        <>
          {isLoading ? (
            <Skeleton
              className={clsx(
                "h-4 rounded-md animate-pulse bg-[var(--neutral-soft)]",
                isRowLayout ? "w-24" : "w-20"
              )}
            />
          ) : (
            <span
              className={clsx(
                "font-semibold text-[var(--text)]",
                isRowLayout ? "text-base" : "text-sm text-center"
              )}
            >
              {safeName}
            </span>
          )}
        </>
      )}
    </div>
  );
}
