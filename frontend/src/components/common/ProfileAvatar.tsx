'use client'

import Image from 'next/image'
import clsx from 'clsx'

interface ProfileAvatarProps {
  src?: string
  isLoading?: boolean
  size?: number               // 기본 48
  shape?: 'square' | 'circle' // 기본 square
  className?: string
}

export default function ProfileAvatar({
  src,
  isLoading = false,
  size = 48,
  shape = 'square',
  className,
}: ProfileAvatarProps) {
  const radiusClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl'

  return (
    <div
      className={clsx(
        'flex items-center justify-center overflow-hidden border bg-[var(--wf-accent)]',
        radiusClass,
        className
      )}
      style={{ width: size, height: size }}
    >
      {isLoading ? (
        <div
          className={clsx(
            'h-full w-full animate-pulse bg-gray-300',
            radiusClass
          )}
        />
      ) : src ? (
        <Image
          src={src}
          alt="프로필 이미지"
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : null}
    </div>
  )
}
