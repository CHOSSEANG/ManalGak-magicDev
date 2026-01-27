// src/components/layout/ProfileAvatar.tsx
'use client'

import Image from 'next/image'
import clsx from 'clsx'
import { useMemo, useState } from 'react'

interface ProfileAvatarProps {
  src?: string
  isLoading?: boolean
  size?: number
  shape?: 'square' | 'circle' 
  className?: string
  fallbackText?: string // ✅ 추가: 기본 표시(이니셜)로 쓸 텍스트
}

export default function ProfileAvatar({
  src,
  isLoading = false,
  size = 48,
  shape = 'square',
  className,
  fallbackText = '?',
}: ProfileAvatarProps) {
  const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl'
  const [imgError, setImgError] = useState(false)

  // ✅ src가 빈 문자열/공백이면 undefined로 처리
  const safeSrc = useMemo(() => {
    const v = typeof src === 'string' ? src.trim() : ''
    return v.length > 0 ? v : undefined
  }, [src])

  const shouldShowImage = !isLoading && !!safeSrc && !imgError

  return (
    <div
      className={clsx(
        'flex items-center justify-center overflow-hidden border bg-[var(--wf-accent)]',
        radiusClass,
        className
      )}
      style={{ width: size, height: size }}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <div className={clsx('h-full w-full animate-pulse bg-gray-300', radiusClass)} />
      ) : shouldShowImage ? (
        <Image
          src={safeSrc!}
          alt="프로필 이미지"
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)} // ✅ 로드 실패 시 fallback으로 전환
        />
      ) : (
        // ✅ 여기(원래 null 자리)가 “기본 이미지/기본 UI” 콜백 자리
        <span className="select-none text-sm font-semibold text-white">
          {fallbackText?.[0] ?? '?'}
        </span>
      )}
    </div>
  )
}
