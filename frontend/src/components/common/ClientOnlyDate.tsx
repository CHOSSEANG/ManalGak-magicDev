// src/components/common/ClientOnlyDate.tsx
'use client'

import { useEffect, useState } from 'react'

export function ClientOnlyDate({ value }: { value: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <span>
      {/* TODO: hydration 위험 가능성 있음 – 수동 확인 필요 */}
      {new Date(value).toLocaleString('ko-KR')}
    </span>
  )
}
