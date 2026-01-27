// src/components/layout/ProfileIdentity.tsx 
'use client'

import clsx from 'clsx'
import ProfileAvatar from './ProfileAvatar'

interface ProfileIdentityProps {
  src?: string
  name?: string
  isLoading?: boolean
  size?: number
  layout?: 'row' | 'column'   // row = 옆, column = 아래
  shape?: 'square' | 'circle'
  className?: string
}

export default function ProfileIdentity({
  src,
  name,
  isLoading,
  size = 48,
  layout = 'row',
  shape = 'square',
  className,
}: ProfileIdentityProps) {
  return (
    <div
      className={clsx(
        'flex',
        layout === 'row'
          ? 'items-center gap-3'
          : 'flex-col items-center gap-2',
        className
      )}
    >
      <ProfileAvatar
        src={src}
        isLoading={isLoading}
        size={size}
        shape={shape}
      />

      {name && (
        <span
          className={clsx(
            'font-semibold',
            layout === 'row' ? 'text-base' : 'text-sm text-center'
          )}
        >
          {isLoading ? '...' : name}
        </span>
      )}
    </div>
  )
}
